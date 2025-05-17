# Boycott Kanye - Petition Website

![Boycott Kanye Website Screenshot](https://i.imgur.com/p7VB2zD.png)

## Overview

Boycott Kanye is a simple web application that enables users to publicly condemn the antisemitic and Nazi views expressed by rapper Kanye West (Ye). The application allows users to sign a virtual petition, which can be optionally made publicly visible. The solution provides simple navigation for non-logged-in users (ability to browse the signature list) and logged-in users (ability to add and withdraw a signature).

## Features

- **User Authentication**: Secure login and registration system
- **Mobile-Responsive Design**: Optimized for all device sizes with dedicated mobile navigation
- **Petition Signing**: Easy-to-use interface for signing the petition
- **Signature Management**: Users can manage their signature visibility and withdraw if needed
- **Public Signature List**: Partially masked email addresses (first letter + last character before @ + full domain)
- **Privacy Controls**: Users can choose the visibility of their personal data

## Architecture

The application is built using a modern web stack:

- **Frontend**: Vue.js 3 with Composition API
- **Backend API**: NestJS-based REST API with TypeScript
- **Data Layer**: PocketBase as the backend database and authentication service
- **Documentation**: Swagger/OpenAPI for API documentation

### PocketBase Integration

The backend API serves as a wrapper around [PocketBase](https://pocketbase.io/) - a lightweight, open-source backend alternative with built-in authentication and database. The wrapper approach offers several advantages:

- **Simplified Business Logic**: Custom validations and business rules at the API layer
- **Enhanced Security**: Control over authentication and authorization processes
- **Standardized API**: Consistent RESTful endpoint design regardless of underlying data storage

## Project Structure

```
boycott-kanye/
├── bk-backend/             # Backend NestJS application
│   ├── migrations/         # PocketBase schema and data migration scripts
│   ├── src/                # Backend source code
│   │   ├── auth/           # Authentication module
│   │   ├── pocketbase/     # PocketBase service wrapper
│   │   ├── signatures/     # Signature management module
│   │   └── ...            
│   └── ...                
├── bk-frontend/            # Frontend Vue.js application
│   ├── public/             # Static assets
│   ├── src/                # Frontend source code
│   │   ├── components/     # Vue components
│   │   ├── views/          # Vue page views
│   │   └── ...            
│   └── ...                
├── .github/                # GitHub configuration
│   └── workflows/          # GitHub Actions CI/CD workflows
└── ...
```

## Setup & Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PocketBase server running locally or remotely

### Backend Setup

```bash
# Navigate to backend directory
cd boycott-kanye/bk-backend

# Install dependencies
npm install

# Setup environment and run migrations
npm run setup:db

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd boycott-kanye/bk-frontend

# Install dependencies
npm install

# Start development server
npm run serve
```

## CI/CD Pipeline

The project includes a GitHub Actions CI/CD pipeline that runs the following jobs:

1. **Backend Tests**: Runs all backend tests and generates coverage reports
2. **Backend Build**: Builds the backend application
3. **Frontend Tests**: Runs all frontend tests
4. **Frontend Build**: Builds the frontend application

The pipeline triggers on pushes to the main, master, and develop branches, as well as pull requests to these branches.

## API Endpoints

The backend API provides the following endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get a token

### Signatures

- `GET /api/signatures/all` - Get all signatures
- `POST /api/signatures` - Create a new signature (requires authentication)
- `GET /api/signatures/me` - Get the current user's signature (requires authentication)
- `DELETE /api/signatures/:id` - Remove a signature (requires authentication)

## Deployment

### Frontend

```bash
# Build production version
cd boycott-kanye/bk-frontend
npm run build

# Using Docker
docker build -t boycott-kanye-frontend .
docker run -p 8080:80 boycott-kanye-frontend
```

### Backend

```bash
# Build production version
cd boycott-kanye/bk-backend
npm run build
npm run start:prod

# Using Docker
docker build -t boycott-kanye-backend .
docker run -p 3000:3000 boycott-kanye-backend
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
