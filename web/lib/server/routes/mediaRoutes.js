import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/service/:serviceId', mediaController.listMediaByService);
router.post('/upload', authMiddleware, requireRole(['admin']), upload.single('image'), mediaController.uploadImage);
router.post('/', authMiddleware, requireRole(['admin']), mediaController.addMedia);

export default router;

