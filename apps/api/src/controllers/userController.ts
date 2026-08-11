import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Follow } from '../models/Follow';
import { Block } from '../models/Block';
import { Report } from '../models/Report';
import { Notification } from '../models/Notification';
import { UpdateProfileSchema } from '../../../../packages/shared/src';
import { AppError } from '../middleware/error';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const targetUser = username && username !== 'me'
      ? await User.findOne({ username: username.toLowerCase() })
      : await User.findById(req.user!._id);
    if (!targetUser) {
      return next(new AppError('User profile not found', 404));
    }

    let isFollowing = false;
    let isFollowPending = false;

    if (req.user) {
      const followDoc = await Follow.findOne({
        follower: req.user._id,
        following: targetUser._id,
      });

      if (followDoc) {
        if (followDoc.status === 'ACCEPTED') isFollowing = true;
        else if (followDoc.status === 'PENDING') isFollowPending = true;
      }
    }

    res.json({
      success: true,
      data: {
        profile: targetUser,
        isFollowing,
        isFollowPending,
        isSelf: req.user?._id.toString() === targetUser._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validated = UpdateProfileSchema.parse(req.body);
    const user = req.user!;

    if (validated.fullName) user.fullName = validated.fullName;
    if (validated.bio !== undefined) user.bio = validated.bio;
    if (validated.website !== undefined) user.website = validated.website;
    if (validated.category) user.category = validated.category;
    if (validated.isPrivate !== undefined) user.isPrivate = validated.isPrivate;

    if (req.file) {
      user.avatarUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.avatarUrl) {
      user.avatarUrl = req.body.avatarUrl;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return next(new AppError(error.errors[0]?.message || 'Invalid input data', 400));
    }
    next(error);
  }
};

export const followUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!._id;

    if (id === currentUserId.toString()) {
      return next(new AppError('You cannot follow yourself', 400));
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return next(new AppError('User not found', 404));
    }

    const existingFollow = await Follow.findOne({ follower: currentUserId, following: id });
    if (existingFollow) {
      return res.json({ success: true, message: 'Already following or request pending', data: { follow: existingFollow } });
    }

    const status = targetUser.isPrivate ? 'PENDING' : 'ACCEPTED';
    const follow = await Follow.create({
      follower: currentUserId,
      following: id,
      status,
    });

    if (status === 'ACCEPTED') {
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(id, { $inc: { followersCount: 1 } });

      await Notification.create({
        recipient: id,
        sender: currentUserId,
        type: 'FOLLOW',
      });
    } else {
      await Notification.create({
        recipient: id,
        sender: currentUserId,
        type: 'FOLLOW_REQUEST',
      });
    }

    res.json({
      success: true,
      message: status === 'ACCEPTED' ? 'Followed successfully' : 'Follow request sent',
      data: { follow, status },
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!._id;

    const follow = await Follow.findOneAndDelete({ follower: currentUserId, following: id });
    if (follow && follow.status === 'ACCEPTED') {
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(id, { $inc: { followersCount: -1 } });
    }

    res.json({
      success: true,
      message: 'Unfollowed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const follows = await Follow.find({ following: id, status: 'ACCEPTED' }).populate(
      'follower',
      'username fullName avatarUrl isVerified category'
    );
    res.json({
      success: true,
      data: { followers: follows.map((f) => f.follower) },
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const follows = await Follow.find({ follower: id, status: 'ACCEPTED' }).populate(
      'following',
      'username fullName avatarUrl isVerified category'
    );
    res.json({
      success: true,
      data: { following: follows.map((f) => f.following) },
    });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user!._id;

    await Block.create({ blocker: currentUserId, blocked: id });
    await Follow.deleteMany({
      $or: [
        { follower: currentUserId, following: id },
        { follower: id, following: currentUserId },
      ],
    });

    res.json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    next(error);
  }
};

export const reportTarget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { targetType, targetId, reason } = req.body;
    const report = await Report.create({
      reporter: req.user!._id,
      targetType,
      targetId,
      reason,
    });
    res.status(201).json({ success: true, message: 'Report submitted for review', data: { report } });
  } catch (error) {
    next(error);
  }
};
