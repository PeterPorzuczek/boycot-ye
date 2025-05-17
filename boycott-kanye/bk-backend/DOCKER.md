# Docker Setup for Boycott Kanye Backend

This document explains how to run the Boycott Kanye backend application using Docker.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### Running with Docker Compose

1. Build and start the containers:

```bash
docker-compose up -d
```

This will start both the NestJS backend and PocketBase database services.

2. Access the services:
   - NestJS Backend: http://localhost:3000
   - PocketBase Admin UI: http://localhost:8090/_/

### Stopping the Services

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down -v
```

## Environment Variables

The following environment variables can be modified in the `docker-compose.yml` file:

- `NODE_ENV`: Application environment (default: production)
- `PORT`: The port on which the NestJS application runs (default: 3000)
- `POCKETBASE_URL`: URL to connect to PocketBase (default: http://pocketbase:8090)

## Data Persistence

PocketBase data is stored in a Docker volume named `pocketbase_data`. This ensures that your data persists even when containers are removed.

## Rebuilding the Application

If you make changes to the application code and need to rebuild:

```bash
docker-compose build
docker-compose up -d
``` 