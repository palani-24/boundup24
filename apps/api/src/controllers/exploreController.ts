import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { Hashtag } from '../models/Hashtag';

export const getExploreGrid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category as string;
    let query: any = {};

    if (category && category !== 'All') {
      query.$or = [
        { caption: { $regex: category, $options: 'i' } },
        { hashtags: category.toLowerCase() },
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'username fullName avatarUrl isVerified category')
      .sort({ likesCount: -1, createdAt: -1 })
      .limit(30);

    res.json({
      success: true,
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (!q) {
      return res.json({
        success: true,
        data: { users: [], posts: [], hashtags: [] },
      });
    }

    const regex = new RegExp(q, 'i');

    const users = await User.find({
      $or: [{ username: regex }, { fullName: regex }],
    })
      .select('username fullName avatarUrl isVerified bio category followersCount')
      .limit(10);

    const posts = await Post.find({
      $or: [{ caption: regex }, { location: regex }],
    })
      .populate('author', 'username fullName avatarUrl isVerified')
      .limit(10);

    const hashtags = await Hashtag.find({
      name: new RegExp(q.replace('#', ''), 'i'),
    })
      .sort({ postCount: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { users, posts, hashtags },
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingHashtags = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const hashtags = await Hashtag.find().sort({ postCount: -1 }).limit(10);
    res.json({
      success: true,
      data: { hashtags },
    });
  } catch (error) {
    next(error);
  }
};

export const getHashtagDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tag } = req.params;
    const cleanTag = tag.replace('#', '').toLowerCase();

    const hashtagDoc = await Hashtag.findOne({ name: cleanTag });
    const posts = await Post.find({ hashtags: cleanTag })
      .populate('author', 'username fullName avatarUrl isVerified')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        hashtag: hashtagDoc || { name: cleanTag, postCount: posts.length },
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
