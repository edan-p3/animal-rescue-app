import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../types';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCode,
    message: string,
    public details?: any[]
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: (req as any).user?.userId,
  });

  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        error: {
          code: ErrorCode.RESOURCE_CONFLICT,
          message: 'Resource already exists',
          details: [{ field: prismaError.meta?.target?.[0], message: 'Already in use' }],
        },
      });
    }
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        error: {
          code: ErrorCode.RESOURCE_NOT_FOUND,
          message: 'Resource not found',
        },
      });
    }
  }

  // Handle validation errors from zod
  if (err.name === 'ZodError') {
    const zodError = err as any;
    return res.status(400).json({
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: zodError.errors.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  // Default error
  res.status(500).json({
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
};

