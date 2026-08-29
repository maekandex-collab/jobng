# syntax=docker/dockerfile:1

# Lean multi-stage build — avoids copying node_modules between stages
# (that COPY often OOMs low-memory Coolify hosts).

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN mkdir -p public
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=1536
ARG JUSTJOB_API_BASE_URL=https://mtn.lenhub.net
ENV JUSTJOB_API_BASE_URL=$JUSTJOB_API_BASE_URL
ENV job_API_BASE_URL=$JUSTJOB_API_BASE_URL
RUN npm run build \
  && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
