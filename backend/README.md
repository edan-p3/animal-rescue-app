# Animal Rescue Case Management - Backend API

## Overview

This is the backend API for the Animal Rescue Case Management Platform. It provides a RESTful API with real-time WebSocket support for managing animal rescue cases.

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary
- **Real-time**: Socket.io
- **Validation**: Zod
- **Logging**: Winston

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Cloudinary account (for photo uploads)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
   - Set your PostgreSQL database URL
   - Set a strong JWT secret
   - Add your Cloudinary credentials
   - Configure CORS origins

### Database Setup

1. Generate Prisma client:
```bash
npm run prisma:generate
```

2. Run database migrations:
```bash
npm run prisma:migrate
```

3. (Optional) Open Prisma Studio to view/edit data:
```bash
npm run prisma:studio
```

### Running the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on port 3000 (or the PORT specified in .env).

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user profile

#### Cases (Public)
- `GET /api/cases` - Get all public cases (with filters)
- `GET /api/cases/:id` - Get case details
- `GET /api/stats` - Get dashboard statistics

#### Cases (Authenticated)
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case
- `GET /api/users/me/cases` - Get user's cases

#### Collaboration
- `POST /api/cases/:id/collaborators` - Add collaborator
- `DELETE /api/cases/:id/collaborators/:userId` - Remove collaborator
- `POST /api/cases/:id/transfer` - Transfer ownership
- `POST /api/cases/:id/notes` - Add note/activity

#### Photos
- `POST /api/cases/:id/photos` - Upload photos (multipart/form-data)
- `DELETE /api/cases/:id/photos/:photoId` - Delete photo

### WebSocket Events

Connect to WebSocket server:
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token' // Optional for public events
  }
});
```

**Events from server**:
- `case_created` - New case created
- `case_updated` - Case updated
- `case_deleted` - Case deleted

**Example event payload**:
```json
{
  "event": "case_updated",
  "data": {
    "case_id": "uuid",
    "changes": { "status": "at_vet" },
    "case": { /* full case object */ }
  }
}
```

## Security Features

- JWT-based authentication with refresh token rotation
- Password hashing with bcrypt (12 rounds)
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Secure file upload validation
- SQL injection prevention (Prisma ORM)

## Rate Limits

- Authentication endpoints: 5 requests/minute
- Case creation: 10 requests/hour per user
- Photo uploads: 20 requests/hour per user
- General endpoints: 100 requests/minute per IP

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `cases` - Animal rescue cases
- `case_collaborators` - Many-to-many relationship for collaboration
- `photos` - Case photos
- `activity_log` - Audit trail and activity feed
- `refresh_tokens` - JWT refresh tokens

See `prisma/schema.prisma` for full schema details.

## Error Handling

All errors follow a consistent format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [
      {
        "field": "email",
        "message": "Email is already in use"
      }
    ]
  }
}
```

### Error Codes
- `AUTH_INVALID_CREDENTIALS`
- `AUTH_TOKEN_EXPIRED`
- `AUTH_TOKEN_INVALID`
- `VALIDATION_ERROR`
- `RESOURCE_NOT_FOUND`
- `PERMISSION_DENIED`
- `RESOURCE_CONFLICT`
- `RATE_LIMIT_EXCEEDED`
- `FILE_TOO_LARGE`
- `FILE_TYPE_INVALID`
- `INTERNAL_ERROR`

## Logging

Logs are written to:
- `error.log` - Error level logs
- `combined.log` - All logs
- Console (in development)

Structured JSON logging format for easy parsing.

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # Route definitions
│   ├── middleware/       # Auth, validation, error handling
│   ├── utils/            # Utilities and helpers
│   ├── types/            # TypeScript types
│   └── index.ts          # Main application entry
├── prisma/
│   └── schema.prisma     # Database schema
├── tests/                # Test files
├── package.json
├── tsconfig.json
└── .env.example
```

## Development Tips

1. **Hot reload**: The `npm run dev` command uses `tsx watch` for automatic reloading

2. **Database changes**: After modifying `schema.prisma`, run:
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

3. **Logs**: Check `combined.log` for all server activity

4. **Testing**: Use Prisma Studio to inspect/modify database:
   ```bash
   npm run prisma:studio
   ```

## Deployment

### Environment Variables (Production)

Ensure all environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret (256-bit recommended)
- `CLOUDINARY_*` - Cloudinary credentials
- `FRONTEND_URL` - Your frontend domain (for CORS)
- `NODE_ENV=production`

### Deployment Platforms

Recommended platforms:
- **Railway** - Easiest setup with PostgreSQL
- **Render** - Good free tier
- **Fly.io** - Global edge deployment
- **DigitalOcean App Platform**
- **AWS ECS/Fargate**

### Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS only
- [ ] Set up SSL certificate
- [ ] Configure logging/monitoring
- [ ] Test all endpoints in staging
- [ ] Set up database backups

## Testing the API

### Example: Complete Workflow

1. **Register a user**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "SecurePass123",
    "name": "Maria Rodriguez",
    "role": "rescuer"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "SecurePass123"
  }'
```

3. **Create a case** (use access_token from login):
```bash
curl -X POST http://localhost:3000/api/cases \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "dog",
    "description": "Brown labrador mix",
    "status": "rescued",
    "urgency": "high",
    "locationFound": "Downtown area"
  }'
```

4. **Get all cases**:
```bash
curl http://localhost:3000/api/cases
```

## Support

For issues or questions, please refer to the API documentation or check the logs.

## License

MIT

