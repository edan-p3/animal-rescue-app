import { Router } from 'express';
import caseController from '../controllers/caseController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { createCaseLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.get('/', caseController.getAllCases);
router.get('/updates', caseController.getAllCases); // For polling
router.get('/:id', optionalAuthenticate, caseController.getCaseById);

// Protected routes
router.post('/', authenticate, createCaseLimiter, caseController.createCase);
router.put('/:id', authenticate, caseController.updateCase);
router.delete('/:id', authenticate, caseController.deleteCase);

export default router;

