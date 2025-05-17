#!/bin/bash

# Default API URL if not provided
API_URL=${1:-http://localhost:3000/api}

# Build the Docker image with custom API URL
echo "Building Boycott Kanye frontend image with API URL: $API_URL"
docker build -t boycott-kanye-frontend:latest --build-arg VUE_APP_API_URL="$API_URL" .

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "Image size:"
  docker images boycott-kanye-frontend:latest --format "{{.Size}}"
  
  echo ""
  echo "To run the container:"
  echo "docker run -p 8080:80 -e API_URL=$API_URL boycott-kanye-frontend:latest"
  echo ""
  echo "You can then access the app at http://localhost:8080"
  echo "The app will use the API at: $API_URL"
else
  echo "Build failed!"
fi 