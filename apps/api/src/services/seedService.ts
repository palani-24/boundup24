import { User } from '../models/User';
import { Post } from '../models/Post';
import { Story } from '../models/Story';

export const seedInitialDemoData = async () => {
  try {
    const postCount = await Post.countDocuments();
    if (postCount >= 6) {
      return; // Already populated
    }

    console.log('[SEED] Seeding rich demo posts, stories, and creator profiles...');

    // 1. Ensure demo creators exist
    const demoUsersData = [
      {
        username: 'elena_vance',
        email: 'elena@boundup.com',
        passwordHash: 'password123',
        fullName: 'Elena Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        bio: 'Visual Storyteller & Travel Photographer 📸✨',
        category: 'Photography',
        isVerified: true,
        badges: ['Verified', 'Top Creator'],
      },
      {
        username: 'marcus_dev',
        email: 'marcus@boundup.com',
        passwordHash: 'password123',
        fullName: 'Marcus Sterling',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        bio: 'Full Stack Engineer & UI Enthusiast 🚀',
        category: 'Tech',
        isVerified: true,
        badges: ['Verified', 'Early Adopter'],
      },
      {
        username: 'cyber_sam',
        email: 'sam@boundup.com',
        passwordHash: 'password123',
        fullName: 'Samantha Cyber',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
        bio: 'Digital Artist & Motion Designer 🎨',
        category: 'Art',
        isVerified: false,
        badges: ['Top Creator'],
      },
      {
        username: 'gourmet_palani',
        email: 'food@boundup.com',
        passwordHash: 'password123',
        fullName: 'Chef Palani',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
        bio: 'Crafting culinary experiences 🍳🔥',
        category: 'Food',
        isVerified: true,
        badges: ['Verified'],
      },
    ];

    const users: any[] = [];
    for (const u of demoUsersData) {
      let user = await User.findOne({ username: u.username });
      if (!user) {
        user = await User.create(u);
      }
      users.push(user);
    }

    const [elena, marcus, sam, palani] = users;

    // 2. Create rich demo posts
    const demoPosts = [
      {
        author: elena._id,
        media: [
          {
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            type: 'IMAGE',
            aspectRatio: '4:5',
          },
        ],
        type: 'IMAGE',
        caption: 'Golden hour reflections by the coastline. Nothing beats nature’s palette ✨ ocean #nature #photography #boundup',
        hashtags: ['ocean', 'nature', 'photography', 'boundup'],
        location: 'Maldives Island',
        likesCount: 1420,
        commentsCount: 84,
        visibility: 'PUBLIC',
      },
      {
        author: sam._id,
        media: [
          {
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            type: 'VIDEO',
            aspectRatio: '9:16',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
          },
        ],
        type: 'VIDEO',
        caption: 'Cinematic reel snippet 🔥 Exploring vertical motion design and color grading! #reels #motion #cinematic',
        hashtags: ['reels', 'motion', 'cinematic'],
        location: 'Tokyo Neon Street',
        likesCount: 2890,
        commentsCount: 156,
        visibility: 'PUBLIC',
      },
      {
        author: marcus._id,
        media: [],
        type: 'TEXT',
        caption: 'Which theme accent feels most comfortable for long coding sessions? Vote in the poll below! 🚀',
        hashtags: ['tech', 'design', 'poll'],
        likesCount: 540,
        commentsCount: 32,
        visibility: 'PUBLIC',
        poll: {
          question: 'Best Accent Theme Color?',
          options: [
            { text: 'Warm Orange 🔥', votes: [elena._id, marcus._id] },
            { text: 'Cyber Purple 💜', votes: [sam._id] },
            { text: 'Emerald Green 💚', votes: [] },
            { text: 'Neon Blue 💙', votes: [] },
          ],
        },
      },
      {
        author: palani._id,
        media: [
          {
            url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
            type: 'IMAGE',
            aspectRatio: '1:1',
          },
        ],
        type: 'IMAGE',
        caption: 'Fresh wood-fired sourdough pizza served piping hot! 🍕 Flavor overload. #foodie #cooking #artisan',
        hashtags: ['foodie', 'cooking', 'artisan'],
        location: 'Florence, Italy',
        likesCount: 920,
        commentsCount: 45,
        visibility: 'PUBLIC',
      },
      {
        author: elena._id,
        media: [
          {
            url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
            type: 'IMAGE',
            aspectRatio: '16:9',
          },
        ],
        type: 'IMAGE',
        caption: 'Stargazing at 3,000 meters altitude 🌌 The universe is vast and beautiful. #astronomy #nightscape #mountains',
        hashtags: ['astronomy', 'nightscape', 'mountains'],
        location: 'Swiss Alps',
        likesCount: 3100,
        commentsCount: 210,
        visibility: 'PUBLIC',
      },
    ];

    await Post.insertMany(demoPosts);

    // 3. Create active 24h stories
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const demoStories = [
      {
        author: elena._id,
        mediaUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
        mediaType: 'IMAGE',
        caption: 'Sunrise hike starting now! ⛰️',
        viewsCount: 420,
        expiresAt,
      },
      {
        author: sam._id,
        mediaUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
        mediaType: 'IMAGE',
        caption: 'Late night render sessions 💻🎨',
        viewsCount: 215,
        expiresAt,
      },
      {
        author: marcus._id,
        mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
        mediaType: 'IMAGE',
        caption: 'New monorepo feature live! 🚀',
        viewsCount: 680,
        expiresAt,
      },
      {
        author: palani._id,
        mediaUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
        mediaType: 'IMAGE',
        caption: 'Plating special dish for tonight! 🍽️',
        viewsCount: 190,
        expiresAt,
      },
    ];

    await Story.insertMany(demoStories);
    console.log('[SEED] Demo data seeded successfully!');
  } catch (err) {
    console.error('[SEED] Error seeding demo data:', err);
  }
};
