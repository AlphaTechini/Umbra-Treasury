# syntax=docker/dockerfile:1

FROM node:24.12.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY --link apps/api/package.json apps/api/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
COPY --link drizzle.config.ts ./
COPY --link migrations ./migrations
COPY --link apps ./apps
RUN pnpm --filter @umbra-treasury/api build

FROM base AS prod-deps
COPY --link package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --link apps/api/package.json apps/api/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM node:24.12.0-slim AS runtime
ENV NODE_ENV="production"
WORKDIR /app
COPY --link --from=prod-deps /app/node_modules ./node_modules
COPY --link --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --link --from=build /app/apps/api/dist ./apps/api/dist
COPY --link apps/api/package.json ./apps/api/package.json
USER node
EXPOSE 3007
CMD ["node", "apps/api/dist/apps/api/src/server.js"]
