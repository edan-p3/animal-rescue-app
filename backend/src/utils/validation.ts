import { z } from 'zod';
import { VALID_SPECIES, VALID_STATUSES, VALID_URGENCIES, VALID_ROLES } from '../types';

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  role: z.enum(VALID_ROLES as any),
  phone: z.string().optional(),
  organization: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

// Case validation schemas
export const createCaseSchema = z.object({
  species: z.enum(VALID_SPECIES as any),
  description: z.string().max(5000).optional(),
  status: z.enum(VALID_STATUSES as any),
  urgency: z.enum(VALID_URGENCIES as any),
  locationFound: z.string().min(1, 'Location found is required').max(255),
  locationCurrent: z.string().max(255).optional(),
  dateRescued: z.string().datetime().optional(),
  conditionDescription: z.string().max(5000).optional(),
  injuries: z.string().max(5000).optional(),
  treatments: z.string().max(5000).optional(),
  medications: z.string().max(5000).optional(),
  specialNeeds: z.string().max(5000).optional(),
  dietaryRequirements: z.string().max(5000).optional(),
  behaviorNotes: z.string().max(5000).optional(),
  publicNotes: z.string().max(2000).optional(),
  isPublic: z.boolean().default(true),
});

export const updateCaseSchema = createCaseSchema.partial();

export const caseQuerySchema = z.object({
  status: z.enum(VALID_STATUSES as any).optional(),
  species: z.enum(VALID_SPECIES as any).optional(),
  urgency: z.enum(VALID_URGENCIES as any).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort_by: z.enum(['created_at', 'updated_at', 'urgency']).default('updated_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const addCollaboratorSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  role_label: z.string().max(100).optional(),
});

export const addNoteSchema = z.object({
  description: z.string().min(1, 'Description is required').max(2000),
  is_public: z.boolean().default(true),
});

export const transferOwnershipSchema = z.object({
  new_owner_id: z.string().uuid('Invalid user ID'),
});

export const userCasesQuerySchema = z.object({
  filter: z.enum(['my_cases', 'collaborating', 'all']).default('my_cases'),
  status: z.enum(VALID_STATUSES as any).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

