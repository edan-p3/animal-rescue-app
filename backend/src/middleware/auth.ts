import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { ErrorCode, JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        401,
        ErrorCode.AUTH_TOKEN_INVALID,
        'No authentication token provided'
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      (req as AuthRequest).user = decoded;
      next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError(
          401,
          ErrorCode.AUTH_TOKEN_EXPIRED,
          'Authentication token has expired'
        );
      }
      throw new AppError(
        401,
        ErrorCode.AUTH_TOKEN_INVALID,
        'Invalid authentication token'
      );
    }
  } catch (err) {
    next(err);
  }
};

// Optional authentication - doesn't throw if no token
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        (req as AuthRequest).user = decoded;
      } catch (err) {
        // Ignore errors for optional auth
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

