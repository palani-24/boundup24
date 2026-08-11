import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Report } from '../models/Report';
import { Comment } from '../models/Comment';
import { AppError } from '../middleware/error';

export const getAdminStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalReports = await Report.countDocuments({ status: 'PENDING' });
    const suspendedUsers = await User.countDocuments({ status: 'SUSPENDED' });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPosts,
        totalReports,
        suspendedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: { users } });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) return next(new AppError('User not found', 404));

    user.status = status;
    await user.save();

    res.json({ success: true, message: `User status updated to ${status}`, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'username fullName avatarUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { reports } });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, message: 'Report status updated', data: { report } });
  } catch (error) {
    next(error);
  }
};

export const adminDeletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post: id });
    res.json({ success: true, message: 'Post removed by admin' });
  } catch (error) {
    next(error);
  }
};
