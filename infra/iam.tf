# ---------------- IAM (skipped in lab_mode: Learner Lab forbids creating roles) ----------------
locals {
  create_iam     = !var.lab_mode
  param_arn      = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project}"
  log_group_arns = [for g in aws_cloudwatch_log_group.containers : "${g.arn}:*"]
}

# ---- Role for the EC2 container hosts ----
resource "aws_iam_role" "host" {
  count = local.create_iam ? 1 : 0
  name  = "${local.name}-host-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "host_ssm" {
  count      = local.create_iam ? 1 : 0
  role       = aws_iam_role.host[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore" # Session Manager + Run Command
}

resource "aws_iam_role_policy_attachment" "host_ecr_read" {
  count      = local.create_iam ? 1 : 0
  role       = aws_iam_role.host[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly" # pull only, no push
}

resource "aws_iam_role_policy" "host_inline" {
  count = local.create_iam ? 1 : 0
  name  = "${local.name}-host-least-privilege"
  role  = aws_iam_role.host[0].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ReadOwnParametersOnly"
        Effect   = "Allow"
        Action   = ["ssm:GetParametersByPath", "ssm:GetParameters", "ssm:GetParameter"]
        Resource = [local.param_arn, "${local.param_arn}/*"]
      },
      {
        Sid      = "WriteOwnLogsOnly"
        Effect   = "Allow"
        Action   = ["logs:CreateLogStream", "logs:PutLogEvents", "logs:DescribeLogStreams"]
        Resource = local.log_group_arns
      }
    ]
  })
}

resource "aws_iam_instance_profile" "host" {
  count = local.create_iam ? 1 : 0
  name  = "${local.name}-host-profile"
  role  = aws_iam_role.host[0].name
}

# ---- GitHub Actions: keyless deploys via OpenID Connect ----
resource "aws_iam_openid_connect_provider" "github" {
  count           = local.create_iam && var.create_github_oidc_provider ? 1 : 0
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1", "1c58a3a8518e8759bf075b76b750d4f2df264fcd"]
}

data "aws_iam_openid_connect_provider" "github" {
  count = local.create_iam && !var.create_github_oidc_provider ? 1 : 0
  url   = "https://token.actions.githubusercontent.com"
}

locals {
  gh_owner = split("/", var.github_repo)[0]
  gh_name  = split("/", var.github_repo)[1]
  github_oidc_arn = try(
    aws_iam_openid_connect_provider.github[0].arn,
    data.aws_iam_openid_connect_provider.github[0].arn,
    null
  )
}

resource "aws_iam_role" "github_actions" {
  count = local.create_iam ? 1 : 0
  name  = "${local.name}-github-actions"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = local.github_oidc_arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com" }
        # Only this one repository: jobs on the main branch, or jobs in the "production"
        # environment (the deploy job). GitHub now also puts immutable IDs in the subject
        # ("repo:owner@123/name@456:..."), so both subject formats are accepted.
        StringLike = { "token.actions.githubusercontent.com:sub" = [
          "repo:${local.gh_owner}/${local.gh_name}:ref:refs/heads/main",
          "repo:${local.gh_owner}/${local.gh_name}:environment:production",
          "repo:${local.gh_owner}@*/${local.gh_name}@*:ref:refs/heads/main",
          "repo:${local.gh_owner}@*/${local.gh_name}@*:environment:production",
        ] }
      }
    }]
  })
}

resource "aws_iam_role_policy" "github_actions" {
  count = local.create_iam ? 1 : 0
  name  = "${local.name}-ci-deploy"
  role  = aws_iam_role.github_actions[0].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "EcrLogin"
        Effect   = "Allow"
        Action   = "ecr:GetAuthorizationToken"
        Resource = "*"
      },
      {
        Sid    = "PushToOurReposOnly"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability", "ecr:InitiateLayerUpload", "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload", "ecr:PutImage", "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer", "ecr:DescribeImages"
        ]
        Resource = [for r in aws_ecr_repository.repo : r.arn]
      },
      {
        Sid      = "SetDeployedImageTag"
        Effect   = "Allow"
        Action   = "ssm:PutParameter"
        Resource = aws_ssm_parameter.image_tag.arn
      },
      {
        Sid      = "RunDeployScriptDocument"
        Effect   = "Allow"
        Action   = "ssm:SendCommand"
        Resource = "arn:aws:ssm:${var.aws_region}::document/AWS-RunShellScript"
      },
      {
        Sid      = "RunOnAppHostsOnly"
        Effect   = "Allow"
        Action   = "ssm:SendCommand"
        Resource = "arn:aws:ec2:${var.aws_region}:${data.aws_caller_identity.current.account_id}:instance/*"
        Condition = {
          StringEquals = { "ssm:resourceTag/Role" = "app-host" }
        }
      },
      {
        Sid      = "ReadCommandResults"
        Effect   = "Allow"
        Action   = ["ssm:ListCommandInvocations", "ssm:GetCommandInvocation", "ssm:ListCommands"]
        Resource = "*"
      }
    ]
  })
}
