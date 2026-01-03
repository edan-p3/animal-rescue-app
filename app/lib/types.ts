export type UserRole = 'rescuer' | 'vet' | 'foster' | 'coordinator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
}

export type UrgencyLevel = 'low' | 'medium' | 'high';

export type CaseStatus = 
  | 'reported' 
  | 'rescued' 
  | 'at_vet' 
  | 'surgery' 
  | 'at_foster' 
  | 'adoption_talks' 
  | 'adopted';

export interface CasePhoto {
  id: string;
  url: string;
  thumbnail_url?: string;
}

export interface CaseActivity {
  id: string;
  user: string; // Name for display
  action: string;
  description: string;
  timestamp: string;
}

export interface Case {
  id: string;
  species: string;
  description: string;
  status: CaseStatus;
  urgency: UrgencyLevel;
  location_found: string;
  location_current: string;
  date_rescued: string;
  primary_owner: User;
  collaborators: User[];
  photos: CasePhoto[];
  medical_notes?: string;
  behavior_notes?: string;
  activity_log: CaseActivity[];
  created_at: string;
  updated_at: string;
}

