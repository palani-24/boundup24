import React, { useState, useEffect } from 'react';
import { StoriesRow } from '../components/feed/StoriesRow';
import { PostCard } from '../components/feed/PostCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Compass, Sparkles, Users, Clock, Mic } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IPost } from '@boundup/shared';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onCreateClick?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCreateClick }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [storyGroups, setStoryGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedMode, setFeedMode] = useState<'forYou' | 'following' | 'latest'>('forYou');
  const navigate = useNavigate();

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const [feedRes, storiesRes] = await Promise.all([
        apiFetch(`/posts/feed?mode=${feedMode}`),
        apiFetch('/stories'),
      ]);

      if (feedRes.success) setPosts(feedRes.data.posts);
      if (storiesRes.success) setStoryGroups(storiesRes.data.storyGroups);
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [feedMode]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col py-4 px-2 select-none">
      {/* STORIES ROW */}
      <StoriesRow storyGroups={storyGroups} onRefresh={fetchFeed} />

      {/* SMART FEED MODE SWITCHER */}
      <div className="flex items-center justify-between my-3 bg-brand-surface border border-brand-border rounded-20px p-1.5 shadow-sm">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setFeedMode('forYou')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-14px text-xs font-extrabold transition-all ${
              feedMode === 'forYou'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>For You</span>
          </button>

          <button
            onClick={() => setFeedMode('following')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-14px text-xs font-extrabold transition-all ${
              feedMode === 'following'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setFeedMode('latest')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-14px text-xs font-extrabold transition-all ${
              feedMode === 'latest'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest</span>
          </button>
        </div>
      </div>

      {/* QUICK VOICE POST BANNER */}
      {onCreateClick && (
        <div className="mb-4 p-3 bg-gradient-to-r from-brand-primary/10 via-purple-500/5 to-transparent border border-brand-primary/20 rounded-20px flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-primary text-white rounded-12px shadow-sm">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-brand-text">Share a Voice Post</p>
              <p className="text-[10px] text-brand-muted">Record a quick 30s audio snippet for your followers</p>
            </div>
          </div>
          <button
            onClick={onCreateClick}
            className="px-3 py-1.5 bg-brand-primary text-white rounded-12px text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            Record
          </button>
        </div>
      )}

      {/* FEED POSTS */}
      {isLoading ? (
        <div className="flex flex-col gap-4 my-2">
          <Skeleton className="w-full h-[500px]" />
          <Skeleton className="w-full h-[500px]" />
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.id || (post as any)._id} post={post} onPostUpdate={fetchFeed} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Compass className="w-8 h-8" />}
          title="Your feed is empty"
          description="Start creating posts or follow creators to see updates in your feed."
          actionText="Explore Content"
          onAction={() => navigate('/explore')}
        />
      )}
    </div>
  );
};
