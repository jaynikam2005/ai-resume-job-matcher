# Build stage
FROM node:20.9.0-alpine3.18 AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile for consistency
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application for production
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AI_SERVICE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AI_SERVICE_URL=$NEXT_PUBLIC_AI_SERVICE_URL
RUN pnpm build

# Production stage
FROM node:20.9.0-alpine3.18 AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy standalone build from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_AI_SERVICE_URL=${NEXT_PUBLIC_AI_SERVICE_URL}
ENV INTERNAL_API_URL=${INTERNAL_API_URL}
ENV INTERNAL_AI_SERVICE_URL=${INTERNAL_AI_SERVICE_URL}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })" || exit 1

# Start the application with proper signal handling
CMD ["dumb-init", "node", "server.js"]