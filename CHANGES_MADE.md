# Changes made before deployment

| # | File(s) | Problem | Fix |
|---|---|---|---|
| 1 | `infra/iam.tf` | GitHub Actions could not log in to AWS. GitHub's OIDC token now uses `repo:owner@ID/name@ID:...`, and the deploy job runs in the `production` environment, so neither matched the trust policy (`repo:owner/name:ref:refs/heads/main`) | The trust policy accepts both subject formats, for the `main` branch and the `production` environment, still locked to this one repository |
| 2 | `deploy/deploy.sh` | On AWS the RDS database was never given its tables (`db:init` only existed as a manual local command), so the app could not work | Every deploy now runs `npm run db:init` (safe to repeat: `CREATE TABLE IF NOT EXISTS`) and `npm run db:admin` before starting the containers |
| 3 | `backend/controllers/auth.js` | Anyone could register as admin by sending `"role": "admin"` to `/auth/register` | Public registration always creates a customer (and their cart) |
| 4 | `backend/scripts/createAdmin.js` (new), `backend/package.json`, `backend/sample.env`, `infra/secrets.tf`, `infra/variables.tf`, `infra/outputs.tf` | With admin self-registration closed, there needs to be a safe way to create the admin | New script creates the admin from `ADMIN_NAME/EMAIL/PASSWORD`. On AWS, Terraform generates the password, stores it as an SSM SecureString, and shows it with `terraform output -json admin_login` |
| 5 | `infra/terraform.tfvars.example`, `infra/variables.tf`, `docker-compose.yml` | Missing guidance | Notes for region, an existing OIDC provider, and the local admin command |
| 6 | `DEPLOYMENT_GUIDE.md` (new) | — | Step-by-step guide: local run, AWS deploy, screenshots, viva demo, troubleshooting |

Verified: `terraform validate` passes; backend tests pass (3/3); frontend production build succeeds; the schema loads (18 tables) and the admin script works against MySQL-compatible MariaDB; registering with `role=admin` now creates a customer.

Still needed from you: copy the site's image files into `backend/public/artworks/` (`hero_1.jpg`, `hero_3.jpg`, `hero_4.jpg`, `hero_vid.mp4` and the artwork images). They were not in the zip.
