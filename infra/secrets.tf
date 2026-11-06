# ---------------- Configuration & secrets: SSM Parameter Store ----------------
# Every value the app needs lives under /<project>/. Instances read them at deploy time
# with their IAM role; nothing is hardcoded in code, images, or the repository.
# Standard parameters (String and SecureString) are free.

resource "random_password" "admin" {
  length  = 16
  special = false
}

resource "random_password" "jwt" {
  length  = 48
  special = false
}

locals {
  app_url = "http://${aws_lb.web.dns_name}"

  config_params = {
    DB_HOST      = aws_db_instance.main.address
    DB_PORT      = tostring(aws_db_instance.main.port)
    DB_NAME      = var.db_name
    DB_USER      = var.db_username
    DB_SSL       = "true"
    FRONTEND_URL = local.app_url
    CORS_ORIGIN  = local.app_url
    ADMIN_NAME   = var.admin_name
    ADMIN_EMAIL  = var.admin_email
  }

  secret_params = {
    DB_PASSWORD    = random_password.db.result
    JWT_SECRET_KEY = random_password.jwt.result
    ADMIN_PASSWORD = random_password.admin.result
  }
}

resource "aws_ssm_parameter" "config" {
  for_each = local.config_params
  name     = "/${var.project}/${each.key}"
  type     = "String"
  value    = each.value
}

resource "aws_ssm_parameter" "secret" {
  for_each = local.secret_params
  name     = "/${var.project}/${each.key}"
  type     = "SecureString" # encrypted with the AWS-managed KMS key aws/ssm
  value    = each.value
}

# You can paste the real Stripe test key here via terraform.tfvars, or change it later in the
# console (Systems Manager > Parameter Store); Terraform will not overwrite console edits.
resource "aws_ssm_parameter" "stripe" {
  name  = "/${var.project}/STRIPE_SECRET_KEY"
  type  = "SecureString"
  value = var.stripe_secret_key
  lifecycle {
    ignore_changes = [value]
  }
}

# Image tag currently deployed. CI/CD updates this; new instances started by auto scaling
# read it, so every instance always runs the same release.
resource "aws_ssm_parameter" "image_tag" {
  name  = "/${var.project}/IMAGE_TAG"
  type  = "String"
  value = "latest"
  lifecycle {
    ignore_changes = [value]
  }
}
