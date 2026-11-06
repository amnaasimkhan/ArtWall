# ---------------- Container hosts: Launch Template + Auto Scaling Group ----------------
data "aws_ssm_parameter" "al2023_x86" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

locals {
  ecr_registry          = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
  instance_profile_name = var.lab_mode ? "LabInstanceProfile" : aws_iam_instance_profile.host[0].name
  host_tags = {
    Name    = "${local.name}-host"
    Project = var.project
    Role    = "app-host"
  }
}

resource "aws_launch_template" "host" {
  name_prefix   = "${local.name}-host-"
  image_id      = data.aws_ssm_parameter.al2023_x86.value
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.host.id]

  iam_instance_profile {
    name = local.instance_profile_name
  }

  user_data = base64encode(templatefile("${path.module}/templates/host_user_data.sh.tftpl", {
    aws_region    = var.aws_region
    ecr_registry  = local.ecr_registry
    web_image     = aws_ecr_repository.repo["web"].repository_url
    app_image     = aws_ecr_repository.repo["app"].repository_url
    param_path    = "/${var.project}/"
    log_prefix    = "/${var.project}"
    deploy_sh_b64 = filebase64("${path.module}/../deploy/deploy.sh")
    compose_b64   = filebase64("${path.module}/../deploy/docker-compose.prod.yml")
  }))

  # IMDSv2 only, hop limit 1: containers cannot reach the instance metadata service,
  # so they cannot borrow the host's IAM role credentials.
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = 10
      volume_type           = "gp3"
      encrypted             = true
      delete_on_termination = true
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags          = local.host_tags
  }

  tag_specifications {
    resource_type = "volume"
    tags          = local.host_tags
  }
}

resource "aws_autoscaling_group" "hosts" {
  name                = "${local.name}-asg"
  vpc_zone_identifier = aws_subnet.app[*].id # private subnets in two AZs
  min_size            = var.asg_min
  desired_capacity    = var.asg_desired
  max_size            = var.asg_max
  target_group_arns   = [aws_lb_target_group.web.arn]

  # Replace instances that fail the ALB health check. The long grace period lets a brand-new
  # environment wait for the first CI/CD run to push images.
  health_check_type         = "ELB"
  health_check_grace_period = 600

  enabled_metrics = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupTotalInstances"]

  launch_template {
    id      = aws_launch_template.host.id
    version = aws_launch_template.host.latest_version
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
  }

  dynamic "tag" {
    for_each = local.host_tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }

  # Scaling policies change desired capacity; don't let `terraform apply` undo that.
  lifecycle {
    ignore_changes = [desired_capacity]
  }

  depends_on = [
    aws_route.app_nat_instance,
    aws_route.app_nat_gateway,
    aws_ssm_parameter.config,
    aws_ssm_parameter.secret,
  ]
}

# Elasticity: add/remove instances to keep average CPU near the target
resource "aws_autoscaling_policy" "cpu_target" {
  name                   = "${local.name}-cpu-target-tracking"
  autoscaling_group_name = aws_autoscaling_group.hosts.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = var.cpu_target
  }
}
