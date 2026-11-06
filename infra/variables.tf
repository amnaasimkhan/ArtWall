variable "aws_region" {
  description = "AWS region (AWS Academy Learner Lab only allows us-east-1 or us-west-2)"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Name prefix and Project tag for every resource"
  type        = string
  default     = "artwall"
}

variable "github_repo" {
  description = "GitHub repository allowed to deploy, as owner/name, exactly as GitHub shows it (e.g. your-username/ArtWall)"
  type        = string
}

variable "lab_mode" {
  description = "true for AWS Academy Learner Lab: reuse LabRole/LabInstanceProfile and skip creating IAM roles and the GitHub OIDC provider (Learner Lab forbids both)"
  type        = bool
  default     = false
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub OIDC identity provider. Set false if your account already has one."
  type        = bool
  default     = true
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "nat_mode" {
  description = "\"instance\" = cheap NAT instance (~$3/mo), \"gateway\" = managed NAT Gateway (~$33/mo + data)"
  type        = string
  default     = "instance"
  validation {
    condition     = contains(["instance", "gateway"], var.nat_mode)
    error_message = "nat_mode must be \"instance\" or \"gateway\"."
  }
}

variable "instance_type" {
  description = "EC2 type for the container hosts"
  type        = string
  default     = "t3.micro"
}

variable "asg_min" {
  type    = number
  default = 1
}

variable "asg_desired" {
  type    = number
  default = 2
}

variable "asg_max" {
  type    = number
  default = 4
}

variable "cpu_target" {
  description = "Average CPU % the Auto Scaling Group tries to hold (target tracking)"
  type        = number
  default     = 50
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "db_multi_az" {
  description = "Standby replica in a second AZ (roughly doubles DB cost)"
  type        = bool
  default     = false
}

variable "db_name" {
  type    = string
  default = "artwall"
}

variable "db_username" {
  type    = string
  default = "artwall_admin"
}

variable "db_backup_retention_days" {
  description = "Automated backup retention. Set 0 if your free-plan account rejects backups."
  type        = number
  default     = 1
}

variable "stripe_secret_key" {
  description = "Stripe test secret key (sk_test_...). Stored only in SSM Parameter Store as a SecureString."
  type        = string
  sensitive   = true
  default     = "sk_test_replace_me"
}

variable "log_retention_days" {
  type    = number
  default = 7
}

variable "admin_name" {
  description = "Admin account (log in at /admin with this name). Created automatically on deploy."
  type        = string
  default     = "admin"
}

variable "admin_email" {
  type    = string
  default = "admin@artwall.com"
}
