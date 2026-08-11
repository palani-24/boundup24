import { Router } from 'express';
import {
  createPost,
  getFeed,
  getPostById,
  getUserPosts,
  likePost,
  unlikePost,
  getComments,
  createComment,
  savePost,
  unsavePost,
  deletePost,
} from '../controllers/postController';
import { protect } from '../middleware/auth';
import { upload } from '../services/mediaService';

const router = Router();

router.get('/feed', protect, getFeed);
router.post('/', protect, upload.array('mediaFiles', 10), createPost);
router.get('/user/:userId', protect, getUserPosts);
router.get('/:id', protect, getPostById);
router.delete('/:id', protect, deletePost);

router.post('/:id/like', protect, likePost);
router.delete('/:id/like', protect, unlikePost);

router.get('/:id/comments', protect, getComments);
router.post('/:id/comments', protect, createComment);

router.post('/:id/save', protect, savePost);
router.delete('/:id/save', protect, unsavePost);

export default router;
