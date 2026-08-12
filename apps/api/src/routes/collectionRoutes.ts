import { Router } from 'express';
import { getCollections, createCollection, togglePostInCollection } from '../controllers/collectionController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getCollections);
router.post('/', protect, createCollection);
router.post('/toggle', protect, togglePostInCollection);

export default router;
