# Animal Rescue Case Management Platform
## Product Requirements Document

---

## 1. Overview

### Problem Statement
Animal rescuers currently coordinate through WhatsApp, leading to lost information, missed updates, duplicate efforts, and animals falling through the cracks. There is no centralized way to track animals through the rescue pipeline or see real-time status of ongoing cases.

### Solution
A live dashboard and case management system that provides:
- **Public View**: Real-time visibility into all active rescue cases
- **Rescuer Portal**: Authenticated access for rescuers to create and update cases
- **Collaborative Workflow**: Clear ownership with ability to add collaborators for handoffs

### Target Users
- **Animal Rescuers**: Individuals who find and rescue stray/injured animals
- **Veterinarians**: Medical care providers who treat rescued animals
- **Foster Families**: Temporary caregivers housing animals
- **Adoption Coordinators**: People managing adoption process
- **General Public**: Community members who want to follow rescue efforts

---

## 2. Core Features

### 2.1 Animal Case Records
Each rescued animal gets a digital case file containing:

- **Basic Information**
  - Species (dog, cat, squirrel, iguana, etc.)
  - Location found (address or general area)
  - Date/time rescued
  - Physical description
  - Photos/documentation
  - Unique case ID

- **Status Pipeline**
  - Reported
  - Rescued
  - At Veterinarian
  - Surgery/Treatment
  - At Foster
  - Adoption Talks
  - Adopted
  - Other custom statuses

- **Medical Information**
  - Condition when found
  - Injuries/illnesses
  - Treatments received
  - Medications
  - Immunizations
  - Surgery notes
  - Vet appointment history

- **Care Details**
  - Current location (specific vet clinic, shelter, foster name)
  - Assigned caregivers
  - Special needs
  - Behavior notes
  - Dietary requirements

- **Adoption Information**
  - Availability status
  - Interested families
  - Adoption status
  - Follow-up notes

### 2.2 Live Dashboard (Public View)

**Purpose**: Allow anyone to see what's happening with rescue efforts in real-time

**Display Elements**:
- Grid/list view of all active cases
- Visual status indicators (color-coded by urgency/stage)
- Recent activity feed
- Summary statistics (animals rescued this month, currently in care, adopted, etc.)
- Filter options (by species, status, location, urgency)
- Search functionality

**Privacy Considerations**:
- Exact addresses shown as general area only (neighborhood/district)
- Rescuer contact information hidden
- Sensitive medical details optional to display
- Option to mark cases as "private" if needed

### 2.3 Rescuer Portal (Authenticated Users)

**Case Management**:
- Create new animal cases
- Update cases they own or collaborate on
- Add photos/documentation
- Update status through pipeline
- Add notes and activity logs
- Mark urgency level
- Assign next steps

**Collaboration Tools**:
- Add other users as collaborators on specific cases
- Transfer primary ownership
- Tag users in updates
- View assigned cases dashboard

**Activity Tracking**:
- See all their active cases
- Filter by status, urgency, date
- Personal activity history
- Notifications for cases they're involved in

### 2.4 User Management & Access Control

**Three-Tier Access Model**:

1. **Public (No Login)**
   - View-only access to dashboard
   - Cannot create or edit anything
   - Can see sanitized case information

2. **Authenticated Users (Rescuers)**
   - Create new cases (become primary owner)
   - Edit cases they own or are collaborating on
   - Cannot modify other users' cases without permission
   - Can transfer ownership or add collaborators

3. **Admin (Optional Future)**
   - Full access to all cases
   - User management
   - System settings

**Permission Model**:
- Each case has a `primary_owner` (one user)
- Each case has `collaborators` (array of users)
- Edit permission: user must be primary owner OR in collaborators list
- Full activity log tracks who made each change

---

## 3. Key Friction Points Being Solved

### 3.1 Information Burial/Loss
**Problem**: Critical updates disappear in WhatsApp scroll, new volunteers have no context
**Solution**: Permanent, searchable case records with full history

### 3.2 Status Ambiguity
**Problem**: "Where is the cat from Tuesday?" - no one knows without asking
**Solution**: Live dashboard shows current status and location of every animal

### 3.3 Duplicate Effort
**Problem**: Two rescuers both drive to same location, multiple people calling same vet
**Solution**: Real-time visibility prevents redundant actions

### 3.4 Handoff Failures
**Problem**: Information lost during rescuer → vet → foster → adoption transitions
**Solution**: Collaborative access ensures all stakeholders can update same case

### 3.5 Capacity Blindness
**Problem**: Can't see which fosters/vets are available
**Solution**: Dashboard shows current caseload and availability (future feature)

### 3.6 Accountability Gaps
**Problem**: "Someone said they'd follow up" - who? when?
**Solution**: Clear ownership and next step assignments

### 3.7 Urgent vs. Routine Triage
**Problem**: Life-threatening cases don't stand out in chat stream
**Solution**: Visual urgency flags and filtering

### 3.8 Reporting Impossible
**Problem**: Can't answer "How many animals saved this month?"
**Solution**: Built-in analytics and statistics

### 3.9 Communication Overload
**Problem**: Constant notifications for irrelevant cases
**Solution**: Filtered views and notifications only for your cases

---

## 4. User Workflows

### 4.1 Workflow: Rescuer Finds Injured Dog

1. **Rescuer (Maria)** creates new case:
   - Species: Dog
   - Location: 5th Street & Main
   - Condition: Injured leg, bleeding
   - Status: Rescued
   - Urgency: High
   - Photos uploaded
   - Maria is primary owner

2. **Public Dashboard** updates immediately:
   - New case appears
   - Shows "Dog - 5th & Main area - At Rescuer - High Priority"

3. **Maria** adds collaborators:
   - Adds "Dr. Chen's Vet Clinic" as collaborator
   - Transports dog to vet

4. **Dr. Chen (vet staff)** updates case:
   - Changes status to "At Veterinarian"
   - Adds medical notes: "Fractured tibia, needs surgery"
   - Adds vet appointment for tomorrow

5. **Maria** updates after surgery:
   - Status: "Recovery/Treatment"
   - Adds collaborator "Sarah (foster)"
   - Notes: "Surgery successful, needs 2 weeks recovery"

6. **Sarah (foster)** receives dog:
   - Updates status to "At Foster"
   - Adds behavior notes over next 2 weeks
   - Updates photos of recovery

7. **Adoption Coordinator (James)** added:
   - Maria adds James as collaborator
   - Status changes to "Adoption Talks"
   - James adds interested family info

8. **Case Resolution**:
   - Status: "Adopted"
   - James transfers primary ownership to himself for follow-up
   - Case marked complete but remains viewable

### 4.2 Workflow: Transfer of Ownership

**Scenario**: Maria goes on vacation mid-case

1. Maria opens case for injured cat
2. Selects "Transfer Ownership" option
3. Chooses another rescuer (John)
4. John receives notification
5. John becomes primary owner
6. Can now manage the case fully
7. Activity log shows: "Ownership transferred from Maria to John"

---

## 5. Technical Requirements

### 5.1 Core Technology Stack (Recommendations)

**Frontend**:
- React or Next.js (real-time updates, mobile responsive)
- Tailwind CSS (clean, modern UI)
- WebSocket or polling for live updates

**Backend**:
- Node.js/Express or Python/Django
- PostgreSQL (relational data for cases, users, relationships)
- Authentication: JWT or session-based

**File Storage**:
- AWS S3 or Cloudinary (for animal photos)

**Hosting**:
- Vercel/Netlify (frontend)
- Railway/Render/AWS (backend)

### 5.2 Database Schema (Simplified)

**Users Table**:
```
- id
- email
- password_hash
- name
- role (rescuer, vet, foster, admin)
- phone (optional)
- created_at
```

**Cases Table**:
```
- id
- species
- location_found
- location_current
- status
- urgency_level
- condition_description
- primary_owner_id (foreign key to users)
- created_at
- updated_at
```

**Collaborators Table** (many-to-many):
```
- case_id
- user_id
- added_at
- added_by
```

**Activity_Log Table**:
```
- id
- case_id
- user_id
- action_type (status_change, note_added, photo_added, etc.)
- description
- timestamp
```

**Photos Table**:
```
- id
- case_id
- url
- uploaded_by
- uploaded_at
```

### 5.3 API Endpoints (Examples)

**Public Endpoints**:
- `GET /api/cases` - Get all cases (public view)
- `GET /api/cases/:id` - Get specific case details
- `GET /api/stats` - Get summary statistics

**Authenticated Endpoints**:
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case (with permission check)
- `POST /api/cases/:id/collaborators` - Add collaborator
- `POST /api/cases/:id/transfer` - Transfer ownership
- `POST /api/cases/:id/photos` - Upload photo
- `GET /api/users/me/cases` - Get my cases

**Authentication**:
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### 5.4 Real-Time Updates

**Options**:
1. **WebSockets** (best for true real-time)
   - Socket.io or native WebSockets
   - Broadcast updates when cases change
   - Clients receive instant updates

2. **Polling** (simpler, good enough)
   - Frontend checks for updates every 10-30 seconds
   - Easier to implement, less infrastructure

**Recommendation**: Start with polling, upgrade to WebSockets if needed

### 5.5 Mobile Considerations

- Fully responsive design (mobile-first)
- Photo upload from phone camera
- Touch-friendly interface
- Offline support (future consideration)
- Progressive Web App (PWA) for app-like experience

---

## 6. User Interface Mockup Concepts

### 6.1 Public Dashboard View

**Layout**:
```
┌─────────────────────────────────────────────┐
│  Animal Rescue Live Dashboard               │
│                                             │
│  [Filters: All Species ▼] [Status: All ▼]  │
│  [Search...]                                │
│                                             │
│  📊 Stats: 12 Active | 45 Rescued This Month│
├─────────────────────────────────────────────┤
│                                             │
│  🔴 URGENT - Dog - Downtown Area            │
│  Status: At Vet - Surgery Needed            │
│  Last Update: 5 min ago                     │
│  [View Details]                             │
├─────────────────────────────────────────────┤
│  🟡 Cat - Northside                         │
│  Status: At Foster - Adoption Talks         │
│  Last Update: 2 hours ago                   │
│  [View Details]                             │
├─────────────────────────────────────────────┤
│  🟢 Iguana - East District                  │
│  Status: Adopted                            │
│  Last Update: 1 day ago                     │
│  [View Details]                             │
└─────────────────────────────────────────────┘
```

### 6.2 Rescuer Portal View

**My Cases Dashboard**:
```
┌─────────────────────────────────────────────┐
│  Welcome back, Maria                        │
│  [+ Create New Case]                        │
│                                             │
│  My Active Cases (3)                        │
│  ├─ 🔴 Dog #47 - Surgery tomorrow          │
│  ├─ 🟡 Cat #52 - Need foster               │
│  └─ 🟢 Squirrel #49 - Recovery going well  │
│                                             │
│  Collaborating On (2)                       │
│  ├─ Dog #45 - At Dr. Chen's                │
│  └─ Cat #51 - Adoption pending             │
└─────────────────────────────────────────────┘
```

### 6.3 Case Detail View

```
┌─────────────────────────────────────────────┐
│  ← Back to Dashboard                        │
│                                             │
│  🔴 Dog - Case #47                          │
│  Primary Owner: Maria                       │
│  [Edit] [Add Collaborator] [Transfer]      │
│                                             │
│  📸 [Photo 1] [Photo 2] [+ Add Photo]      │
│                                             │
│  Status: At Veterinarian                    │
│  [Change Status ▼]                          │
│                                             │
│  Urgency: 🔴 High                           │
│                                             │
│  Location: Dr. Chen's Vet Clinic            │
│  Found: Downtown, 5th & Main                │
│                                             │
│  Medical Notes:                             │
│  - Fractured tibia                          │
│  - Surgery scheduled for tomorrow 10am      │
│  - Good temperament                         │
│  [+ Add Note]                               │
│                                             │
│  Collaborators:                             │
│  • Dr. Chen (Vet)                           │
│  • Sarah (Foster - pending)                 │
│  [+ Add Collaborator]                       │
│                                             │
│  Activity Log:                              │
│  • 10 min ago - Maria updated status        │
│  • 2 hours ago - Dr. Chen added med notes   │
│  • 5 hours ago - Maria added photo          │
│  • 6 hours ago - Maria created case         │
└─────────────────────────────────────────────┘
```

---

## 7. MVP Feature Prioritization

### Phase 1: Core MVP (Launch)
**Goal**: Replace WhatsApp for basic case tracking

✅ Must Have:
- User registration/login
- Create animal cases
- Update case status
- Basic case information (species, location, status, notes)
- Photo upload
- Public dashboard (read-only)
- Rescuer portal (authenticated)
- Primary ownership model
- Activity log
- Mobile-responsive design

### Phase 2: Collaboration (Post-Launch)
**Goal**: Enable multi-user workflows

✅ Must Have:
- Add collaborators to cases
- Transfer ownership
- Permissions system
- User notifications
- Urgency flagging
- Status pipeline customization

### Phase 3: Advanced Features (Future)
**Goal**: Scale and optimize operations

🔮 Nice to Have:
- Resource tracking (vet/foster capacity)
- Analytics dashboard
- Export reports
- Calendar integration
- WhatsApp integration/bridging
- SMS notifications
- Map view of cases
- Adoption matching algorithm
- Financial tracking (vet bills, donations)
- Multi-language support

---

## 8. Success Metrics

### User Adoption
- Number of registered rescuers
- Active cases created per week
- Public dashboard views
- User retention rate

### Operational Efficiency
- Average time from rescue to adoption
- Number of animals tracked
- Case handoff success rate (no animals lost)
- Reduction in duplicate rescue attempts

### Collaboration
- Average number of collaborators per case
- Status update frequency
- User engagement (logins per week)

---

## 9. Open Questions & Decisions Needed

### Privacy & Public View
- [ ] What information should be hidden from public view?
- [ ] Should there be option for fully private cases?
- [ ] Are rescuer names shown publicly or just "Rescuer A"?

### Collaboration Model
- [ ] Confirm: Primary owner + collaborators approach?
- [ ] Or simpler: Everyone can edit everything with audit log?
- [ ] Should there be role-based permissions (vet role, foster role)?

### Notifications
- [ ] Email notifications when added as collaborator?
- [ ] Daily digest of case updates?
- [ ] SMS for urgent cases?

### Case Lifecycle
- [ ] Should adopted cases be archived or remain visible?
- [ ] Can cases be deleted or only marked inactive?
- [ ] How long should cases remain on public dashboard?

### Technical
- [ ] Self-hosted or cloud platform?
- [ ] Budget for hosting/storage?
- [ ] Who will maintain the system?

---

## 10. Next Steps

### Validation Phase
1. **User Interviews**: Talk to 3-5 active rescuers
   - Confirm friction points
   - Validate feature priorities
   - Get feedback on collaboration model
   - Understand privacy concerns

2. **Competitive Research**: Check if similar tools exist
   - Pet shelter management software
   - Other rescue coordination tools
   - What can we learn/avoid?

### Design Phase
3. **Wireframes**: Create detailed UI mockups
4. **User Flow Diagrams**: Map out key workflows
5. **Data Model**: Finalize database schema

### Development Phase
6. **Tech Stack Selection**: Confirm framework choices
7. **MVP Development**: Build Phase 1 features
8. **User Testing**: Beta test with small group
9. **Launch**: Deploy to full rescue community
10. **Iterate**: Gather feedback and improve

---

## 11. Timeline Estimate (MVP)

**Assuming 1 full-time developer:**
- Week 1-2: Setup, database design, authentication
- Week 3-4: Case management CRUD operations
- Week 5-6: Public dashboard, rescuer portal
- Week 7-8: Photo upload, activity logging
- Week 9-10: Testing, bug fixes, polish
- Week 11-12: Beta testing with rescuers, final adjustments

**Total: ~3 months to MVP**

**With 2 developers or part-time work, adjust accordingly.**

---

## Appendix: Example Use Cases

### Use Case 1: Emergency Surgery Case
1. Rescuer finds dog hit by car
2. Creates urgent case with photos
3. Public dashboard shows red flag alert
4. Community member sees alert, offers to pay vet bill
5. Rescuer adds vet as collaborator
6. Vet updates: "Surgery successful, recovering"
7. Foster volunteer sees update, offers to help
8. Case progresses through recovery to adoption

### Use Case 2: Multi-Rescuer Coordination
1. Person reports injured cat on WhatsApp
2. Rescuer A creates case: "Reported - needs pickup"
3. Rescuer B sees dashboard, offers to pick up
4. Rescuer A adds B as collaborator
5. Rescuer B updates: "Rescued, taking to vet"
6. Both can track progress
7. No duplicate rescue attempts

### Use Case 3: Adoption Follow-Up
1. Dog adopted 2 weeks ago
2. Adoption coordinator wants to check in
3. Searches for case by adopter name
4. Reviews full history (medical, behavior notes)
5. Calls adopter with informed questions
6. Updates case with follow-up notes

---

**Document Version**: 1.0  
**Last Updated**: January 2, 2026  
**Status**: Draft for Review
