# Boycott Kanye - Backend API

## Overview

This is the backend API for the "Boycott Kanye" petition application. It provides endpoints for user registration, authentication, and petition signature management.

## Technology Stack

- **NestJS**: Modern, progressive Node.js framework
- **PocketBase**: Self-hostable backend for database and authentication
- **TypeScript**: Type-safe JavaScript
- **Swagger**: API documentation

## Prerequisites

- Node.js (v14 or later)
- PocketBase server running locally or remotely
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
4. Configure your PocketBase server and ensure it's running

## Running the Application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

## API Endpoints

The API is organized around the following resources:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get token

### Signatures

- `GET /api/signatures` - Get all signatures
- `POST /api/signatures` - Create a new signature (requires authentication)
- `GET /api/signatures/user` - Get the current user's signature (requires authentication)
- `DELETE /api/signatures/:id` - Remove a signature (requires authentication)

## Authentication

The API uses Bearer token authentication. After logging in, you'll receive a token that should be included in the Authorization header of subsequent requests:

```
Authorization: Bearer your_token_here
```

## Documentation

Swagger documentation is available at `/docs` when the server is running.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port for the API server | 3000 |
| NODE_ENV | Environment mode | development |
| POCKETBASE_URL | URL to the PocketBase server | http://localhost:8090 |
| POCKETBASE_ADMIN_EMAIL | Admin email for PocketBase | N/A |
| POCKETBASE_ADMIN_PASSWORD | Admin password for PocketBase | N/A |
| CORS_ORIGIN | Origin allowed for CORS | * | 