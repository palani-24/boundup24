import React, { useState, useEffect } from 'react';
import { ReelPlayer } from '../components/reels/ReelPlayer';
import { EmptyState } from '../components/ui/EmptyState';
import { Film } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IPost } from '@boundup/shared';

export const ReelsPage: React.FC = () => {
  const [reels, setReels] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch('/explore?category=All');
        if (res.success) {
          // Filter video posts
          const videoPosts = res.data.posts.filter(
            (p: IPost) => p.media && p.media.some((m) => m.type === 'VIDEO')
          );
          setReels(videoPosts);
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchReels();
  }, []);

  const fallbackReels: IPost[] = [
    {
      id: 'demo-reel-1',
      author: {
        id: 'u1',
        username: 'cyber_sam',
        email: 'sam@boundup.com',
        fullName: 'Samantha Cyber',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
        isVerified: true,
        isPrivate: false,
        role: 'USER' as any,
        status: 'ACTIVE' as any,
        postsCount: 12,
        followersCount: 3400,
        followingCount: 280,
        createdAt: '',
        updatedAt: '',
      },
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Tokyo Cyberpunk vibes at night 🌌 Motion design & neon lights! #reels #tokyo #cyber',
      hashtags: ['reels', 'tokyo', 'cyber'],
      location: 'Shinjuku, Tokyo',
      likesCount: 3420,
      commentsCount: 189,
      sharesCount: 52,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-reel-2',
      author: {
        id: 'u2',
        username: 'elena_vance',
        email: 'elena@boundup.com',
        fullName: 'Elena Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        isVerified: true,
        isPrivate: false,
        role: 'USER' as any,
        status: 'ACTIVE' as any,
        postsCount: 45,
        followersCount: 12400,
        followingCount: 310,
        createdAt: '',
        updatedAt: '',
      },
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Surfing the morning swells in Bali 🏄‍♀️🌊 Pure freedom! #surfing #bali #ocean',
      hashtags: ['surfing', 'bali', 'ocean'],
      location: 'Uluwatu, Bali',
      likesCount: 5120,
      commentsCount: 310,
      sharesCount: 120,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayReels = reels.length > 0 ? reels : fallbackReels;

  return (
    <div className="w-full flex flex-col items-center py-4 px-2 select-none min-h-screen">
      {isLoading ? (
        <div className="w-full max-w-sm h-[80vh] bg-neutral-900 rounded-24px animate-pulse my-4" />
      ) : (
        <div className="flex flex-col gap-6 items-center">
          {displayReels.map((reel) => (
            <ReelPlayer key={reel.id || (reel as any)._id} post={reel} />
          ))}
        </div>
      )}
    </div>
  );
};
