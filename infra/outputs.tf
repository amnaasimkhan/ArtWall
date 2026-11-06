output "app_url" {
  description = "Open this in a browser"
  value       = local.app_url
}

output "aws_region" {
  value = var.aws_region
}

output "ecr_registry" {
  value = local.ecr_registry
}

output "web_repository_url" {
  value = aws_ecr_repository.repo["web"].repository_url
}

output "app_repository_url" {
  value = aws_ecr_repository.repo["app"].repository_url
}

output "github_actions_role_arn" {
  description = "Put this in the GitHub secret AWS_ROLE_ARN (empty in lab_mode)"
  value       = local.create_iam ? aws_iam_role.github_actions[0].arn : ""
}

output "asg_name" {
  value = aws_autoscaling_group.hosts.name
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "admin_login" {
  description = "Admin login for /admin (terraform output -json admin_login)"
  value       = { name = var.admin_name, password = random_password.admin.result }
  sensitive   = true
}
