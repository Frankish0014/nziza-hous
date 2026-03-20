import { Router } from 'express';
import authRoutes from './authRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import messageRoutes from './messageRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'API healthy' }));
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/messages', messageRoutes);
router.use('/media', mediaRoutes);
router.use('/admin', adminRoutes);

export default router;

