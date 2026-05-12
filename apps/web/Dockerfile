# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web

# Build arguments for environment variables
ARG PUBLIC_API_URL
ARG PUBLIC_SOLANA_RPC_URL
ARG PUBLIC_SOLANA_NETWORK

ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_SOLANA_RPC_URL=${PUBLIC_SOLANA_RPC_URL}
ENV PUBLIC_SOLANA_NETWORK=${PUBLIC_SOLANA_NETWORK}

# Build the application
WORKDIR /app/apps/web
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/apps/web/build ./apps/web/build
COPY --from=builder /app/apps/web/package.json ./apps/web/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

WORKDIR /app/apps/web

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "build"]
