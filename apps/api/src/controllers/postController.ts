import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import { SavedPost } from '../models/SavedPost';
import { User } from '../models/User';
import { Hashtag } from '../models/Hashtag';
import { Notification } from '../models/Notification';
import { getRankedFeed } from '../services/feedService';
import { CreatePostSchema, CreateCommentSchema } from '../../../../packages/shared/src';
import { AppError } from '../middleware/error';

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validated = CreatePostSchema.parse(req.body);
    const userId = req.user!._id;

    // Extract hashtags from caption or explicit payload
    let tags = validated.hashtags || [];
    if (validated.caption) {
      const extracted = validated.caption.match(/#[\w]+/g);
      if (extracted) {
        tags = [...new Set([...tags, ...extracted.map((t: string) => t.replace('#', '').toLowerCase())])];
      }
    }

    const post = await Post.create({
      author: userId,
      media: validated.media,
      type: validated.media.length > 1 ? 'CAROUSEL' : validated.media[0]?.type || 'IMAGE',
      caption: validated.caption || '',
      hashtags: tags,
      location: validated.location || '',
      isCommentsDisabled: validated.isCommentsDisabled || false,
      isLikeCountHidden: validated.isLikeCountHidden || false,
    });

    // Increment user post count
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    // Update hashtag counts
    for (const tag of tags) {
      await Hashtag.findOneAndUpdate(
        { name: tag },
        { $inc: { postCount: 1 } },
        { upsert: true, new: true }
      );
    }

    const populatedPost = await post.populate('author', 'username fullName avatarUrl isVerified category');

    res.status(201).json({
      success: true,
      message: 'Post published successfully',
      data: { post: populatedPost },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return next(new AppError(error.errors[0]?.message || 'Invalid post payload', 400));
    }
    next(error);
  }
};

export const getFeed = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.user!._id.toString();

    const posts = await getRankedFeed(userId, page, limit);

    // Attach user specific status (isLiked, isSaved)
    const postIds = posts.map((p) => p._id);
    const userLikes = await Like.find({ user: userId, targetId: { $in: postIds }, targetType: 'POST' });
    const userSaves = await SavedPost.find({ user: userId, post: { $in: postIds } });

    const likedSet = new Set(userLikes.map((l) => l.targetId.toString()));
    const savedSet = new Set(userSaves.map((s) => s.post.toString()));

    const postsWithFlags = posts.map((p) => {
      const obj: any = p.toJSON();
      obj.isLiked = likedSet.has(p._id.toString());
      obj.isSaved = savedSet.has(p._id.toString());
      return obj;
    });

    res.json({
      success: true,
      data: { posts: postsWithFlags },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'username fullName avatarUrl isVerified category');
    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    const userId = req.user?._id?.toString();
    const isLiked = userId ? !!(await Like.findOne({ user: userId, targetId: id, targetType: 'POST' })) : false;
    const isSaved = userId ? !!(await SavedPost.findOne({ user: userId, post: id })) : false;

    const obj: any = post.toJSON();
    obj.isLiked = isLiked;
    obj.isSaved = isSaved;

    res.json({
      success: true,
      data: { post: obj },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .populate('author', 'username fullName avatarUrl isVerified category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const post = await Post.findById(id);
    if (!post) return next(new AppError('Post not found', 404));

    const existing = await Like.findOne({ user: userId, targetId: id, targetType: 'POST' });
    if (!existing) {
      await Like.create({ user: userId, targetId: id, targetType: 'POST' });
      await Post.findByIdAndUpdate(id, { $inc: { likesCount: 1 } });

      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: 'LIKE',
          post: post._id,
        });
      }
    }

    res.json({ success: true, message: 'Post liked' });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const existing = await Like.findOneAndDelete({ user: userId, targetId: id, targetType: 'POST' });
    if (existing) {
      await Post.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });
    }

    res.json({ success: true, message: 'Post unliked' });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ post: id, parentComment: null })
      .populate('author', 'username fullName avatarUrl isVerified')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = CreateCommentSchema.parse(req.body);
    const userId = req.user!._id;

    const post = await Post.findById(id);
    if (!post) return next(new AppError('Post not found', 404));
    if (post.isCommentsDisabled) return next(new AppError('Comments are disabled for this post', 403));

    const comment = await Comment.create({
      post: id,
      author: userId,
      content: validated.content,
      parentComment: validated.parentCommentId || null,
    });

    await Post.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });

    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: 'COMMENT',
        post: post._id,
        comment: comment._id,
        text: validated.content.slice(0, 50),
      });
    }

    const populated = await comment.populate('author', 'username fullName avatarUrl isVerified');

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: { comment: populated },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return next(new AppError(error.errors[0]?.message || 'Invalid comment', 400));
    }
    next(error);
  }
};

export const savePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;
    const collectionName = req.body.collectionName || 'All Posts';

    await SavedPost.findOneAndUpdate(
      { user: userId, post: id },
      { collectionName },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Post saved to collection' });
  } catch (error) {
    next(error);
  }
};

export const unsavePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    await SavedPost.findOneAndDelete({ user: userId, post: id });
    res.json({ success: true, message: 'Post removed from saved' });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const post = await Post.findById(id);
    if (!post) return next(new AppError('Post not found', 404));

    if (post.author.toString() !== userId.toString() && req.user?.role !== 'ADMIN') {
      return next(new AppError('Unauthorized to delete this post', 403));
    }

    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post: id });
    await Like.deleteMany({ targetId: id, targetType: 'POST' });
    await SavedPost.deleteMany({ post: id });
    await User.findByIdAndUpdate(post.author, { $inc: { postsCount: -1 } });

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
