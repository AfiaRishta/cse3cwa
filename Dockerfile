# --- install deps
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# generate Prisma client for production
RUN npx prisma generate
# build Next.js
RUN npm run build

# --- runtime image
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
# (SQLite) ensure the app knows where the DB is inside the container
ENV DATABASE_URL="file:./dev.db"
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm","start"]
