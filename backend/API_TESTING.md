# API Testing Guide

This document provides curl commands to test all API endpoints.

## Prerequisites

1. Server must be running: `npm run dev`
2. Database must be set up with migrations
3. For authenticated endpoints, you'll need an access token

## Get Access Token

First, register or login to get an access token:

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User",
    "role": "rescuer",
    "phone": "+1234567890",
    "organization": "Test Rescue"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

Save the `access_token` from the response. You'll use it in subsequent requests.

**Set it as a variable (bash/zsh):**
```bash
export TOKEN="your_access_token_here"
```

---

## Authentication Endpoints

### Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your_refresh_token"
  }'
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "your_refresh_token"
  }'
```

---

## Public Endpoints (No Authentication Required)

### Get All Cases
```bash
curl http://localhost:3000/api/cases
```

### Get Cases with Filters
```bash
# Filter by species
curl "http://localhost:3000/api/cases?species=dog"

# Filter by status
curl "http://localhost:3000/api/cases?status=at_vet"

# Filter by urgency
curl "http://localhost:3000/api/cases?urgency=high"

# Search
curl "http://localhost:3000/api/cases?search=labrador"

# Combine filters
curl "http://localhost:3000/api/cases?species=dog&urgency=high&page=1&limit=10"

# Sort by created date
curl "http://localhost:3000/api/cases?sort_by=created_at&sort_order=asc"
```

### Get Case by ID
```bash
curl http://localhost:3000/api/cases/CASE_ID_HERE
```

### Get Dashboard Statistics
```bash
curl http://localhost:3000/api/stats
```

---

## Case Management (Authenticated)

### Create Case
```bash
curl -X POST http://localhost:3000/api/cases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "dog",
    "description": "Brown labrador mix, friendly",
    "status": "rescued",
    "urgency": "high",
    "locationFound": "123 Main St, Downtown",
    "locationCurrent": "Bringing to vet",
    "dateRescued": "2026-01-03T10:30:00Z",
    "conditionDescription": "Injured leg, limping",
    "injuries": "Possible fracture on right hind leg",
    "behaviorNotes": "Calm and friendly",
    "isPublic": true
  }'
```

Save the `id` from the response for use in other endpoints.

### Update Case
```bash
curl -X PUT http://localhost:3000/api/cases/CASE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "at_vet",
    "locationCurrent": "Downtown Vet Clinic",
    "publicNotes": "Surgery scheduled for tomorrow"
  }'
```

### Delete Case
```bash
curl -X DELETE http://localhost:3000/api/cases/CASE_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Get My Cases
```bash
# Get cases I own
curl "http://localhost:3000/api/users/me/cases?filter=my_cases" \
  -H "Authorization: Bearer $TOKEN"

# Get cases I'm collaborating on
curl "http://localhost:3000/api/users/me/cases?filter=collaborating" \
  -H "Authorization: Bearer $TOKEN"

# Get all my cases
curl "http://localhost:3000/api/users/me/cases?filter=all" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Photo Management

### Upload Photos
```bash
curl -X POST http://localhost:3000/api/cases/CASE_ID/photos \
  -H "Authorization: Bearer $TOKEN" \
  -F "photos=@/path/to/photo1.jpg" \
  -F "photos=@/path/to/photo2.jpg" \
  -F "is_primary=true"
```

### Delete Photo
```bash
curl -X DELETE http://localhost:3000/api/cases/CASE_ID/photos/PHOTO_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Collaboration

### Add Collaborator
```bash
curl -X POST http://localhost:3000/api/cases/CASE_ID/collaborators \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_ID_TO_ADD",
    "role_label": "Veterinarian"
  }'
```

### Remove Collaborator
```bash
curl -X DELETE http://localhost:3000/api/cases/CASE_ID/collaborators/USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Transfer Ownership
```bash
curl -X POST http://localhost:3000/api/cases/CASE_ID/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_owner_id": "NEW_OWNER_USER_ID"
  }'
```

### Add Note
```bash
curl -X POST http://localhost:3000/api/cases/CASE_ID/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Dog is recovering well from surgery",
    "is_public": true
  }'
```

---

## Testing with Sample Data

If you ran `npm run prisma:seed`, you can use these credentials:

**Users:**
- maria@example.com (rescuer)
- chen@example.com (vet)
- sarah@example.com (foster)
- Password for all: `Password123`

**Test Workflow:**

1. Login as Maria:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "maria@example.com", "password": "Password123"}'
```

2. Get Maria's cases:
```bash
curl "http://localhost:3000/api/users/me/cases" \
  -H "Authorization: Bearer $TOKEN"
```

3. View a specific case:
```bash
curl http://localhost:3000/api/cases/CASE_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## WebSocket Testing

### Using JavaScript
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-access-token' // Optional
  }
});

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('case_created', (data) => {
  console.log('New case:', data);
});

socket.on('case_updated', (data) => {
  console.log('Case updated:', data);
});

socket.on('case_deleted', (data) => {
  console.log('Case deleted:', data);
});
```

### Using wscat (WebSocket CLI tool)
```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket server
wscat -c "ws://localhost:3000/socket.io/?EIO=4&transport=websocket"
```

---

## Testing Rate Limits

Rate limits are configured as follows:
- Auth endpoints: 5 requests/minute
- Case creation: 10 requests/hour
- Photo uploads: 20 requests/hour
- General: 100 requests/minute

To test rate limiting, make rapid requests:

```bash
for i in {1..10}; do
  curl http://localhost:3000/api/cases
  sleep 0.1
done
```

---

## Common Response Formats

### Success Response (Case Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "species": "dog",
  "status": "rescued",
  "urgency": "high",
  "primary_owner_id": "...",
  "created_at": "2026-01-03T10:30:00Z",
  "updated_at": "2026-01-03T10:30:00Z"
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address"
      }
    ]
  }
}
```

### Paginated Response
```json
{
  "cases": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

## Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- Get a new token by logging in again

### 403 Forbidden
- You don't have permission for this action
- Only case owners can delete cases
- Only owners can remove collaborators

### 404 Not Found
- Case/resource doesn't exist
- Check the ID is correct

### 429 Too Many Requests
- Rate limit exceeded
- Wait and try again
- Check rate limit headers in response

### 500 Internal Server Error
- Check server logs: `tail -f combined.log`
- Check database connection
- Verify environment variables

---

## Performance Testing

Use Apache Bench (ab) or similar tools:

```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:3000/health

# Test cases endpoint
ab -n 500 -c 5 http://localhost:3000/api/cases
```

---

## Next Steps

1. Test all endpoints in order
2. Verify WebSocket events are received
3. Test error cases (invalid data, missing auth, etc.)
4. Check that rate limiting works
5. Verify database constraints (unique emails, etc.)
6. Test photo upload with actual image files

For more details, see README.md and SETUP.md.

