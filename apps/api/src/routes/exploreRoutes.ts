import { Router } from 'express';
import { getExploreGrid, search, getTrendingHashtags, getHashtagDetail } from '../controllers/exploreController';

const router = Router();

router.get('/explore', getExploreGrid);
router.get('/search', search);
router.get('/hashtags/trending', getTrendingHashtags);
router.get('/hashtags/:tag', getHashtagDetail);

export default router;
