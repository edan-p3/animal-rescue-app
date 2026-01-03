import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register({
        ...validatedData,
        role: validatedData.role as string,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = refreshTokenSchema.parse(req.body);
      const result = await authService.refresh(refresh_token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = refreshTokenSchema.parse(req.body);
      await authService.logout(refresh_token);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user!.userId;
      const user = await authService.getMe(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();

