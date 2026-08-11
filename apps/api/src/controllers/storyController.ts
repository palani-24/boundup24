import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Story } from '../models/Story';
import { StoryView } from '../models/StoryView';
import { Follow } from '../models/Follow';
import { AppError } from '../middleware/error';

export const createStory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { mediaUrl, mediaType, caption } = req.body;
    if (!mediaUrl) return next(new AppError('Media URL is required for a story', 400));

    const userId = req.user!._id;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const story = await Story.create({
      author: userId,
      mediaUrl,
      mediaType: mediaType || 'IMAGE',
      caption: caption || '',
      expiresAt,
    });

    const populated = await story.populate('author', 'username fullName avatarUrl isVerified');

    res.status(201).json({
      success: true,
      message: 'Story created',
      data: { story: populated },
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedStories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id;

    // Get following IDs
    const follows = await Follow.find({ follower: userId, status: 'ACCEPTED' }).select('following');
    const followingIds = follows.map((f) => f.following);
    const authorIds = [...followingIds, userId];

    const now = new Date();
    const stories = await Story.find({ author: { $in: authorIds }, expiresAt: { $gt: now } })
      .populate('author', 'username fullName avatarUrl isVerified')
      .sort({ createdAt: 1 });

    // Group stories by author
    const storyViews = await StoryView.find({
      viewer: userId,
      story: { $in: stories.map((s) => s._id) },
    });
    const viewedSet = new Set(storyViews.map((v) => v.story.toString()));

    const groupedMap = new Map<string, any>();

    for (const story of stories) {
      const authorIdStr = (story.author as any)._id.toString();
      const storyObj: any = story.toJSON();
      storyObj.hasViewed = viewedSet.has(story._id.toString());

      if (!groupedMap.has(authorIdStr)) {
        groupedMap.set(authorIdStr, {
          author: story.author,
          stories: [storyObj],
          allViewed: storyObj.hasViewed,
        });
      } else {
        const group = groupedMap.get(authorIdStr);
        group.stories.push(storyObj);
        if (!storyObj.hasViewed) group.allViewed = false;
      }
    }

    res.json({
      success: true,
      data: { storyGroups: Array.from(groupedMap.values()) },
    });
  } catch (error) {
    next(error);
  }
};

export const viewStory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const existing = await StoryView.findOne({ story: id, viewer: userId });
    if (!existing) {
      await StoryView.create({ story: id, viewer: userId });
      await Story.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });
    }

    res.json({ success: true, message: 'Story viewed' });
  } catch (error) {
    next(error);
  }
};
