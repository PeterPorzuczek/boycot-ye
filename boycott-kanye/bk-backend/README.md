# Boycott Kanye - Backend API

## Overview

This is the backend API for the "Boycott Kanye" petition application. It provides a RESTful service layer for user registration, authentication, and petition signature management, while serving as a wrapper around PocketBase for data persistence.

The API acts as an intermediary between the frontend application and the PocketBase database, offering enhanced business logic, validation, and the potential for future AI integrations.

## Architecture

- **API Layer**: NestJS-based REST API with TypeScript
- **Data Layer**: PocketBase as the backend database and authentication service
- **Documentation**: Swagger/OpenAPI for API documentation
- **Migration System**: Custom scripts for PocketBase collection management

### PocketBase Integration

This API serves as a wrapper around [PocketBase](https://pocketbase.io/) - a lightweight, open-source backend alternative with built-in authentication and database. The wrapper approach offers several advantages:

- **Simplified Business Logic**: Custom validations and business rules at the API layer
- **Enhanced Security**: Control over authentication and authorization processes
- **Future AI Integration**: Prepared foundation for integrating AI services for content moderation, signature analysis, etc.
- **Standardized API**: Consistent RESTful endpoint design regardless of underlying data storage

## Technology Stack

- **NestJS**: Modern, progressive Node.js framework
- **PocketBase**: Self-hostable backend for database and authentication
- **TypeScript**: Type-safe JavaScript
- **Swagger/OpenAPI**: API documentation
- **Jest**: Testing framework

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

## Database Setup

The project includes a migration system to configure PocketBase collections:

```bash
# Build the project
npm run build

# Setup environment and run migrations
npm run setup:db

# Full setup including test data creation
npm run setup
```

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

The API provides the following endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get a token

### Signatures

- `GET /api/signatures/all` - Get all signatures
- `POST /api/signatures` - Create a new signature (requires authentication)
- `GET /api/signatures/me` - Get the current user's signature (requires authentication)
- `DELETE /api/signatures/:id` - Remove a signature (requires authentication)

## Authentication

The API uses Bearer token authentication. After logging in, you'll receive a token that should be included in the Authorization header of subsequent requests:

```
Authorization: Bearer your_token_here
```

## Documentation

Swagger documentation is available at `/docs` when the server is running.

### API Documentation Export

You can access the Swagger JSON in multiple ways:
1. **API endpoint**: `http://localhost:3000/api-json`
2. **Auto-generated file**: `swagger.json` in the project root (created on server start)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port for the API server | 3000 |
| NODE_ENV | Environment mode | development |
| POCKETBASE_URL | URL to the PocketBase server | http://localhost:8090 |
| POCKETBASE_ADMIN_EMAIL | Admin email for PocketBase | N/A |
| POCKETBASE_ADMIN_PASSWORD | Admin password for PocketBase | N/A |
| CORS_ORIGIN | Origin allowed for CORS | * |

## Tests

```bash
# Run all tests
$ npm run test

# Run only authentication middleware tests (these work properly)
$ npm run test:auth

# Generate test coverage report
$ npm run test:cov

# Generate named test coverage report
$ npm run test:report
```

## Project Structure

```
bk-backend/
├── migrations/            # PocketBase schema and data migration scripts
│   ├── cli.ts             # Command-line migration runner
│   ├── index.ts           # Migration core functionality
│   ├── models/            # Collection schema definitions
│   └── scripts/           # Utility scripts for setup
├── src/
│   ├── auth/              # Authentication module
│   ├── pocketbase/        # PocketBase service wrapper
│   ├── signatures/        # Signature management module
│   ├── app.controller.ts  # Main application controller
│   ├── app.module.ts      # Main application module
│   └── main.ts            # Application bootstrap
└── swagger.json           # Generated API documentation
```

## Future Development

The API has been designed with future AI integration in mind. Potential enhancements include:

- **Content Moderation**: AI-powered filtering of inappropriate content in user submissions
- **Signature Analysis**: Identifying patterns and insights from petition signatures
- **User Behavior Analysis**: Detecting fraudulent signatures or automated bot activity
- **Recommendation Engine**: Suggesting similar petitions or actions to users

## Test Coverage Report
Current test coverage:
- `src/auth/auth.middleware.ts` - **93.33% coverage** ✅
- Fully tested with working unit tests
Note: Tests for other components are having issues due to:
1. PocketBase compatibility with Jest testing
2. Import paths and ES modules configuration
The focus has been on ensuring the authentication middleware is working correctly, as this is a critical security component. 