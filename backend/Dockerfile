# ---------- Application tier: Node.js / Express API ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Production dependencies only (no nodemon); reproducible install from the lockfile
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine
ENV NODE_ENV=production \
    PORT=8800
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
# Run as the unprivileged "node" user, not root
USER node
EXPOSE 8800
# Docker restarts/flags the container if the API stops answering
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8800/health || exit 1
CMD ["node", "index.js"]
