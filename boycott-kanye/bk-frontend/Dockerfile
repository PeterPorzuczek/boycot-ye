# Single-stage build using Node.js to both build and serve the app
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --quiet

# Copy the rest of the app
COPY . .

# Build the Vue app
RUN npm run build

# Create a script to replace API URL and start server
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'find /app/dist -type f -name "*.js" -exec sed -i "s#VUE_APP_API_URL_PLACEHOLDER#${VUE_APP_API_URL_PLACEHOLDER:-http://localhost:3000/api}#g" {} \;' >> /start.sh && \
    echo 'serve -s dist -l 80' >> /start.sh && \
    chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start the server
CMD ["/start.sh"] 