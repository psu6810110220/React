# Bearer Token Authentication Usage Guide

## Overview

The application now supports Bearer token authentication that can be enabled/disabled via Docker Compose configuration. When enabled, all API endpoints (except the login endpoint) require a valid Bearer token.

## Configuration

### Enable Authentication

In `docker-compose.yml`, set the following environment variables:

```yaml
environment:
  AUTH_ENABLED: "true"  # Enable Bearer token authentication
  JWT_SECRET: "your-super-secret-jwt-key-change-in-production"
  JWT_EXPIRES_IN: "1h"  # Token expiration time (default: 1h)
```

### Disable Authentication

Set `AUTH_ENABLED: "false"` (or omit it) to disable authentication. All endpoints will be accessible without tokens.

## Usage

### 1. Login to Get Token

When authentication is enabled, first login to get a Bearer token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "1234"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Use Token in API Requests

Include the token in the `Authorization` header:

```bash
curl -X GET http://localhost:3000/api/book \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Test User (Development)

A test user is automatically created by fixtures:
- **Username:** `demo`
- **Password:** `1234`
- **Email:** `demo@example.com`

## API Endpoints

### Public Endpoint (Always Accessible)
- `POST /api/auth/login` - Login and receive Bearer token

### Protected Endpoints (When AUTH_ENABLED=true)
All other endpoints require Bearer token:
- `GET /api/book` - Get all books
- `POST /api/book` - Create a book
- `GET /api/book/:id` - Get a book by ID
- `PATCH /api/book/:id` - Update a book
- `DELETE /api/book/:id` - Delete a book
- `POST /api/book/:id/like` - Like a book
- All `/api/book-category/*` endpoints
- All other API endpoints

## Error Responses

### 401 Unauthorized
Returned when:
- Token is missing
- Token is invalid
- Token has expired
- User credentials are invalid

**Example:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Testing

### Test with Authentication Disabled
```bash
# Set AUTH_ENABLED=false in docker-compose.yml
docker-compose up -d

# All endpoints work without token
curl http://localhost:3000/api/book
```

### Test with Authentication Enabled
```bash
# Set AUTH_ENABLED=true in docker-compose.yml
docker-compose up -d

# Login first
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"1234"}' \
  | jq -r '.access_token')

# Use token for API calls
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/book

# Without token - returns 401
curl http://localhost:3000/api/book
```

## Security Notes

1. **JWT Secret**: Always use a strong, random secret in production
2. **Token Expiration**: Tokens expire after the time specified in `JWT_EXPIRES_IN`
3. **Password Storage**: Passwords are hashed using bcrypt
4. **HTTPS**: Use HTTPS in production to protect tokens in transit

## Creating New Users

Currently, users must be created programmatically. You can:
1. Use the UserService in your code
2. Create a user registration endpoint
3. Use database migrations or scripts

Example using UserService:
```typescript
await userService.createUser('newuser', 'password123', 'user@example.com');
```

