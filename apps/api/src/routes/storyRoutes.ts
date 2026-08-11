import { Router } from 'express';
import { createStory, getFeedStories, viewStory } from '../controllers/storyController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getFeedStories);
router.post('/', protect, createStory);
router.post('/:id/view', protect, viewStory);

export default router;
