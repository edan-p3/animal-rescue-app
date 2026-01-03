# Frontend Development Prompt for Animal Rescue Case Management Platform

## Project Overview
Create a modern, mobile-responsive frontend for an Animal Rescue Case Management Platform that replaces chaotic WhatsApp coordination with a streamlined, real-time dashboard and case management system. The platform enables animal rescuers to track animals through the rescue pipeline, collaborate on cases, and provide public visibility into rescue efforts.

---

## Color Palette & Design System

### Primary Colors
- **Teal/Turquoise**: `#2D9B9B` or `#3FBFBF`
  - Use for: Primary buttons, active states, navigation highlights, main CTAs
  - Conveys: Trust, calmness, compassion, healing

- **Coral/Salmon**: `#FF6B6B` or `#FA8072`
  - Use for: Accent elements, hover states, secondary buttons, highlights
  - Conveys: Warmth, approachability, energy

### Status & Alert Colors
- **Urgency Red**: `#E74C3C` or `#DC3545`
  - Use for: High-priority cases, critical alerts, urgent badges
  
- **Warning Yellow**: `#F39C12`
  - Use for: Medium urgency cases, warnings, pending actions
  
- **Success Green**: `#27AE60`
  - Use for: Adopted/resolved cases, success messages, completed actions
  
- **Neutral Grays**: 
  - Light Gray: `#F5F7FA` (backgrounds)
  - Medium Gray: `#95A5A6` (secondary text, borders)
  - Dark Gray: `#2C3E50` (primary text, headings)

### Design Principles
- **Compassionate & Professional**: Balance emotional connection with operational efficiency
- **Mobile-First**: Rescuers work from phones in the field
- **Real-Time Updates**: Visual indicators show live information changes
- **Information Hierarchy**: Critical data (urgency, status) must be immediately visible
- **Accessibility**: WCAG 2.1 AA compliance minimum

---

## Core User Interfaces to Build

### 1. Public Dashboard (No Authentication Required)

**Purpose**: Allow community to view all active rescue cases in real-time

**Key Features**:
- **Header Section**:
  - Platform logo/branding
  - Summary statistics cards:
    - Active cases (with count)
    - Animals rescued this month
    - Currently in foster care
    - Successfully adopted this month
  - "Login/Register" button (top right)

- **Filter & Search Bar**:
  - Species dropdown (All, Dog, Cat, Squirrel, Iguana, Other)
  - Status dropdown (All, Reported, Rescued, At Vet, Surgery, At Foster, Adoption Talks, Adopted)
  - Urgency filter (All, High, Medium, Low)
  - Location search
  - Real-time search input

- **Case Display** (Grid or List View Toggle):
  - **Card/Tile Layout** showing:
    - Urgency indicator (colored badge: red/yellow/green)
    - Primary animal photo (with placeholder if none)
    - Species & Case ID
    - Current status (with status icon)
    - General location (e.g., "Downtown Area" - no exact addresses)
    - Time since last update ("Updated 5 min ago")
    - Brief description snippet
    - "View Details" button
  - Hover effects: subtle lift/shadow, coral accent border
  - Responsive grid: 3 columns desktop, 2 tablet, 1 mobile

- **Activity Feed Sidebar** (Desktop only):
  - Recent updates stream
  - "Animal #47 moved to Surgery"
  - "Cat #52 adopted ✓"
  - Timestamps and status changes

- **Loading States**: 
  - Skeleton screens during data fetch
  - Smooth transitions when cases update

**Design Considerations**:
- Urgency cases should "pop" visually (larger card, red border pulse animation)
- Adopted cases can be de-emphasized (lower opacity) or moved to separate "Recent Adoptions" section
- Empty state: Friendly illustration + "No active cases at the moment 🎉"

---

### 2. Case Detail View (Public Version)

**Purpose**: Show full case information to public viewers

**Layout**:
- **Hero Section**:
  - Image gallery/carousel (swipeable on mobile)
  - Large urgency badge (top-right overlay)
  - Case ID & Species heading
  
- **Status Timeline**:
  - Visual pipeline showing: Reported → Rescued → At Vet → Surgery → At Foster → Adoption Talks → Adopted
  - Current status highlighted (teal)
  - Completed stages (green checkmarks)
  - Future stages (gray/inactive)

- **Information Grid** (2-column on desktop, stacked on mobile):
  - **Left Column**:
    - Current Location (general area only)
    - Location Found (general area)
    - Date Rescued
    - Species & Description
    - Urgency Level (visual indicator)
  
  - **Right Column**:
    - Condition Summary
    - Special Needs
    - Behavior Notes (public-safe)
    - Adoption Status (if applicable)

- **Activity Timeline**:
  - Reverse chronological log
  - Icons for different event types (status change, medical update, note added)
  - Timestamps
  - Sanitized user names ("Rescuer Maria", "Dr. Chen's Clinic")

- **CTA Section**:
  - "Interested in adopting?" button
  - "Support this rescue" (future donation integration)

---

### 3. Rescuer Portal - Dashboard (Authenticated)

**Purpose**: Personalized hub for authenticated rescuers

**Layout**:
- **Welcome Header**:
  - "Welcome back, [Name]"
  - Large "+ Create New Case" button (teal, prominent)
  - Quick stats: "You have 3 active cases, 2 collaborations"

- **My Cases Section**:
  - Tabs: "My Cases" | "Collaborating On" | "All Cases"
  - Filters: Status, Urgency, Date
  - Sorting: Last updated, Created date, Urgency level
  
- **Case Cards** (Enhanced from public view):
  - All public card info PLUS:
  - Edit/Update buttons (coral accent)
  - "Add Collaborator" quick action
  - "Transfer Ownership" option
  - Notification badges ("3 updates since you last checked")
  - Assigned next actions ("Surgery tomorrow at 10am")

- **Notifications Panel**:
  - Recent activity on user's cases
  - Collaborator invitations
  - Urgent action items

- **Quick Actions Toolbar**:
  - Upload photos
  - Update status
  - Add notes
  - Message collaborators (future feature)

---

### 4. Create/Edit Case Form (Authenticated)

**Purpose**: Allow rescuers to create new cases or update existing ones

**Form Sections** (Multi-step or Accordion):

**Step 1: Basic Information**
- Species (dropdown with common + "Other" text input)
- Physical Description (textarea)
- Date/Time Found (datetime picker)
- Location Found (address input with map picker)
- Current Location (autocomplete or dropdown)
- Photo Upload (drag-drop zone, mobile camera integration)
  - Preview thumbnails
  - Reorder capability
  - Delete option

**Step 2: Status & Urgency**
- Current Status (visual pipeline selector)
- Urgency Level (radio buttons with color indicators)
  - 🔴 High: Life-threatening, immediate action needed
  - 🟡 Medium: Needs attention soon
  - 🟢 Low: Stable, routine care
- Next Steps (textarea for action items)

**Step 3: Medical & Care Information**
- Condition when found (textarea)
- Injuries/Illnesses (multi-line input)
- Treatments Received (checklist + custom entries)
- Medications (list builder)
- Special Needs (textarea)
- Dietary Requirements (textarea)
- Behavior Notes (textarea)

**Step 4: Collaboration**
- Primary Owner (defaults to creator, can transfer)
- Add Collaborators:
  - Search/select existing users
  - Multi-select with chips/tags
  - Role labels (Vet, Foster, Adoption Coordinator)
- Visibility Settings:
  - Public (visible on dashboard)
  - Private (only collaborators can see)

**Form Behavior**:
- Auto-save drafts (local storage)
- Validation feedback (inline, real-time)
- Loading states on submit
- Success confirmation with "View Case" or "Create Another" options
- Error handling with clear messages

---

### 5. Case Detail View (Authenticated/Owner Version)

**Purpose**: Full edit capabilities for case owners and collaborators

**Same as public view BUT with additional features**:

- **Edit Mode Toggle**: Switch between view and edit
- **Inline Editing**: Click-to-edit fields
- **Action Buttons** (sticky toolbar on mobile):
  - Update Status
  - Add Photos
  - Add Note
  - Manage Collaborators
  - Transfer Ownership
  - Mark as Adopted/Resolved
  - Archive Case

- **Collaborators Management Panel**:
  - List of current collaborators with avatars
  - Remove collaborator button
  - Add new collaborator search
  - Transfer ownership modal
    - Select new owner
    - Confirm transfer
    - Activity log entry

- **Enhanced Activity Log**:
  - Full user names and contact info
  - Edit/Delete own notes
  - Filter by activity type
  - Export log functionality

- **Medical Records Section**:
  - Vet appointment scheduler (calendar widget)
  - Document uploads (vet records, X-rays)
  - Medication tracker with reminders
  - Treatment timeline

---

### 6. User Authentication Pages

**Login Page**:
- Clean, centered card design
- Email/Password fields
- "Remember me" checkbox
- "Forgot password?" link
- Social auth options (Google, Facebook) - optional
- "Don't have an account? Sign up" link
- Background: Subtle pattern or heartwarming animal photo (low opacity overlay)

**Registration Page**:
- Multi-step form:
  1. Basic Info: Name, Email, Password
  2. Role Selection: Rescuer, Vet, Foster, Adoption Coordinator
  3. Optional: Phone, Organization, Location
- Terms of Service checkbox
- "Already have an account? Login" link

**Profile/Settings Page**:
- User information edit
- Password change
- Notification preferences
- Privacy settings
- Account deletion option

---

## Technical Requirements & Best Practices

### Framework & Libraries
- **Recommended Stack**: React with Next.js (for SSR, SEO, and performance)
- **Alternative**: Vue.js with Nuxt or Svelte with SvelteKit
- **State Management**: React Context API, Zustand, or Jotai (avoid Redux complexity)
- **Styling**: Tailwind CSS for utility-first approach
- **Components**: Headless UI or Radix UI for accessible primitives
- **Forms**: React Hook Form for validation and performance
- **Date/Time**: date-fns or Day.js (lightweight)
- **Icons**: Lucide React or Heroicons

### Real-Time Updates
- **Approach**: WebSocket connection or Server-Sent Events (SSE)
- **Fallback**: Polling every 15-30 seconds
- **Visual Indicators**: 
  - "Live" badge pulsing in header
  - Toast notifications for case updates
  - Subtle highlight flash when data changes

### Responsive Design Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+
- Large Desktop: 1440px+

### Performance Optimization
- **Image Optimization**:
  - Lazy loading
  - WebP format with fallbacks
  - Responsive images (srcset)
  - Blur-up placeholders
  
- **Code Splitting**:
  - Route-based lazy loading
  - Dynamic imports for heavy components
  
- **Caching Strategy**:
  - Service Worker for offline capability (PWA)
  - Local storage for user preferences
  - Session storage for form drafts

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**:
  - Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
  - Keyboard navigation for all interactive elements
  - ARIA labels for icon buttons and dynamic content
  - Screen reader announcements for real-time updates
  - Focus indicators (teal outline, visible on all focusable elements)
  
- **Semantic HTML**:
  - Proper heading hierarchy (h1 → h2 → h3)
  - Form labels associated with inputs
  - Buttons vs. links used correctly
  
- **Mobile Accessibility**:
  - Touch targets minimum 44x44px
  - No hover-dependent functionality

### Error Handling & Loading States
- **Network Errors**:
  - Friendly error messages (no technical jargon)
  - Retry buttons
  - Offline mode indicators
  
- **Form Validation**:
  - Real-time validation with debounce
  - Clear error messages near fields
  - Scroll to first error on submit
  
- **Loading States**:
  - Skeleton screens (not just spinners)
  - Optimistic UI updates
  - Progress indicators for multi-step processes

---

## User Experience Flows

### Flow 1: Public User Discovers Case
1. Lands on public dashboard
2. Sees grid of active cases
3. Filters by "Dogs" + "High Urgency"
4. Clicks on case card
5. Views full case details
6. Sees adoption status and contact option
7. Clicks "Interested in Adopting" → Redirects to contact form/email

### Flow 2: Rescuer Creates New Case
1. Logs in to portal
2. Clicks "+ Create New Case"
3. Fills out multi-step form:
   - Basic info with photo upload
   - Sets urgency and status
   - Adds medical notes
   - Adds vet as collaborator
4. Clicks "Create Case"
5. Redirected to case detail view
6. Case immediately appears on public dashboard

### Flow 3: Collaborator Updates Case
1. Vet (collaborator) logs in
2. Sees notification: "New case assigned to you"
3. Opens case from dashboard
4. Clicks "Update Status" → Changes to "At Veterinarian"
5. Adds medical note: "Surgery scheduled for tomorrow"
6. Uploads X-ray photos
7. Saves updates
8. Activity log shows: "Dr. Chen updated case 2 min ago"
9. Public dashboard reflects new status immediately

### Flow 4: Ownership Transfer
1. Maria (current owner) opens case
2. Clicks "Transfer Ownership"
3. Modal opens with user search
4. Searches for "John"
5. Selects John from dropdown
6. Confirmation dialog: "Transfer to John? This cannot be undone."
7. Confirms transfer
8. John receives notification
9. Case now shows "Primary Owner: John"
10. Activity log records transfer

---

## Component Breakdown

### Atomic Design Structure

**Atoms** (Basic building blocks):
- Button (variants: primary, secondary, danger, ghost)
- Input (text, email, password, textarea)
- Badge (urgency, status, notification count)
- Avatar (user profile images)
- Icon (wrapping icon library)
- Checkbox, Radio, Toggle Switch
- Chip/Tag (for collaborators, filters)

**Molecules** (Simple components):
- SearchBar (input + icon)
- FilterDropdown (dropdown + label)
- StatCard (icon + number + label)
- StatusPill (icon + text + color)
- PhotoUpload (drag zone + preview)
- UserChip (avatar + name + remove button)
- ActivityLogItem (icon + text + timestamp)

**Organisms** (Complex components):
- Header (logo + nav + user menu)
- CaseCard (all case summary info)
- CaseGrid (responsive grid of CaseCards)
- CaseDetailHeader (hero image + metadata)
- StatusTimeline (pipeline visualization)
- ActivityFeed (scrollable list of ActivityLogItems)
- FilterBar (multiple FilterDropdowns + SearchBar)
- StatsOverview (multiple StatCards)
- CollaboratorManager (list + add/remove controls)
- FormStepper (multi-step form navigation)

**Templates** (Page layouts):
- PublicDashboardTemplate
- CaseDetailTemplate
- RescuerPortalTemplate
- FormTemplate (create/edit)
- AuthTemplate (login/register)

**Pages** (Specific implementations):
- HomePage (public dashboard)
- CaseDetailPage (public or authenticated view)
- DashboardPage (rescuer portal)
- CreateCasePage
- EditCasePage
- LoginPage
- RegisterPage
- ProfilePage

---

## Animation & Micro-interactions

### Subtle but Meaningful
- **Card Hover**: Slight lift (translateY: -4px) + shadow increase
- **Button Press**: Scale down (0.98) on click
- **Status Change**: Fade out old status, fade in new status
- **New Case Added**: Slide in from top with subtle bounce
- **Notification Badge**: Pulse animation on new count
- **Loading**: Smooth skeleton screen fade-in
- **Success Action**: Green checkmark with scale-up animation
- **Error**: Red shake animation (subtle)

### Page Transitions
- Smooth fade transitions between routes (150-200ms)
- Shared element transitions for card → detail view (if framework supports)

### Real-Time Update Indicators
- Toast notification slides in from top-right
- Updated case card flashes subtle teal highlight (500ms fade out)
- "Live" indicator pulses every 2 seconds

---

## Responsiveness Considerations

### Mobile (< 640px)
- Single-column layout
- Stacked cards (full width)
- Bottom navigation bar for main actions
- Sticky "Create Case" FAB (floating action button) on dashboard
- Collapsible filters (drawer from side)
- Touch-friendly dropdowns (native select on mobile)
- Swipeable card actions (swipe left for edit/delete)

### Tablet (641px - 1024px)
- Two-column grid for case cards
- Side navigation drawer (collapsible)
- Form sections in single column
- Smaller stat cards

### Desktop (> 1025px)
- Three-column grid for case cards
- Persistent side navigation
- Two-column form layout
- Activity feed sidebar visible
- Hover states and tooltips enabled

---

## Integration Points (For Backend Developer)

### Expected API Endpoints

**Public**:
- `GET /api/cases` - Fetch all cases (with filtering query params)
- `GET /api/cases/:id` - Fetch specific case
- `GET /api/stats` - Dashboard summary statistics

**Authenticated**:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/users/me` - Current user profile
- `GET /api/users/me/cases` - Cases owned or collaborated on

**Case Management**:
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case (or archive)
- `POST /api/cases/:id/photos` - Upload photos
- `POST /api/cases/:id/collaborators` - Add collaborator
- `DELETE /api/cases/:id/collaborators/:userId` - Remove collaborator
- `POST /api/cases/:id/transfer` - Transfer ownership
- `POST /api/cases/:id/notes` - Add note/activity

**Real-Time**:
- WebSocket connection: `ws://api/live` or SSE endpoint
- Events: `case_created`, `case_updated`, `case_deleted`

### Data Structures (Expected JSON)

**Case Object**:
```json
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
  "collaborators": [
    {
      "id": "user-uuid-2",
      "name": "Dr. Chen",
      "role": "vet"
    }
  ],
  "photos": [
    {
      "id": "photo-uuid",
      "url": "https://cdn.example.com/photo.jpg",
      "thumbnail_url": "https://cdn.example.com/photo-thumb.jpg"
    }
  ],
  "medical_notes": "Fractured tibia, surgery scheduled",
  "behavior_notes": "Good temperament, calm",
  "activity_log": [
    {
      "id": "activity-uuid",
      "user": "Maria Rodriguez",
      "action": "status_change",
      "description": "Changed status to At Vet",
      "timestamp": "2026-01-03T14:20:00Z"
    }
  ],
  "created_at": "2026-01-03T10:30:00Z",
  "updated_at": "2026-01-03T14:20:00Z"
}
```

**User Object**:
```json
{
  "id": "user-uuid",
  "email": "maria@example.com",
  "name": "Maria Rodriguez",
  "role": "rescuer",
  "phone": "+1234567890",
  "avatar_url": "https://cdn.example.com/avatar.jpg",
  "created_at": "2025-12-01T00:00:00Z"
}
```

---

## Additional Features & Polish

### Empty States
- No active cases: Illustration + "All animals are safe! 🎉"
- No search results: "No cases match your filters"
- No collaborators yet: "Add someone to help with this case"

### Illustrations & Icons
- Use friendly, warm illustrations (consider: Humaaans, unDraw, or custom)
- Animal icons for species (dog, cat, bird, etc.)
- Status icons (house for foster, medical cross for vet, heart for adopted)

### Tooltips & Help Text
- Hover tooltips for icon buttons
- Info icons with helpful explanations
- Contextual help for complex features

### Notifications System
- Toast notifications (top-right)
- Types: Success (green), Error (red), Info (blue), Warning (yellow)
- Auto-dismiss after 5 seconds (unless error)
- Action buttons when relevant ("Undo", "View Case")

### Settings & Preferences
- Theme toggle: Light/Dark mode (future)
- Notification preferences (email, push, SMS)
- Default view (grid vs. list)
- Language selection (future multi-language support)

---

## Testing & Quality Assurance

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- Core Web Vitals: All "Good" ratings

### Testing Checklist
- [ ] All forms validate correctly
- [ ] Image uploads work on mobile camera
- [ ] Real-time updates appear without refresh
- [ ] Responsive on all breakpoints
- [ ] Keyboard navigation works completely
- [ ] Screen reader announces dynamic content
- [ ] Error states display helpful messages
- [ ] Loading states prevent duplicate submissions
- [ ] Offline mode gracefully handles errors

---

## Deliverables

### Phase 1: Core MVP
1. Public dashboard with case grid/list
2. Case detail view (public)
3. Login/Registration pages
4. Rescuer portal dashboard
5. Create case form
6. Edit case functionality
7. Basic photo upload
8. Responsive design (all breakpoints)

### Phase 2: Collaboration Features
9. Add/remove collaborators interface
10. Transfer ownership modal
11. Enhanced activity log
12. User notifications system
13. Real-time updates implementation

### Phase 3: Polish & Optimization
14. Advanced filtering and search
15. Performance optimization
16. Accessibility audit and fixes
17. Micro-interactions and animations
18. PWA setup (offline support)

---

## Design Inspiration & References

### Similar Platforms (for UX patterns)
- Trello/Asana: Card-based project management
- AirTable: Data grid with rich filtering
- Notion: Clean information hierarchy
- GitHub Issues: Activity timeline and collaboration
- Facebook Marketplace: Photo-first cards with quick info

### Color Psychology
- Teal/Turquoise: Trust, healing, calmness (veterinary/medical)
- Coral/Salmon: Warmth, compassion, friendliness (animal welfare)
- Red: Urgency, action needed (emergency cases)
- Green: Success, resolution, life (adoption/recovery)

---

## Final Notes for Gemini 3 Pro

**Tone & Personality**:
- This is a mission-driven tool for animal welfare
- Users are compassionate but busy people working in stressful situations
- Interface should feel supportive, efficient, and hopeful
- Avoid cutesy or overly emotional design - maintain professionalism with warmth

**Priority Order**:
1. **Mobile experience** - Most rescuers use phones in the field
2. **Real-time updates** - Critical for coordination
3. **Information clarity** - Urgency and status must be instantly visible
4. **Easy collaboration** - Handoffs should be seamless
5. **Public visibility** - Community engagement drives support

**Avoid**:
- Cluttered interfaces with too much information
- Dark patterns or hidden features
- Slow, heavy animations that hinder speed
- Overly complex navigation structures
- Assuming users have training - make it intuitive

**Success Metrics**:
- Can a new user find a specific case within 10 seconds?
- Can a rescuer create a case in under 2 minutes on mobile?
- Do users understand urgency levels at a glance?
- Is the collaboration process self-explanatory?

---

**Build a frontend that animal rescuers will love to use, that reduces their cognitive load, and helps save more lives. Good luck! 🐾**

