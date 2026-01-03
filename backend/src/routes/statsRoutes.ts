import { Router } from 'express';
import caseController from '../controllers/caseController';

const router = Router();

// Public stats endpoint
router.get('/', caseController.getStats);

export default router;

