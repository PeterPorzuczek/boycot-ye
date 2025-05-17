# Stage 1: Build the Vue.js application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (including dev dependencies needed for build)
RUN npm ci --quiet && \
    npm cache clean --force

# Copy the rest of the application code
COPY . .

# Set default API URL value (can be overridden at build time)
ARG VUE_APP_API_URL=http://localhost:3000/api
ENV VUE_APP_API_URL=${VUE_APP_API_URL}

# Build the app for production
RUN npm run build && \
    rm -rf node_modules

# Stage 2: Serve the app using nginx
FROM nginx:alpine

# Remove the attempt to add a www-data user since it already exists in nginx:alpine
# Instead, use the existing user - no need to create a new one

# Copy the built app from the build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a shell script to replace environment variables in JS files
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VUE_APP_API_URL_PLACEHOLDER|${API_URL:-http://172.17.0.1:3000/api}|g" {} \;' >> /docker-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Make directories writable for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/50x.html /usr/share/nginx/html/index.html

# Use non-root nginx user
USER nginx

# Expose port 80
EXPOSE 80

# Set entrypoint to perform environment variable substitution before starting nginx
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 