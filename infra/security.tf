# ---------------- Security groups (one per tier, least privilege) ----------------
#   Internet --80--> ALB --80--> container hosts --3306--> RDS
# Rules reference security groups, not IP ranges, so only the tier in front can connect.
# No SSH anywhere: hosts are administered through SSM Session Manager.

resource "aws_security_group" "alb" {
  name        = "${local.name}-alb-sg"
  description = "Web entry point: HTTP from the internet"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${local.name}-alb-sg" }
}

resource "aws_security_group" "host" {
  name        = "${local.name}-host-sg"
  description = "Container hosts (web + app tiers): HTTP from the ALB only"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${local.name}-host-sg" }
}

resource "aws_security_group" "db" {
  name        = "${local.name}-db-sg"
  description = "RDS MySQL: 3306 from the container hosts only"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${local.name}-db-sg" }
  # No egress rules: Terraform removes AWS's default allow-all egress
}

# ALB
resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  description       = "HTTP from anywhere"
}

resource "aws_vpc_security_group_egress_rule" "alb_to_hosts" {
  security_group_id            = aws_security_group.alb.id
  referenced_security_group_id = aws_security_group.host.id
  ip_protocol                  = "tcp"
  from_port                    = 80
  to_port                      = 80
  description                  = "Forward to container hosts"
}

# Container hosts
resource "aws_vpc_security_group_ingress_rule" "host_from_alb" {
  security_group_id            = aws_security_group.host.id
  referenced_security_group_id = aws_security_group.alb.id
  ip_protocol                  = "tcp"
  from_port                    = 80
  to_port                      = 80
  description                  = "HTTP from the ALB only"
}

resource "aws_vpc_security_group_egress_rule" "host_https" {
  security_group_id = aws_security_group.host.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  description       = "HTTPS out via NAT: ECR, SSM, CloudWatch, OS packages"
}

resource "aws_vpc_security_group_egress_rule" "host_to_db" {
  security_group_id            = aws_security_group.host.id
  referenced_security_group_id = aws_security_group.db.id
  ip_protocol                  = "tcp"
  from_port                    = 3306
  to_port                      = 3306
  description                  = "MySQL to RDS"
}

# Database
resource "aws_vpc_security_group_ingress_rule" "db_from_hosts" {
  security_group_id            = aws_security_group.db.id
  referenced_security_group_id = aws_security_group.host.id
  ip_protocol                  = "tcp"
  from_port                    = 3306
  to_port                      = 3306
  description                  = "MySQL from container hosts only"
}
