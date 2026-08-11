import { Post, IPostDocument } from '../models/Post';
import { Follow } from '../models/Follow';

export const getRankedFeed = async (userId: string, page = 1, limit = 10): Promise<IPostDocument[]> => {
  // 1. Get user's following IDs
  const follows = await Follow.find({ follower: userId, status: 'ACCEPTED' }).select('following');
  const followingIds = follows.map((f) => f.following);

  // Include user's own posts as well
  const authorIds = [...followingIds, userId];

  // 2. Fetch candidate posts
  const skip = (page - 1) * limit;
  const posts = await Post.find({ author: { $in: authorIds } })
    .populate('author', 'username fullName avatarUrl isVerified isPrivate category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit * 2); // fetch extra to rank

  // 3. Rank candidate posts using formula:
  // score = recencyScore + relationshipScore + engagementScore
  const now = Date.now();
  const ranked = posts.map((post) => {
    // Recency score (decay with age)
    const ageInHours = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 100 - ageInHours * 2);

    // Relationship score (followed author = +50, self = +30)
    let relationshipScore = 0;
    const authorIdStr = post.author._id ? post.author._id.toString() : (post.author as any).toString();
    if (authorIdStr === userId) {
      relationshipScore = 30;
    } else if (followingIds.some((id) => id.toString() === authorIdStr)) {
      relationshipScore = 50;
    }

    // Engagement score (likes & comments count)
    const engagementScore = (post.likesCount || 0) * 2 + (post.commentsCount || 0) * 3;

    const totalScore = recencyScore + relationshipScore + engagementScore;
    return { post, score: totalScore };
  });

  // Sort by calculated ranking score descending
  ranked.sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit).map((r) => r.post);
};
