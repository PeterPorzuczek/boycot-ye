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

# Add a non-root user to run nginx
RUN adduser -D -H -u 1000 -s /sbin/nologin www-data

# Copy the built app from the build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a shell script to replace environment variables in JS files
RUN echo "#!/bin/sh \n\
find /usr/share/nginx/html -type f -name '*.js' -exec sed -i \"s|VUE_APP_API_URL_PLACEHOLDER|'\${API_URL:-http://localhost:3000/api}'|g\" {} \\; \n\
exec \"\$@\"" > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

# Make directories writable for nginx
RUN chown -R www-data:www-data /usr/share/nginx/html && \
    chown -R www-data:www-data /var/cache/nginx && \
    chown -R www-data:www-data /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R www-data:www-data /var/run/nginx.pid

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/50x.html /usr/share/nginx/html/index.html

# Use non-root user
USER www-data

# Expose port 80
EXPOSE 80

# Set entrypoint to perform environment variable substitution before starting nginx
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 