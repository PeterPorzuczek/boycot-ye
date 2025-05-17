FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV POCKETBASE_URL=http://localhost:8090

# Expose port
EXPOSE 3000

# Run application
CMD ["node", "dist/main"] 