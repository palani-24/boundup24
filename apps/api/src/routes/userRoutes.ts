import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  blockUser,
  reportTarget,
} from '../controllers/userController';
import { protect } from '../middleware/auth';
import { upload } from '../services/mediaService';

const router = Router();

router.get('/:username', protect, getProfile);
router.patch('/me', protect, upload.single('avatar'), updateProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);
router.post('/:id/block', protect, blockUser);
router.post('/report', protect, reportTarget);

export default router;
