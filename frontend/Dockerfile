# Production Dockerfile for CodeBuddy Frontend
# Multi-stage build for optimized production deployment

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl

# Dependencies stage - like organizing your toolbox
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* .dockerignore* ./
RUN npm ci --omit=dev && npm cache clean --force

# Builder stage - the assembly line
FROM base AS builder
WORKDIR /app

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production environment setup
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Build the application (ensure next.config.js has output: 'standalone')
RUN npm run build

# Production runner - the final race car
FROM base AS runner

# Metadata labels
LABEL maintainer="codebuddy-team" \
      version="1.0" \
      description="CodeBuddy Frontend Production" \
      environment="production"

WORKDIR /app

# Production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy production files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start engines!
CMD ["node", "server.js"]