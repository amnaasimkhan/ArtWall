# ---------------- Database tier: Amazon RDS for MySQL ----------------
# MySQL 8.4 LTS: RDS MySQL 8.0 left standard support on 31 July 2026 and now incurs
# Extended Support charges, so 8.0 would cost extra.

resource "random_password" "db" {
  length  = 32
  special = false # avoids characters RDS or .env files treat specially
}

resource "aws_db_subnet_group" "main" {
  name       = "${local.name}-db-subnets"
  subnet_ids = aws_subnet.db[*].id
  tags       = { Name = "${local.name}-db-subnets" }
}

resource "aws_db_parameter_group" "mysql" {
  name   = "${local.name}-mysql84"
  family = "mysql8.4"

  # Reject any unencrypted client connection
  parameter {
    name  = "require_secure_transport"
    value = "1"
  }
}

resource "aws_db_instance" "main" {
  identifier     = "${local.name}-db"
  engine         = "mysql"
  engine_version = "8.4"
  instance_class = var.db_instance_class

  allocated_storage = 20
  storage_type      = "gp2"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  parameter_group_name   = aws_db_parameter_group.mysql.name
  publicly_accessible    = false
  multi_az               = var.db_multi_az

  backup_retention_period    = var.db_backup_retention_days
  auto_minor_version_upgrade = true
  apply_immediately          = true

  enabled_cloudwatch_logs_exports = ["error"]

  # Coursework settings so `terraform destroy` cleans up completely.
  # In production: deletion_protection = true and keep a final snapshot.
  skip_final_snapshot = true
  deletion_protection = false

  tags = { Name = "${local.name}-db" }
}
