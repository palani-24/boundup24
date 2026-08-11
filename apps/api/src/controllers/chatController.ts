import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { SendMessageSchema } from '../../../../packages/shared/src';
import { AppError } from '../middleware/error';

export const getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username fullName avatarUrl isVerified status')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username fullName' },
      })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    next(error);
  }
};

export const startConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { recipientId, isGroup, name, participantIds } = req.body;
    const currentUserId = req.user!._id;

    if (!isGroup) {
      if (!recipientId) return next(new AppError('Recipient ID is required', 400));
      let conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [currentUserId, recipientId], $size: 2 },
      }).populate('participants', 'username fullName avatarUrl isVerified status');

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [currentUserId, recipientId],
          isGroup: false,
        });
        await conversation.populate('participants', 'username fullName avatarUrl isVerified status');
      }

      return res.status(200).json({ success: true, data: { conversation } });
    } else {
      const allParticipants = [...new Set([currentUserId.toString(), ...(participantIds || [])])];
      const conversation = await Conversation.create({
        participants: allParticipants,
        isGroup: true,
        name: name || 'Group Chat',
      });
      await conversation.populate('participants', 'username fullName avatarUrl isVerified status');
      return res.status(201).json({ success: true, data: { conversation } });
    }
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user!._id;

    const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conversation) return next(new AppError('Conversation not found', 404));

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'username fullName avatarUrl')
      .populate('sharedPost')
      .populate('sharedProfile', 'username fullName avatarUrl')
      .sort({ createdAt: 1 });

    // Mark messages as read by current user
    await Message.updateMany(
      { conversation: conversationId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validated = SendMessageSchema.parse(req.body);
    const userId = req.user!._id;

    let conversationId = validated.conversationId;

    if (!conversationId && validated.recipientId) {
      let conv = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [userId, validated.recipientId], $size: 2 },
      });
      if (!conv) {
        conv = await Conversation.create({
          participants: [userId, validated.recipientId],
          isGroup: false,
        });
      }
      conversationId = conv._id.toString();
    }

    if (!conversationId) {
      return next(new AppError('Conversation or Recipient ID is required', 400));
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      text: validated.text || '',
      mediaUrl: validated.mediaUrl,
      type: validated.type,
      sharedPost: validated.sharedPostId,
      sharedProfile: validated.sharedProfileId,
      replyToMessage: validated.replyToMessageId,
      readBy: [userId],
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    const populated = await message.populate('sender', 'username fullName avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: { message: populated, conversationId },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return next(new AppError(error.errors[0]?.message || 'Invalid message', 400));
    }
    next(error);
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const message = await Message.findById(id);
    if (!message) return next(new AppError('Message not found', 404));

    if (message.sender.toString() !== userId.toString()) {
      return next(new AppError('Unauthorized to delete message', 403));
    }

    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};
