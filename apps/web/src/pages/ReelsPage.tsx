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

  const fallbackReels: IPost[] = ([
    {
      id: 'demo-reel-1',
      author: {
        id: 'u1',
        username: 'cyber_sam',
        email: 'sam@boundup.com',
        fullName: 'Samantha Cyber',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
        isVerified: true,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
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
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        isVerified: true,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
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
    {
      id: 'demo-reel-3',
      author: {
        id: 'u3',
        username: 'fit.marco',
        email: 'marco@boundup.com',
        fullName: 'Marco Fit',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        isVerified: false,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Morning calisthenics routine! 🔥 Keep pushing boundaries! #fitness #workout',
      hashtags: ['fitness', 'workout'],
      location: 'Venice Beach, CA',
      likesCount: 2890,
      commentsCount: 142,
      sharesCount: 45,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-reel-4',
      author: {
        id: 'u4',
        username: 'chef_dilara',
        email: 'dilara@boundup.com',
        fullName: 'Dilara Gourmet',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        isVerified: true,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Mastering Italian handmade pasta 🍝 Secret is in the dough! #foodie #chef',
      hashtags: ['foodie', 'chef'],
      location: 'Rome, Italy',
      likesCount: 6420,
      commentsCount: 480,
      sharesCount: 210,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-reel-5',
      author: {
        id: 'u5',
        username: 'tech_karthik',
        email: 'karthik@boundup.com',
        fullName: 'Karthik Tech',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
        isVerified: true,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Building BoundUp social app live coding setup 💻🔥 #coding #developer #pwa',
      hashtags: ['coding', 'developer', 'pwa'],
      location: 'Bengaluru, India',
      likesCount: 8930,
      commentsCount: 740,
      sharesCount: 390,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-reel-6',
      author: {
        id: 'u6',
        username: 'sound_beatmaster',
        email: 'beats@boundup.com',
        fullName: 'BeatMaster Studio',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300',
        isVerified: true,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Synthesizer bassline creation in the studio 🎧🔊 Turn up volume! #beats #music',
      hashtags: ['beats', 'music'],
      location: 'Berlin, Germany',
      likesCount: 4210,
      commentsCount: 290,
      sharesCount: 95,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-reel-7',
      author: {
        id: 'u7',
        username: 'wanderlust_claire',
        email: 'claire@boundup.com',
        fullName: 'Claire Travel',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
        isVerified: false,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Sunset drive through the Swiss Alps mountains 🏔️🌅 #travel #alps #adventure',
      hashtags: ['travel', 'alps', 'adventure'],
      location: 'Swiss Alps',
      likesCount: 7340,
      commentsCount: 512,
      sharesCount: 230,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-reel-8',
      author: {
        id: 'u8',
        username: 'fashion_vibe',
        email: 'fashion@boundup.com',
        fullName: 'Vibe Fashion',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
        isVerified: true,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Autumn streetwear collection showcase 🍁✨ Which look is your favorite? #fashion #style',
      hashtags: ['fashion', 'style'],
      location: 'Paris, France',
      likesCount: 9120,
      commentsCount: 610,
      sharesCount: 410,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-reel-9',
      author: {
        id: 'u9',
        username: 'astronomy_now',
        email: 'astro@boundup.com',
        fullName: 'Cosmos Explorer',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        isVerified: true,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Stargazing at 4,000 meters in Atacama Desert ✨🌌 Milky Way timelapse! #space #stars',
      hashtags: ['space', 'stars'],
      location: 'Atacama Desert, Chile',
      likesCount: 11200,
      commentsCount: 890,
      sharesCount: 610,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-reel-10',
      author: {
        id: 'u10',
        username: 'boundup_official',
        email: 'official@boundup.com',
        fullName: 'BoundUp Official',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        isVerified: true,
      } as any,
      media: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
          type: 'VIDEO' as any,
          aspectRatio: '9:16' as any,
          thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
        },
      ],
      type: 'VIDEO' as any,
      caption: 'Welcome to BoundUp — Feel People Live! 🚀 Connect, share stories, and explore reels! #boundup #community',
      hashtags: ['boundup', 'community'],
      location: 'Worldwide 🌍',
      likesCount: 15400,
      commentsCount: 1200,
      sharesCount: 840,
      isCommentsDisabled: false,
      isLikeCountHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as any[]);

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
