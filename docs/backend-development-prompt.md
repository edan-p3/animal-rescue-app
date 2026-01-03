# Backend Development Prompt for Animal Rescue Case Management Platform

## Project Context

You are building the backend for an **Animal Rescue Case Management Platform** that replaces chaotic WhatsApp coordination with a streamlined, real-time API-driven system. The frontend has already been built according to the specifications in `gemini-frontend-prompt.md` and is waiting for a fully functional backend to integrate with.

---

## Overview & Objectives

### Mission
Create a robust, scalable backend that enables animal rescuers to:
- Track animals through the entire rescue pipeline
- Collaborate seamlessly across multiple stakeholders (rescuers, vets, fosters, adoption coordinators)
- Provide real-time public visibility into rescue efforts
- Maintain data integrity and security while supporting collaborative workflows

### Core Principles
- **Security First**: Proper authentication, authorization, and data protection
- **Real-Time Capable**: Support WebSocket or polling for live updates
- **Mobile-Optimized**: Fast responses for field workers on phones
- **Collaboration-Centric**: Multi-user access with clear ownership and permissions
- **Audit Trail**: Complete activity logging for accountability

---

## Technology Stack Requirements

### Required Technologies
- **Language**: Node.js with TypeScript OR Python (FastAPI/Django)
- **Database**: PostgreSQL (required for relational data integrity)
- **Authentication**: JWT-based authentication with refresh tokens
- **File Storage**: AWS S3, Cloudinary, or similar CDN for animal photos
- **Real-Time**: WebSocket (Socket.io) OR Server-Sent Events (SSE) OR polling endpoints
- **Validation**: Strong input validation and sanitization
- **ORM**: Prisma (Node.js), SQLAlchemy (Python), or TypeORM

### Recommended Additional Libraries
- **Node.js Stack**:
  - Express.js or Fastify
  - Prisma ORM
  - bcrypt for password hashing
  - jsonwebtoken for JWT
  - multer/multer-s3 for file uploads
  - socket.io for real-time
  - joi or zod for validation
  - winston for logging

- **Python Stack**:
  - FastAPI or Django REST Framework
  - SQLAlchemy
  - Pydantic for validation
  - python-jose for JWT
  - boto3 for AWS S3
  - python-socketio for real-time
  - alembic for migrations

---

## Database Schema Design

### 1. Users Table
```sql
users {
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
  email             VARCHAR(255) UNIQUE NOT NULL
  password_hash     VARCHAR(255) NOT NULL
  name              VARCHAR(255) NOT NULL
  role              VARCHAR(50) NOT NULL -- rescuer, vet, foster, adoption_coordinator, admin
  phone             VARCHAR(20)
  avatar_url        TEXT
  organization      VARCHAR(255)
  location          VARCHAR(255)
  is_active         BOOLEAN DEFAULT true
  email_verified    BOOLEAN DEFAULT false
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

### 2. Cases Table
```sql
cases {
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid()
  species                 VARCHAR(100) NOT NULL -- dog, cat, squirrel, iguana, other
  description             TEXT
  status                  VARCHAR(50) NOT NULL -- reported, rescued, at_vet, surgery, at_foster, adoption_talks, adopted
  urgency                 VARCHAR(20) NOT NULL -- high, medium, low
  location_found          VARCHAR(255) NOT NULL
  location_found_general  VARCHAR(255) -- sanitized for public (e.g., "Downtown Area")
  location_current        VARCHAR(255)
  date_rescued            TIMESTAMP
  condition_description   TEXT
  injuries                TEXT
  treatments              TEXT
  medications             TEXT
  special_needs           TEXT
  dietary_requirements    TEXT
  behavior_notes          TEXT
  public_notes            TEXT -- sanitized notes for public view
  is_public               BOOLEAN DEFAULT true
  primary_owner_id        UUID REFERENCES users(id) NOT NULL
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

### 3. Case_Collaborators Table (Many-to-Many)
```sql
case_collaborators {
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  case_id         UUID REFERENCES cases(id) ON DELETE CASCADE
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE
  added_by        UUID REFERENCES users(id)
  role_label      VARCHAR(100) -- e.g., "Vet", "Foster", "Adoption Coordinator"
  added_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  UNIQUE(case_id, user_id)
}
```

### 4. Photos Table
```sql
photos {
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  case_id         UUID REFERENCES cases(id) ON DELETE CASCADE
  url             TEXT NOT NULL
  thumbnail_url   TEXT
  uploaded_by     UUID REFERENCES users(id)
  order_index     INTEGER DEFAULT 0
  is_primary      BOOLEAN DEFAULT false
  uploaded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

### 5. Activity_Log Table
```sql
activity_log {
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  case_id         UUID REFERENCES cases(id) ON DELETE CASCADE
  user_id         UUID REFERENCES users(id)
  action_type     VARCHAR(100) NOT NULL -- status_change, note_added, photo_added, collaborator_added, ownership_transferred, etc.
  description     TEXT NOT NULL
  metadata        JSONB -- flexible field for additional data
  is_public       BOOLEAN DEFAULT true -- some activities may be private
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

### 6. Refresh_Tokens Table (for JWT refresh token rotation)
```sql
refresh_tokens {
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE
  token_hash      VARCHAR(255) UNIQUE NOT NULL
  expires_at      TIMESTAMP NOT NULL
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}
```

### Indexes for Performance
```sql
-- Critical indexes for query performance
CREATE INDEX idx_cases_primary_owner ON cases(primary_owner_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_urgency ON cases(urgency);
CREATE INDEX idx_cases_updated_at ON cases(updated_at DESC);
CREATE INDEX idx_case_collaborators_user ON case_collaborators(user_id);
CREATE INDEX idx_case_collaborators_case ON case_collaborators(case_id);
CREATE INDEX idx_activity_log_case ON activity_log(case_id);
CREATE INDEX idx_photos_case ON photos(case_id);
```

---

## API Endpoints Specification

### Authentication Endpoints

#### `POST /api/auth/register`
**Purpose**: Create new user account

**Request Body**:
```json
{
  "email": "maria@example.com",
  "password": "SecurePass123!",
  "name": "Maria Rodriguez",
  "role": "rescuer",
  "phone": "+1234567890",
  "organization": "City Animal Rescue"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "uuid",
    "email": "maria@example.com",
    "name": "Maria Rodriguez",
    "role": "rescuer"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

**Validation**:
- Email must be valid and unique
- Password minimum 8 characters, must contain letter and number
- Name required, 2-255 characters
- Role must be one of: rescuer, vet, foster, adoption_coordinator

**Error Responses**:
- 400: Validation errors
- 409: Email already exists

---

#### `POST /api/auth/login`
**Purpose**: Authenticate user

**Request Body**:
```json
{
  "email": "maria@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "uuid",
    "email": "maria@example.com",
    "name": "Maria Rodriguez",
    "role": "rescuer",
    "avatar_url": "https://cdn.example.com/avatar.jpg"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

**Error Responses**:
- 400: Missing fields
- 401: Invalid credentials
- 403: Account not active

---

#### `POST /api/auth/refresh`
**Purpose**: Refresh access token

**Request Body**:
```json
{
  "refresh_token": "current_refresh_token"
}
```

**Response** (200 OK):
```json
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_refresh_token"
}
```

---

#### `POST /api/auth/logout`
**Purpose**: Invalidate refresh token

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "refresh_token": "refresh_token_to_invalidate"
}
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

#### `GET /api/auth/me`
**Purpose**: Get current user profile

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK):
```json
{
  "id": "uuid",
  "email": "maria@example.com",
  "name": "Maria Rodriguez",
  "role": "rescuer",
  "phone": "+1234567890",
  "avatar_url": "https://cdn.example.com/avatar.jpg",
  "organization": "City Animal Rescue",
  "created_at": "2025-12-01T00:00:00Z"
}
```

---

### Public Endpoints (No Authentication Required)

#### `GET /api/cases`
**Purpose**: Fetch all public cases with filtering

**Query Parameters**:
- `status` (optional): Filter by status (reported, rescued, at_vet, surgery, at_foster, adoption_talks, adopted)
- `species` (optional): Filter by species (dog, cat, squirrel, iguana, other)
- `urgency` (optional): Filter by urgency (high, medium, low)
- `search` (optional): Search in description and location (text search)
- `page` (optional, default: 1): Pagination page number
- `limit` (optional, default: 20, max: 100): Items per page
- `sort_by` (optional, default: updated_at): Field to sort by (created_at, updated_at, urgency)
- `sort_order` (optional, default: desc): asc or desc

**Example**: `GET /api/cases?species=dog&urgency=high&page=1&limit=20`

**Response** (200 OK):
```json
{
  "cases": [
    {
      "id": "case-uuid",
      "species": "Dog",
      "description": "Brown labrador mix, friendly",
      "status": "at_vet",
      "urgency": "high",
      "location_found": "Downtown, 5th & Main area",
      "location_current": "Dr. Chen's Vet Clinic",
      "date_rescued": "2026-01-03T10:30:00Z",
      "primary_owner": {
        "id": "user-uuid",
        "name": "Maria Rodriguez",
        "role": "rescuer"
      },
      "primary_photo": {
        "url": "https://cdn.example.com/photo.jpg",
        "thumbnail_url": "https://cdn.example.com/photo-thumb.jpg"
      },
      "collaborator_count": 2,
      "created_at": "2026-01-03T10:30:00Z",
      "updated_at": "2026-01-03T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

**Notes**:
- Only return cases where `is_public = true`
- Sanitize location data (use `location_found_general` instead of exact address)
- Do not include sensitive medical details or private notes
- Do not expose collaborator contact information

---

#### `GET /api/cases/:id`
**Purpose**: Fetch specific case details (public view)

**Response** (200 OK):
```json
{
  "id": "case-uuid",
  "species": "Dog",
  "description": "Brown labrador mix, friendly, approximately 2 years old",
  "status": "at_vet",
  "urgency": "high",
  "location_found": "Downtown, 5th & Main area",
  "location_current": "Dr. Chen's Vet Clinic",
  "date_rescued": "2026-01-03T10:30:00Z",
  "condition_description": "Injured leg, limping",
  "public_notes": "Surgery scheduled for tomorrow. Recovery expected to take 2 weeks.",
  "primary_owner": {
    "id": "user-uuid",
    "name": "Maria Rodriguez",
    "role": "rescuer"
  },
  "collaborators": [
    {
      "id": "user-uuid-2",
      "name": "Dr. Chen",
      "role": "vet",
      "role_label": "Veterinarian"
    }
  ],
  "photos": [
    {
      "id": "photo-uuid",
      "url": "https://cdn.example.com/photo.jpg",
      "thumbnail_url": "https://cdn.example.com/photo-thumb.jpg",
      "is_primary": true
    }
  ],
  "activity_log": [
    {
      "id": "activity-uuid",
      "user": "Maria Rodriguez",
      "action_type": "status_change",
      "description": "Changed status to At Vet",
      "created_at": "2026-01-03T14:20:00Z"
    },
    {
      "id": "activity-uuid-2",
      "user": "Dr. Chen",
      "action_type": "note_added",
      "description": "Added medical note: Surgery scheduled",
      "created_at": "2026-01-03T15:00:00Z"
    }
  ],
  "created_at": "2026-01-03T10:30:00Z",
  "updated_at": "2026-01-03T15:00:00Z"
}
```

**Error Responses**:
- 404: Case not found or not public

---

#### `GET /api/stats`
**Purpose**: Get dashboard summary statistics

**Response** (200 OK):
```json
{
  "active_cases": 12,
  "rescued_this_month": 45,
  "in_foster_care": 8,
  "adopted_this_month": 23,
  "by_urgency": {
    "high": 3,
    "medium": 5,
    "low": 4
  },
  "by_status": {
    "reported": 2,
    "rescued": 3,
    "at_vet": 4,
    "surgery": 1,
    "at_foster": 8,
    "adoption_talks": 5,
    "adopted": 23
  },
  "by_species": {
    "dog": 15,
    "cat": 20,
    "squirrel": 3,
    "iguana": 2,
    "other": 5
  }
}
```

---

### Authenticated Endpoints (Require JWT)

#### `POST /api/cases`
**Purpose**: Create new case (authenticated users only)

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "species": "Dog",
  "description": "Brown labrador mix, friendly",
  "status": "rescued",
  "urgency": "high",
  "location_found": "123 Main St, Downtown",
  "location_current": "Bringing to vet",
  "date_rescued": "2026-01-03T10:30:00Z",
  "condition_description": "Injured leg, limping",
  "injuries": "Possible fracture on right hind leg",
  "behavior_notes": "Calm and friendly",
  "is_public": true
}
```

**Response** (201 Created):
```json
{
  "id": "case-uuid",
  "species": "Dog",
  "description": "Brown labrador mix, friendly",
  "status": "rescued",
  "urgency": "high",
  "primary_owner_id": "user-uuid",
  "created_at": "2026-01-03T10:30:00Z",
  "updated_at": "2026-01-03T10:30:00Z"
}
```

**Business Logic**:
- Automatically set `primary_owner_id` to authenticated user
- Auto-generate sanitized `location_found_general` from `location_found`
- Create initial activity log entry: "Case created"
- Trigger real-time event: `case_created`

**Validation**:
- species: required, must be valid value
- status: required, must be valid status
- urgency: required, must be high/medium/low
- location_found: required
- date_rescued: valid ISO timestamp

---

#### `PUT /api/cases/:id`
**Purpose**: Update existing case

**Headers**: `Authorization: Bearer {access_token}`

**Request Body** (partial update supported):
```json
{
  "status": "at_vet",
  "location_current": "Dr. Chen's Vet Clinic",
  "public_notes": "Surgery scheduled for tomorrow"
}
```

**Response** (200 OK):
```json
{
  "id": "case-uuid",
  "status": "at_vet",
  "location_current": "Dr. Chen's Vet Clinic",
  "updated_at": "2026-01-03T14:20:00Z"
}
```

**Authorization Check**:
- User must be primary owner OR in collaborators list
- If not authorized, return 403 Forbidden

**Business Logic**:
- Update `updated_at` timestamp
- Create activity log entry for changes
- If status changed, log "Changed status from X to Y"
- Trigger real-time event: `case_updated`

---

#### `DELETE /api/cases/:id`
**Purpose**: Delete or archive case

**Headers**: `Authorization: Bearer {access_token}`

**Authorization**: Only primary owner can delete

**Response** (200 OK):
```json
{
  "message": "Case deleted successfully"
}
```

**Recommendation**: Implement soft delete (mark as archived) rather than hard delete for data integrity

---

#### `POST /api/cases/:id/photos`
**Purpose**: Upload photos to a case

**Headers**: 
- `Authorization: Bearer {access_token}`
- `Content-Type: multipart/form-data`

**Request Body** (multipart):
- `photos`: File[] (max 10 files, max 5MB each)
- `is_primary`: Boolean (optional, set first photo as primary)

**Response** (201 Created):
```json
{
  "photos": [
    {
      "id": "photo-uuid",
      "case_id": "case-uuid",
      "url": "https://cdn.example.com/photo.jpg",
      "thumbnail_url": "https://cdn.example.com/photo-thumb.jpg",
      "uploaded_by": "user-uuid",
      "is_primary": true,
      "uploaded_at": "2026-01-03T10:35:00Z"
    }
  ]
}
```

**Business Logic**:
- Validate file types (jpeg, jpg, png, webp only)
- Generate thumbnail (max 300px width)
- Upload to CDN (S3/Cloudinary)
- If first photo, automatically set as primary
- Create activity log entry
- Trigger real-time event: `case_updated`

**Authorization**: User must be owner or collaborator

---

#### `DELETE /api/cases/:id/photos/:photoId`
**Purpose**: Delete a photo from case

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK):
```json
{
  "message": "Photo deleted successfully"
}
```

**Business Logic**:
- Delete from CDN
- Delete from database
- If was primary photo, set another photo as primary
- Create activity log entry

---

#### `GET /api/users/me/cases`
**Purpose**: Get cases owned or collaborated on by current user

**Headers**: `Authorization: Bearer {access_token}`

**Query Parameters**:
- `filter` (optional): my_cases, collaborating, all (default: my_cases)
- `status` (optional): Filter by status
- `page`, `limit`: Pagination

**Response** (200 OK):
```json
{
  "my_cases": [
    {
      "id": "case-uuid",
      "species": "Dog",
      "status": "at_vet",
      "urgency": "high",
      "updated_at": "2026-01-03T14:20:00Z",
      "unread_updates": 3
    }
  ],
  "collaborating_on": [
    {
      "id": "case-uuid-2",
      "species": "Cat",
      "status": "at_foster",
      "urgency": "medium",
      "primary_owner": {
        "name": "John Smith"
      },
      "updated_at": "2026-01-03T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

---

#### `POST /api/cases/:id/collaborators`
**Purpose**: Add collaborator to case

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "user_id": "user-uuid-to-add",
  "role_label": "Veterinarian"
}
```

**Response** (201 Created):
```json
{
  "collaborator": {
    "id": "collab-uuid",
    "case_id": "case-uuid",
    "user": {
      "id": "user-uuid",
      "name": "Dr. Chen",
      "role": "vet"
    },
    "role_label": "Veterinarian",
    "added_by": "current-user-uuid",
    "added_at": "2026-01-03T14:30:00Z"
  }
}
```

**Authorization**: User must be primary owner or existing collaborator

**Business Logic**:
- Validate that user_id exists
- Check user not already a collaborator
- Create activity log entry: "Added Dr. Chen as collaborator"
- Trigger real-time event: `case_updated`
- (Future) Send notification to added user

---

#### `DELETE /api/cases/:id/collaborators/:userId`
**Purpose**: Remove collaborator from case

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK):
```json
{
  "message": "Collaborator removed successfully"
}
```

**Authorization**: Only primary owner can remove collaborators

---

#### `POST /api/cases/:id/transfer`
**Purpose**: Transfer primary ownership

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "new_owner_id": "user-uuid"
}
```

**Response** (200 OK):
```json
{
  "case": {
    "id": "case-uuid",
    "primary_owner_id": "new-user-uuid",
    "updated_at": "2026-01-03T16:00:00Z"
  }
}
```

**Authorization**: Only current primary owner can transfer

**Business Logic**:
- Validate new owner exists
- Update `primary_owner_id`
- Optionally add old owner as collaborator
- Create activity log entry: "Ownership transferred from Maria to John"
- Trigger real-time event: `case_updated`
- (Future) Send notification to new owner

---

#### `POST /api/cases/:id/notes`
**Purpose**: Add note/activity to case

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "description": "Surgery went well, dog is recovering nicely",
  "is_public": true
}
```

**Response** (201 Created):
```json
{
  "activity": {
    "id": "activity-uuid",
    "case_id": "case-uuid",
    "user_id": "user-uuid",
    "action_type": "note_added",
    "description": "Surgery went well, dog is recovering nicely",
    "is_public": true,
    "created_at": "2026-01-03T17:00:00Z"
  }
}
```

**Authorization**: User must be owner or collaborator

---

### Admin Endpoints (Future)

#### `GET /api/admin/users`
**Purpose**: Get all users (admin only)

#### `PUT /api/admin/users/:id`
**Purpose**: Update user role/status (admin only)

#### `GET /api/admin/analytics`
**Purpose**: Advanced analytics dashboard

---

## Real-Time Updates Implementation

### Option 1: WebSocket (Recommended)

**Connection**: `ws://api.example.com/ws` or `wss://` for production

**Authentication**: 
- Send JWT token on connection: `ws://api/ws?token=jwt_token`
- Validate token, associate connection with user

**Events to Broadcast**:

#### `case_created`
```json
{
  "event": "case_created",
  "data": {
    "case": { /* full case object */ }
  }
}
```

#### `case_updated`
```json
{
  "event": "case_updated",
  "data": {
    "case_id": "uuid",
    "changes": {
      "status": "at_vet",
      "updated_at": "2026-01-03T14:20:00Z"
    },
    "case": { /* updated case object */ }
  }
}
```

#### `case_deleted`
```json
{
  "event": "case_deleted",
  "data": {
    "case_id": "uuid"
  }
}
```

**Broadcasting Strategy**:
- Public cases: Broadcast to all connected clients
- Private cases: Broadcast only to owner and collaborators
- Use rooms/channels for efficient targeting

**Fallback**: If WebSocket not available, provide polling endpoint

---

### Option 2: Server-Sent Events (SSE)

**Endpoint**: `GET /api/events`

**Headers**: `Authorization: Bearer {access_token}` (optional for public stream)

**Stream Format**:
```
event: case_updated
data: {"case_id": "uuid", "status": "at_vet"}

event: case_created
data: {"case": {...}}
```

---

### Option 3: Polling Endpoint (Simplest)

#### `GET /api/cases/updates`
**Purpose**: Get cases updated since timestamp

**Query Parameters**:
- `since`: ISO timestamp (required)

**Response**:
```json
{
  "updated_cases": [
    { /* case object */ }
  ],
  "deleted_case_ids": ["uuid1", "uuid2"],
  "timestamp": "2026-01-03T18:00:00Z"
}
```

**Frontend**: Poll every 10-30 seconds with last timestamp

---

## Security & Validation

### Input Validation Rules

**All Endpoints**:
- Validate all input against schema
- Sanitize HTML/SQL in text fields
- Limit string lengths (description: 5000 chars, notes: 2000 chars)
- Validate UUID format for all IDs
- Reject unexpected fields

**File Uploads**:
- Validate MIME types (images only)
- Max file size: 5MB per image
- Max 10 images per upload
- Scan for malware (if possible)
- Generate unique filenames (UUID-based)

**Rate Limiting**:
- Authentication endpoints: 5 requests/minute
- Case creation: 10 requests/hour per user
- Photo uploads: 20 requests/hour per user
- Public endpoints: 100 requests/minute per IP

### Authorization Middleware

**Permission Checks**:
```javascript
// Pseudo-code
function canEditCase(user, case) {
  return (
    case.primary_owner_id === user.id ||
    case.collaborators.some(c => c.user_id === user.id) ||
    user.role === 'admin'
  );
}

function canDeleteCase(user, case) {
  return (
    case.primary_owner_id === user.id ||
    user.role === 'admin'
  );
}

function canTransferOwnership(user, case) {
  return case.primary_owner_id === user.id;
}
```

### Password Security
- Hash with bcrypt (cost factor 10-12)
- Minimum 8 characters
- Require letter + number (or enforce stronger rules)
- Never return password_hash in responses
- Implement password reset flow (future)

### JWT Configuration
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Rotate refresh tokens on each use
- Include user ID and role in token payload
- Sign with strong secret (environment variable)

### CORS Configuration
- Allow frontend origin (specific domain, not wildcard)
- Allow credentials for cookie-based auth if used
- Restrict methods to needed ones (GET, POST, PUT, DELETE)

---

## Error Handling Standards

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      {
        "field": "email",
        "message": "Email is already in use"
      }
    ]
  }
}
```

### HTTP Status Codes
- **200 OK**: Successful GET/PUT request
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation errors, malformed request
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource conflict (e.g., email exists)
- **422 Unprocessable Entity**: Business logic error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error (log details, return generic message)

### Error Codes
```
AUTH_INVALID_CREDENTIALS
AUTH_TOKEN_EXPIRED
AUTH_TOKEN_INVALID
VALIDATION_ERROR
RESOURCE_NOT_FOUND
PERMISSION_DENIED
RESOURCE_CONFLICT
RATE_LIMIT_EXCEEDED
FILE_TOO_LARGE
FILE_TYPE_INVALID
INTERNAL_ERROR
```

---

## Logging & Monitoring

### What to Log
- All authentication attempts (success/failure)
- Case creation, updates, deletions
- Ownership transfers
- Collaborator additions/removals
- Failed authorization attempts
- Errors with stack traces
- Performance metrics (response times)

### Log Format (Structured JSON)
```json
{
  "timestamp": "2026-01-03T10:30:00Z",
  "level": "info",
  "message": "Case created",
  "context": {
    "user_id": "uuid",
    "case_id": "uuid",
    "ip": "192.168.1.1",
    "endpoint": "POST /api/cases"
  }
}
```

### Sensitive Data
- NEVER log passwords (even hashed)
- NEVER log full JWT tokens
- Mask email addresses in logs (ma***@example.com)
- Redact sensitive medical details

---

## Testing Requirements

### Unit Tests
- Test all validation functions
- Test permission checks
- Test password hashing/verification
- Test JWT generation/validation
- Test data sanitization

### Integration Tests
- Test all API endpoints
- Test authentication flow
- Test authorization rules
- Test file upload flow
- Test real-time event broadcasting
- Test error handling

### Test Coverage Target
- Minimum 70% code coverage
- 100% coverage for authentication and authorization

### Test Data
- Create seed data for development
- Factory functions for test cases
- Mock external services (S3, etc.)

---

## Performance Optimization

### Database Optimization
- Use database indexes (see schema section)
- Implement connection pooling
- Use prepared statements (ORM handles this)
- Optimize N+1 queries with eager loading
- Consider read replicas for high traffic (future)

### Caching Strategy
- Cache public dashboard data (5-minute TTL)
- Cache user permissions (1-hour TTL, invalidate on change)
- Cache statistics endpoint (10-minute TTL)
- Use Redis or in-memory cache

### API Response Optimization
- Paginate all list endpoints
- Return only necessary fields
- Compress responses (gzip)
- Use ETags for cache validation
- Implement field selection (?fields=id,name,status)

### File Upload Optimization
- Generate thumbnails asynchronously (background job)
- Upload directly to S3 from client (presigned URLs) for large files
- Lazy load images in responses

---

## Deployment & Environment

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# File Storage
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=animal-rescue-photos
AWS_REGION=us-east-1

# API
PORT=3000
NODE_ENV=production
API_URL=https://api.example.com
FRONTEND_URL=https://app.example.com

# Rate Limiting
RATE_LIMIT_WINDOW=60000 # 1 minute in ms
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Deployment Checklist
- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Seed initial data (if any)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS only (no HTTP)
- [ ] Set up SSL certificate
- [ ] Configure rate limiting
- [ ] Set up logging/monitoring (e.g., Sentry)
- [ ] Test all endpoints in staging
- [ ] Load test critical endpoints
- [ ] Document API with OpenAPI/Swagger (optional but recommended)

### Hosting Recommendations
- **Backend**: Railway, Render, Fly.io, AWS ECS, DigitalOcean App Platform
- **Database**: Railway PostgreSQL, AWS RDS, DigitalOcean Managed Database
- **File Storage**: AWS S3, Cloudinary, DigitalOcean Spaces

---

## API Documentation

### Generate OpenAPI/Swagger Docs
- Use tools like `swagger-jsdoc` (Node.js) or built-in FastAPI docs (Python)
- Host docs at `/api/docs`
- Include:
  - All endpoints with request/response examples
  - Authentication requirements
  - Error responses
  - Rate limits

---

## Future Enhancements

### Phase 2 Features
- Email notifications (when added as collaborator, case updates)
- SMS notifications for urgent cases
- Advanced search (full-text search with ElasticSearch)
- Geolocation mapping
- Foster/vet capacity tracking
- Calendar integration for appointments

### Phase 3 Features
- WhatsApp bot integration
- Mobile push notifications
- Multi-language support (i18n)
- Financial tracking (vet bills, donations)
- Adoption matching algorithm
- Advanced analytics dashboard
- Export reports (PDF, CSV)

---

## Integration with Frontend

### Expected Frontend Behavior
- Frontend uses JWT access tokens in `Authorization` header
- Refresh token stored in httpOnly cookie or localStorage
- Frontend handles token refresh automatically before expiry
- Real-time updates via WebSocket connection or polling
- Photo uploads via multipart form data
- Graceful error handling with user-friendly messages

### CORS Headers Required
```
Access-Control-Allow-Origin: https://frontend-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Success Criteria

Your backend is complete when:
- ✅ All API endpoints are implemented and tested
- ✅ Authentication and authorization work correctly
- ✅ File uploads to CDN function properly
- ✅ Real-time updates are functional (WebSocket or polling)
- ✅ Database schema is normalized and indexed
- ✅ Input validation prevents invalid data
- ✅ Error handling provides clear, helpful messages
- ✅ Logging captures all important events
- ✅ API documentation is available
- ✅ Frontend can integrate seamlessly
- ✅ Basic unit and integration tests pass
- ✅ Performance is acceptable (< 200ms for most endpoints)
- ✅ Security best practices are followed

---

## Example Workflow to Test

### Test Scenario: Complete Case Lifecycle
1. **Register** new user (Maria)
2. **Login** as Maria
3. **Create case** for injured dog (POST /api/cases)
4. **Upload photo** to case (POST /api/cases/:id/photos)
5. **Get all cases** on public dashboard (GET /api/cases)
6. **Add collaborator** (Dr. Chen) (POST /api/cases/:id/collaborators)
7. **Login** as Dr. Chen
8. **Update case status** to "at_vet" (PUT /api/cases/:id)
9. **Add medical note** (POST /api/cases/:id/notes)
10. **Transfer ownership** from Maria to John (POST /api/cases/:id/transfer)
11. **Real-time update** should broadcast all changes
12. **Activity log** should show complete history

All of these steps should work seamlessly with proper authentication, authorization, and data integrity.

---

## Final Notes

### Code Quality
- Use TypeScript for type safety (Node.js)
- Follow consistent naming conventions
- Write clear, self-documenting code
- Add comments for complex business logic
- Use linting (ESLint/Pylint) and formatting (Prettier/Black)
- Organize code into logical modules:
  - `/routes` or `/controllers` for endpoints
  - `/models` for database models
  - `/middleware` for auth, validation, error handling
  - `/services` for business logic
  - `/utils` for helpers

### Priority Order
1. **Authentication & User Management** (critical foundation)
2. **Case CRUD Operations** (core functionality)
3. **Public Dashboard Endpoints** (must work for MVP)
4. **Collaboration Features** (key differentiator)
5. **Photo Upload** (important for usability)
6. **Real-Time Updates** (can start with polling)
7. **Activity Logging** (audit trail)
8. **Testing & Documentation** (ensure reliability)

### Questions to Consider
- How should we handle case archiving vs. deletion?
- Should we implement email verification for new users?
- What's the policy for user data retention?
- Should we allow users to delete their own accounts?
- How should we handle cases when a user account is deleted?

---

**Build a backend that is secure, scalable, and enables animal rescuers to save more lives. Good luck! 🐾**

