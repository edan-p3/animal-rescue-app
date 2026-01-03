export interface ApiError {
  code: string;
  message: string;
  details?: any[];
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  access_token: string;
  refresh_token: string;
}

// Error Codes
export enum ErrorCode {
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_TYPE_INVALID = 'FILE_TYPE_INVALID',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// Valid values for case fields
export const VALID_SPECIES = ['dog', 'cat', 'squirrel', 'iguana', 'other'] as const;
export const VALID_STATUSES = ['reported', 'rescued', 'at_vet', 'surgery', 'at_foster', 'adoption_talks', 'adopted'] as const;
export const VALID_URGENCIES = ['high', 'medium', 'low'] as const;
export const VALID_ROLES = ['rescuer', 'vet', 'foster', 'adoption_coordinator', 'admin'] as const;

export type Species = typeof VALID_SPECIES[number];
export type CaseStatus = typeof VALID_STATUSES[number];
export type Urgency = typeof VALID_URGENCIES[number];
export type UserRole = typeof VALID_ROLES[number];

