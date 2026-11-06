# ---------------- Outbound internet for private subnets ----------------
# Default: a t4g.nano NAT instance (~$3/month) instead of a NAT Gateway (~$33/month).
# Set nat_mode = "gateway" to use the managed NAT Gateway instead.

data "aws_ssm_parameter" "al2023_arm64" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64"
}

resource "aws_security_group" "nat" {
  count       = var.nat_mode == "instance" ? 1 : 0
  name        = "${local.name}-nat-sg"
  description = "NAT instance: accept traffic only from the private app subnets"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${local.name}-nat-sg" }
}

resource "aws_vpc_security_group_ingress_rule" "nat_from_app" {
  count             = var.nat_mode == "instance" ? 2 : 0
  security_group_id = aws_security_group.nat[0].id
  cidr_ipv4         = aws_subnet.app[count.index].cidr_block
  ip_protocol       = "-1"
  description       = "All traffic from private app subnet ${count.index + 1}"
}

resource "aws_vpc_security_group_egress_rule" "nat_out" {
  count             = var.nat_mode == "instance" ? 1 : 0
  security_group_id = aws_security_group.nat[0].id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
  description       = "Forward to the internet"
}

resource "aws_instance" "nat" {
  count                       = var.nat_mode == "instance" ? 1 : 0
  ami                         = data.aws_ssm_parameter.al2023_arm64.value
  instance_type               = "t4g.nano"
  subnet_id                   = aws_subnet.public[0].id
  associate_public_ip_address = true
  source_dest_check           = false # required for a NAT instance to forward traffic
  vpc_security_group_ids      = [aws_security_group.nat[0].id]
  user_data                   = file("${path.module}/templates/nat_user_data.sh")

  metadata_options {
    http_tokens = "required"
  }

  tags = { Name = "${local.name}-nat-instance", Role = "nat" }
}

resource "aws_eip" "nat" {
  count  = var.nat_mode == "gateway" ? 1 : 0
  domain = "vpc"
  tags   = { Name = "${local.name}-nat-eip" }
}

resource "aws_nat_gateway" "nat" {
  count         = var.nat_mode == "gateway" ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id
  tags          = { Name = "${local.name}-nat-gw" }
  depends_on    = [aws_internet_gateway.igw]
}
