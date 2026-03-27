# ---- Build Stage ----
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend
RUN pnpm build

# ---- Production Stage ----
FROM node:20-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages/shared/src ./packages/shared/src

WORKDIR /app/apps/backend

EXPOSE 3001

CMD ["node", "dist/server.js"]
