import rateLimit from 'express-rate-limit';

// General rate limiter for all routes
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 5,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for case creation
export const createCaseLimiter = rateLimit({
  windowMs: 3600000, // 1 hour
  max: 10,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many cases created, please try again later',
    },
  },
  keyGenerator: (req) => {
    // Use user ID from authenticated request
    return (req as any).user?.userId || req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for photo uploads
export const uploadLimiter = rateLimit({
  windowMs: 3600000, // 1 hour
  max: 20,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many uploads, please try again later',
    },
  },
  keyGenerator: (req) => {
    return (req as any).user?.userId || req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

