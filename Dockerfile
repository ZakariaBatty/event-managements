# Base image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install additional dependencies for bcrypt and prisma
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Builder stage: build the application
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage and rest of the application source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate the Prisma client before building Next.js
RUN npx prisma generate

# Set environment variables (optional: if needed during build)
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL_PROD

# Build the Next.js application
RUN npm run build

# Production runner image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Copy prisma directory for potential migrations at runtime
COPY --from=builder /app/prisma ./prisma

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user
USER nextjs

# Expose the port
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["npm", "start"]