import { Router } from 'express';
import caseController from '../controllers/caseController';
import { authenticate } from '../middleware/auth';

const router = Router();

// User-specific case routes
router.get('/me/cases', authenticate, caseController.getUserCases);

export default router;

