FROM node:20-alpine AS build

WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./

# Install only production dependencies for final build
RUN npm ci --only=production && \
    # Keep a copy of production modules
    cp -R node_modules prod_node_modules && \
    # Install all dependencies for build
    npm ci

# Copy source files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src/ ./src/

# Build application
RUN npm run build

# Final stage - use the smallest possible base image
FROM node:20-alpine as production

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    POCKETBASE_URL=http://localhost:8090

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    mkdir -p /app && \
    chown -R nestjs:nodejs /app

# Set working directory and switch to non-root user
WORKDIR /app
USER nestjs

# Copy only the necessary files from build stage
COPY --from=build --chown=nestjs:nodejs /app/package.json ./
COPY --from=build --chown=nestjs:nodejs /app/prod_node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist

# Expose port
EXPOSE 3000

# Run application
CMD ["node", "dist/src/main.js"] 