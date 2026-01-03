import { Request, Response, NextFunction } from 'express';
import caseService from '../services/caseService';
import { createCaseSchema, updateCaseSchema, caseQuerySchema, userCasesQuerySchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

export class CaseController {
  async getAllCases(req: Request, res: Response, next: NextFunction) {
    try {
      const params = caseQuerySchema.parse(req.query);
      const result = await caseService.getAllCases(params);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const isAuthenticated = !!(req as AuthRequest).user;
      const result = await caseService.getCaseById(id, isAuthenticated);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createCase(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user!.userId;
      const validatedData = createCaseSchema.parse(req.body);
      const result = await caseService.createCase(userId, validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateCase(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user!.userId;
      const validatedData = updateCaseSchema.parse(req.body);
      const result = await caseService.updateCase(id, userId, validatedData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteCase(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user!.userId;
      await caseService.deleteCase(id, userId);
      res.status(200).json({ message: 'Case deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getUserCases(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthRequest).user!.userId;
      const params = userCasesQuerySchema.parse(req.query);
      const result = await caseService.getUserCases(userId, params);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await caseService.getStats();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CaseController();

