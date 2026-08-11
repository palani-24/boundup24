import { Router } from 'express';
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  deleteMessage,
} from '../controllers/chatController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, startConversation);
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/messages', protect, sendMessage);
router.delete('/messages/:id', protect, deleteMessage);

export default router;
