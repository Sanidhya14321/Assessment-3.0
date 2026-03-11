# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies required for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies using npm ci for reproducibility
RUN npm ci --only=production && \
    npm ci && \
    npm run prisma:generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN useradd -m -u 1001 nextjs

# Copy package.json for reference and production dependencies
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production

# Copy prisma schema for migrations
COPY prisma ./prisma

# Copy built application from builder
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
