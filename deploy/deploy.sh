#!/bin/bash
# Runs ON each EC2 container host:
#   - at first boot (from user data), and
#   - on every release (GitHub Actions triggers it through SSM Run Command).
# It pulls the configured image tag from ECR and (re)starts the web + app containers.
set -euo pipefail

exec 9>/var/lock/artwall-deploy.lock
flock 9                                   # never run two deploys at once

# shellcheck disable=SC1091
source /opt/artwall/config.env            # AWS_REGION ECR_REGISTRY WEB_IMAGE APP_IMAGE PARAM_PATH LOG_PREFIX
cd /opt/artwall

TOKEN=$(curl -sf -X PUT http://169.254.169.254/latest/api/token -H "X-aws-ec2-metadata-token-ttl-seconds: 300")
INSTANCE_ID=$(curl -sf -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)

# 1) Secrets + config from SSM Parameter Store -> root-only .env file (never in the image or repo)
umask 077
aws ssm get-parameters-by-path --region "$AWS_REGION" --path "$PARAM_PATH" --recursive --with-decryption \
  --query 'Parameters[].[Name,Value]' --output text \
  | awk -F'\t' '{ n=$1; sub(".*/", "", n); print n "=" $2 }' > .env.new
mv .env.new .env

IMAGE_TAG=$(grep '^IMAGE_TAG=' .env | cut -d= -f2- || true)
export IMAGE_TAG=${IMAGE_TAG:-latest}
export AWS_REGION ECR_REGISTRY WEB_IMAGE APP_IMAGE LOG_PREFIX INSTANCE_ID

# 2) Log in to ECR with the instance role (no stored registry password)
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY" >/dev/null

# 3) Pull. On a brand-new environment the first CI run may not have pushed images yet, so retry.
for attempt in $(seq 1 "${PULL_RETRIES:-40}"); do
  if docker compose -p artwall pull -q; then break; fi
  if [ "$attempt" = "${PULL_RETRIES:-40}" ]; then echo "Images still unavailable, giving up"; exit 1; fi
  echo "Images not available yet (attempt $attempt), retrying in 30s"; sleep 30
done

# 4) Create the database tables (CREATE TABLE IF NOT EXISTS, so harmless on every deploy)
#    and the admin account (skipped if it already exists), using the new app image.
docker compose -p artwall run --rm --no-deps app npm run db:init
docker compose -p artwall run --rm --no-deps app npm run db:admin || echo "Admin creation skipped/failed (see above)"

# 5) Start / replace containers with the new images, then clean up old ones
docker compose -p artwall up -d --remove-orphans
docker image prune -af --filter "until=72h" >/dev/null || true
echo "Deployed tag $IMAGE_TAG on $INSTANCE_ID"
