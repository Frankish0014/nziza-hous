import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware, requireRole(['admin']));
router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);

export default router;

