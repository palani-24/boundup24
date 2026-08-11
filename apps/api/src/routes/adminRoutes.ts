import { Router } from 'express';
import {
  getAdminStats,
  getUsers,
  toggleUserStatus,
  getReports,
  updateReportStatus,
  adminDeletePost,
} from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect);
router.use(restrictTo('ADMIN', 'MODERATOR'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/reports', getReports);
router.patch('/reports/:id', updateReportStatus);
router.delete('/posts/:id', adminDeletePost);

export default router;
