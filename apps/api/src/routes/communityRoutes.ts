import { Router } from 'express';
import { getCommunities, createCommunity, toggleJoinCommunity } from '../controllers/communityController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getCommunities);
router.post('/', protect, createCommunity);
router.post('/:id/join', protect, toggleJoinCommunity);

export default router;
