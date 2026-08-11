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

  return (
    <div className="w-full flex flex-col items-center py-4 px-2 select-none min-h-screen">
      {isLoading ? (
        <div className="w-full max-w-sm h-[80vh] bg-neutral-900 rounded-24px animate-pulse my-4" />
      ) : reels.length > 0 ? (
        <div className="flex flex-col gap-6 items-center">
          {reels.map((reel) => (
            <ReelPlayer key={reel.id || (reel as any)._id} post={reel} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Film className="w-8 h-8" />}
          title="No Reels available yet"
          description="Create short video posts to feature in the Reels feed!"
        />
      )}
    </div>
  );
};
