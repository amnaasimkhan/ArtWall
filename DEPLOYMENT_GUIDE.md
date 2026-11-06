# ArtWall: Step-by-Step Deployment Guide (SE-490 CEA)

ArtWall is deployed on AWS as a three-tier application:

| Tier | What | Where on AWS |
|---|---|---|
| Web | React (Vite) built into **Nginx** container `artwall-web` | EC2 hosts in **private subnets**, behind a public **Application Load Balancer** |
| Application | **Node.js / Express** API container `artwall-app` (port 8800, not published) | Same EC2 hosts, reachable **only** from the Nginx container on a private Docker network |
| Database | **MySQL 8.4** | **Amazon RDS** in isolated private DB subnets (no internet route) |

Both containers run on each host through `docker compose`, which the CEA explicitly allows ("if the Web and Application tiers run together on the same host, a docker-compose.yml"). Infrastructure lives in **Terraform** (`infra/`). CI/CD is **GitHub Actions** (`.github/workflows/deploy.yml`), which pushes to **Amazon ECR** and deploys through **SSM Run Command**.

All commands below are for **Windows PowerShell**.

---

## Part 0. Before you start (important)

1. **Put the site's images in `backend/public/artworks/`.** The home page needs `hero_1.jpg`, `hero_3.jpg`, `hero_4.jpg` and `hero_vid.mp4`, plus any artwork, frame and room-background images your database refers to. They are copied into the app image at build time. Without them the pages show broken images. Keep each file under 100 MB.
2. **Which AWS account?**
   - **Personal / free-tier account (recommended):** follow this guide as written.
   - **AWS Academy Learner Lab:** see "Learner Lab differences" at the end.
   - **The same AWS account another project (e.g. CraftKart) already uses:** that's fine, because all resources here are named `artwall-*`. But add `create_github_oidc_provider = false` to `terraform.tfvars`, since the account already has GitHub's OIDC provider.

---

## Part A. Run it locally with Docker (about 10 min)

Install **Docker Desktop** and start it.

```powershell
cd C:\path\to\ArtWall
copy backend\sample.env .env
notepad .env
```
Fill in at least these values (any values work locally), then save:
```
DB_USER=artwall
DB_PASSWORD=LocalPass123
JWT_SECRET_KEY=any-long-random-text-123456
STRIPE_SECRET_KEY=sk_test_...        (your Stripe TEST key, or leave a dummy value)
ADMIN_PASSWORD=Admin12345
```
Build and start everything:
```powershell
$env:BUILDX_BAKE_ENTITLEMENTS_FS="0"     # Windows fix for "additional privileges requested: fs.read" errors
docker compose up --build -d
docker compose ps                          # web, app, db should be running / healthy
docker compose exec app npm run db:init    # creates the 18 tables
docker compose exec app npm run db:admin   # creates the admin account from .env
```
Open **http://localhost:8080**. Register as a customer from the site. To log in as admin, go to the admin login page with name `admin` and the `ADMIN_PASSWORD` you set.

If you see "port 8080 already in use", change `"8080:8080"` to `"8081:8080"` in `docker-compose.yml` and use http://localhost:8081.

Stop it with `docker compose down`.

Take screenshots of `docker compose ps` and the site in the browser for local testing evidence.

---

## Part B. Deploy to AWS (about 1 hour the first time)

### B1. Install tools (one time)

Install them, then **close and reopen PowerShell**:
```powershell
winget install --id Amazon.AWSCLI -e --source winget
winget install --id Hashicorp.Terraform -e --source winget
winget install --id Git.Git -e --source winget
winget install --id GitHub.cli -e --source winget
```
Check them:
```powershell
aws --version; terraform -version; git --version; gh --version
```

### B2. Connect to AWS and GitHub

1. In the AWS Console, go to **IAM → Users → Create user** (e.g. `artwall-admin`).
2. Choose **Attach policies directly → AdministratorAccess → Create**.
3. Open the user, then **Security credentials → Create access key → CLI**. Copy both keys.

Then:
```powershell
aws configure                 # paste both keys, region: us-east-1, output: json
aws sts get-caller-identity   # should print your account number
gh auth login                 # GitHub.com → HTTPS → Yes → Login with a web browser
```

### B3. Put the code on GitHub

```powershell
cd C:\path\to\ArtWall
git init -b main
git add .
git status                    # make sure NO .env file is listed
git commit -m "ArtWall three-tier cloud deployment"
gh repo create ArtWall --public --source . --push
gh repo view --json nameWithOwner -q .nameWithOwner     # copy this exact owner/name
```
This first push starts the pipeline, and it will fail because AWS isn't set up yet. That's expected, so ignore it.

### B4. Create the infrastructure with Terraform (about 15 min)

```powershell
cd infra
copy terraform.tfvars.example terraform.tfvars
notepad terraform.tfvars
```
Set `github_repo` to exactly what `gh repo view` printed, e.g. `github_repo = "yourname/ArtWall"`. Optionally add your Stripe test key: `stripe_secret_key = "sk_test_..."`. Save.

```powershell
terraform init
terraform plan -out tfplan
terraform apply tfplan
```
It ends with `Apply complete!` and prints `app_url`. **Screenshot this.**

If you get *"Access denied … AWSServiceRoleForAutoScaling"* (this happens on brand-new accounts), wait 3 minutes and run `terraform plan -out tfplan` and `terraform apply tfplan` again.

### B5. Connect GitHub Actions to AWS

```powershell
cd ..
gh secret set AWS_ROLE_ARN --body (terraform -chdir=infra output -raw github_actions_role_arn)
gh variable set AWS_REGION --body (terraform -chdir=infra output -raw aws_region)
gh variable set APP_URL --body (terraform -chdir=infra output -raw app_url)
gh secret list; gh variable list
```
Then in the browser, open the repo (`gh repo view --web`) and go to **Settings → Environments → New environment**. Name it **`production`** and click **Configure environment**.

### B6. Run the pipeline

```powershell
git commit --allow-empty -m "first deploy"
git push
gh run watch
```
The jobs, in order:
1. **Test:** backend tests, frontend build, and a compose-file check.
2. **Build & push images:** both images go to ECR.
3. **Deploy:** `deploy.sh` runs on every EC2 host. It creates the tables and the admin, then starts the containers.
4. **Smoke test:** checks `/healthz` and `/api/health/db`.

All jobs should turn green. **Screenshot the run.**

### B7. Open the site

```powershell
terraform -chdir=infra output app_url
terraform -chdir=infra output -json admin_login     # admin name + generated password
```
Admin login: name `admin` and the password above. Never show the password in screenshots.

### B8. Screenshots for "Deployment Evidence"

All of these are in the AWS Console, region **us-east-1 (N. Virginia)**.

| Evidence | Where |
|---|---|
| VPC and subnets | VPC → Your VPCs → **artwall-vpc** → **Resource map** (turn on "Show all details") |
| Compute | EC2 → Instances (`artwall-host` ×2, `artwall-nat-instance`); EC2 → Auto Scaling Groups → **artwall-asg** |
| Security groups | EC2 → Security Groups → inbound rules of `artwall-alb-sg`, `artwall-host-sg`, `artwall-db-sg` |
| Load balancer | EC2 → Load Balancers → **artwall-alb**; Target Groups → **artwall-web-tg** → Targets (Healthy) |
| Database | RDS → **artwall-db**. Also run: `aws rds describe-db-instances --db-instance-identifier artwall-db --query "DBInstances[0].{Public:PubliclyAccessible,Encrypted:StorageEncrypted,Engine:Engine,Version:EngineVersion}" --output table` |
| Image registry | ECR → `artwall-web` and `artwall-app` → Images (SHA tags + latest) |
| CI/CD run | GitHub → Actions → the green run (and the Smoke test step log) |
| Running app | The browser at the `app_url`, with the address bar visible |
| Extra: monitoring | CloudWatch → Dashboards → **artwall-overview**; Log groups `/artwall/web`, `/artwall/app` |
| Extra: secrets | Systems Manager → Parameter Store → `/artwall/...` (shows SecureString, don't reveal values) |

### B9. Show a change going through the pipeline (viva demo)

Edit some visible text in `frontend/src/pages/gen/Homepage.jsx`, then:
```powershell
git add . ; git commit -m "Demo change" ; git push ; gh run watch
```
Refresh the site after the run finishes (about 6–10 min).

### B10. Delete everything when finished (stops charges)

```powershell
terraform -chdir=infra destroy        # type yes
```
To bring it back later: run `terraform -chdir=infra apply`, then `gh variable set APP_URL --body (terraform -chdir=infra output -raw app_url)`, then push.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `docker compose` says *additional privileges requested: fs.read* | `$env:BUILDX_BAKE_ENTITLEMENTS_FS="0"` in the same PowerShell window |
| Port 8080 in use | Change `"8080:8080"` to `"8081:8080"` in `docker-compose.yml` |
| Terraform: *AWSServiceRoleForAutoScaling … access denied* | Wait 3 minutes and apply again |
| Terraform: *EntityAlreadyExists … OIDC provider* | Add `create_github_oidc_provider = false` to `terraform.tfvars` and apply again |
| Pipeline: *Not authorized to perform sts:AssumeRoleWithWebIdentity* | `github_repo` in `terraform.tfvars` must match the repo exactly (case matters); apply again, then re-run the job |
| Deploy job: *Deployment did not succeed on every instance* | Look at the printed output for each instance. Most often the hosts are still booting; re-run the job after 5 minutes |
| Site loads but images are broken | Add the image files to `backend/public/artworks/`, commit and push |
| Target group unhealthy right after `terraform apply` | Normal until the first pipeline run has pushed images |

## Learner Lab differences (AWS Academy only)

- Keep `aws_region = "us-east-1"` and set `lab_mode = true` in `terraform.tfvars`. Terraform will then use `LabRole` / `LabInstanceProfile`, because Learner Lab cannot create IAM roles or OIDC.
- Instead of `AWS_ROLE_ARN`, put the lab's temporary keys in GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`. They expire every ~4 hours; update them after each lab restart.
- `terraform output -raw github_actions_role_arn` is empty in lab mode; skip that command.
