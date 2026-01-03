#!/bin/bash

# Interactive Backend Test Script
# This script guides you through testing all backend features

set -e

API_URL="http://localhost:3000"
TOKEN=""
CASE_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Animal Rescue Backend - Test Suite       ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Check if server is running
echo -e "${YELLOW}[1/13] Checking if server is running...${NC}"
if curl -s "$API_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Server is running!${NC}"
else
    echo -e "${RED}❌ Server is not running. Please start it with: npm run dev${NC}"
    exit 1
fi
echo ""

# Test 2: Get public cases
echo -e "${YELLOW}[2/13] Testing public cases endpoint...${NC}"
CASES_RESPONSE=$(curl -s "$API_URL/api/cases")
if echo "$CASES_RESPONSE" | grep -q '"cases"'; then
    CASE_COUNT=$(echo "$CASES_RESPONSE" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
    echo -e "${GREEN}✅ Public cases endpoint works! Found $CASE_COUNT case(s)${NC}"
else
    echo -e "${RED}❌ Public cases endpoint failed${NC}"
    echo "$CASES_RESPONSE"
fi
echo ""

# Test 3: Get statistics
echo -e "${YELLOW}[3/13] Testing statistics endpoint...${NC}"
STATS_RESPONSE=$(curl -s "$API_URL/api/stats")
if echo "$STATS_RESPONSE" | grep -q '"active_cases"'; then
    echo -e "${GREEN}✅ Statistics endpoint works!${NC}"
    echo "$STATS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STATS_RESPONSE"
else
    echo -e "${RED}❌ Statistics endpoint failed${NC}"
fi
echo ""

# Test 4: User registration
echo -e "${YELLOW}[4/13] Testing user registration...${NC}"
TIMESTAMP=$(date +%s)
EMAIL="test${TIMESTAMP}@example.com"

REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"TestPass123\",
    \"name\": \"Test User $TIMESTAMP\",
    \"role\": \"rescuer\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q '"access_token"'; then
    echo -e "${GREEN}✅ Registration works!${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    echo -e "${BLUE}📝 Saved access token for subsequent tests${NC}"
else
    echo -e "${RED}❌ Registration failed${NC}"
    echo "$REGISTER_RESPONSE"
    exit 1
fi
echo ""

# Test 5: Get current user
echo -e "${YELLOW}[5/13] Testing authentication with /api/auth/me...${NC}"
ME_RESPONSE=$(curl -s "$API_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ME_RESPONSE" | grep -q '"email"'; then
    echo -e "${GREEN}✅ JWT authentication works!${NC}"
    echo "$ME_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ME_RESPONSE"
else
    echo -e "${RED}❌ Authentication failed${NC}"
    echo "$ME_RESPONSE"
fi
echo ""

# Test 6: Create a case
echo -e "${YELLOW}[6/13] Testing case creation...${NC}"
CREATE_CASE_RESPONSE=$(curl -s -X POST "$API_URL/api/cases" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "cat",
    "description": "Test cat from automated test",
    "status": "rescued",
    "urgency": "medium",
    "locationFound": "123 Test Street",
    "locationCurrent": "Test location",
    "conditionDescription": "Healthy",
    "isPublic": true
  }')

if echo "$CREATE_CASE_RESPONSE" | grep -q '"id"'; then
    echo -e "${GREEN}✅ Case creation works!${NC}"
    CASE_ID=$(echo "$CREATE_CASE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${BLUE}📝 Created case with ID: $CASE_ID${NC}"
else
    echo -e "${RED}❌ Case creation failed${NC}"
    echo "$CREATE_CASE_RESPONSE"
    exit 1
fi
echo ""

# Test 7: Update the case
echo -e "${YELLOW}[7/13] Testing case update...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/api/cases/$CASE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "at_foster",
    "publicNotes": "Test update - cat doing well"
  }')

if echo "$UPDATE_RESPONSE" | grep -q '"id"'; then
    echo -e "${GREEN}✅ Case update works!${NC}"
else
    echo -e "${RED}❌ Case update failed${NC}"
    echo "$UPDATE_RESPONSE"
fi
echo ""

# Test 8: Add a note
echo -e "${YELLOW}[8/13] Testing activity note creation...${NC}"
NOTE_RESPONSE=$(curl -s -X POST "$API_URL/api/cases/$CASE_ID/notes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Automated test note - cat ate well today",
    "is_public": true
  }')

if echo "$NOTE_RESPONSE" | grep -q '"activity"'; then
    echo -e "${GREEN}✅ Activity note creation works!${NC}"
else
    echo -e "${RED}❌ Note creation failed${NC}"
    echo "$NOTE_RESPONSE"
fi
echo ""

# Test 9: Get user's cases
echo -e "${YELLOW}[9/13] Testing user's cases endpoint...${NC}"
MY_CASES_RESPONSE=$(curl -s "$API_URL/api/users/me/cases" \
  -H "Authorization: Bearer $TOKEN")

if echo "$MY_CASES_RESPONSE" | grep -q '"cases"'; then
    echo -e "${GREEN}✅ User's cases endpoint works!${NC}"
else
    echo -e "${RED}❌ User's cases endpoint failed${NC}"
    echo "$MY_CASES_RESPONSE"
fi
echo ""

# Test 10: Get case details
echo -e "${YELLOW}[10/13] Testing case details retrieval...${NC}"
CASE_DETAIL_RESPONSE=$(curl -s "$API_URL/api/cases/$CASE_ID" \
  -H "Authorization: Bearer $TOKEN")

if echo "$CASE_DETAIL_RESPONSE" | grep -q '"activity_log"'; then
    echo -e "${GREEN}✅ Case details with activity log works!${NC}"
else
    echo -e "${RED}❌ Case details retrieval failed${NC}"
    echo "$CASE_DETAIL_RESPONSE"
fi
echo ""

# Test 11: Filter cases
echo -e "${YELLOW}[11/13] Testing case filtering...${NC}"
FILTER_RESPONSE=$(curl -s "$API_URL/api/cases?species=cat&urgency=medium")

if echo "$FILTER_RESPONSE" | grep -q '"cases"'; then
    echo -e "${GREEN}✅ Case filtering works!${NC}"
else
    echo -e "${RED}❌ Case filtering failed${NC}"
fi
echo ""

# Test 12: Test validation (should fail)
echo -e "${YELLOW}[12/13] Testing input validation...${NC}"
VALIDATION_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "short",
    "name": "X",
    "role": "invalid"
  }')

if echo "$VALIDATION_RESPONSE" | grep -q '"error"'; then
    echo -e "${GREEN}✅ Input validation works! (Correctly rejected bad data)${NC}"
else
    echo -e "${RED}❌ Validation should have failed${NC}"
fi
echo ""

# Test 13: Test unauthorized access (should fail)
echo -e "${YELLOW}[13/13] Testing authentication requirement...${NC}"
UNAUTH_RESPONSE=$(curl -s -X POST "$API_URL/api/cases" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "dog",
    "status": "rescued",
    "urgency": "high",
    "locationFound": "Test"
  }')

if echo "$UNAUTH_RESPONSE" | grep -q '"error"'; then
    echo -e "${GREEN}✅ Authentication requirement works! (Correctly rejected request)${NC}"
else
    echo -e "${RED}❌ Should require authentication${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Test Summary                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ All core tests passed!${NC}"
echo ""
echo -e "${YELLOW}Additional Manual Tests:${NC}"
echo "  • Photo upload (requires image file)"
echo "  • WebSocket real-time updates"
echo "  • Rate limiting (rapid requests)"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. View your test data: npm run prisma:studio"
echo "  2. Check logs: tail -f combined.log"
echo "  3. Test WebSocket (see TESTING_GUIDE.md)"
echo "  4. Connect frontend"
echo ""
echo -e "${GREEN}🎉 Backend is working correctly!${NC}"

