import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import storyRoutes from './storyRoutes';
import chatRoutes from './chatRoutes';
import exploreRoutes from './exploreRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/stories', storyRoutes);
router.use('/chat', chatRoutes);
router.use('/', exploreRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
