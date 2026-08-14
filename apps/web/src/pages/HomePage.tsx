import React, { useState, useEffect } from 'react';
import { StoriesRow } from '../components/feed/StoriesRow';
import { PostCard } from '../components/feed/PostCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Compass, Sparkles, Users, Clock, Mic, Radio, Hash, Flame } from 'lucide-react';
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
  const [activeTag, setActiveTag] = useState<string>('All');

  const navigate = useNavigate();

  const trendingTags = ['All', 'reels', 'webdev', 'ai', 'travel', 'tech', 'design'];

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

  const filteredPosts = posts.filter((p) => {
    if (activeTag === 'All') return true;
    if (activeTag === 'reels') return p.type === 'VIDEO' || p.media[0]?.type === 'VIDEO';
    return p.hashtags?.includes(activeTag) || p.caption?.toLowerCase().includes(activeTag.toLowerCase());
  });

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col py-4 px-2 select-none">
      {/* STORIES ROW (INSTAGRAM GRADIENT RINGS) */}
      <StoriesRow storyGroups={storyGroups} onRefresh={fetchFeed} />

      {/* LIVE AUDIO HUDDLE BANNER (CLEAN THEME COMPATIBLE) */}
      <div className="my-3 p-3.5 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px shadow-sm card-shadow flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-16px border border-purple-500/20">
            <Radio className="w-5 h-5 animate-pulse text-purple-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-wider">
                LIVE
              </span>
              <span className="text-xs font-extrabold text-brand-text dark:text-gray-100">Creators Audio Room</span>
            </div>
            <p className="text-[11px] text-brand-muted dark:text-slate-400 font-semibold truncate max-w-[200px] sm:max-w-[260px]">
              Discussing Mobile Web Engineering & Design 🎙️
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Joining Live Audio Room... Mic connected!')}
          className="px-4 py-2 bg-brand-primary text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-90 transition-all active:scale-95"
        >
          Join
        </button>
      </div>

      {/* MINIMALIST FEED MODE SWITCHER TABS */}
      <div className="flex items-center justify-between my-2 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px p-1.5 shadow-sm card-shadow">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setFeedMode('forYou')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-16px text-xs font-extrabold transition-all ${
              feedMode === 'forYou'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-brand-muted dark:text-slate-400 hover:text-brand-text dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>For You</span>
          </button>

          <button
            onClick={() => setFeedMode('following')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-16px text-xs font-extrabold transition-all ${
              feedMode === 'following'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-brand-muted dark:text-slate-400 hover:text-brand-text dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setFeedMode('latest')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-16px text-xs font-extrabold transition-all ${
              feedMode === 'latest'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-brand-muted dark:text-slate-400 hover:text-brand-text dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest</span>
          </button>
        </div>
      </div>

      {/* TRENDING TOPICS PILLS FILTER BAR */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 mb-2">
        {trendingTags.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTag(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1 whitespace-nowrap transition-all ${
              activeTag === t
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-brand-muted dark:text-slate-400 border border-brand-border dark:border-slate-800 hover:border-brand-primary'
            }`}
          >
            {t !== 'All' && <Hash className="w-3 h-3 text-brand-primary" />}
            <span>{t === 'All' ? '🔥 All Trends' : t}</span>
          </button>
        ))}
      </div>

      {/* QUICK VOICE POST BANNER */}
      {onCreateClick && (
        <div className="mb-4 p-3.5 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px flex items-center justify-between shadow-sm card-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-16px border border-brand-primary/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-brand-text dark:text-gray-100">Share a Voice Post</p>
              <p className="text-[10px] text-brand-muted dark:text-slate-400 font-medium">
                Record a quick 30s audio snippet for your followers
              </p>
            </div>
          </div>
          <button
            onClick={onCreateClick}
            className="px-4 py-2 bg-brand-primary text-white rounded-16px text-xs font-extrabold shadow-sm hover:opacity-90 transition-opacity active:scale-95"
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
      ) : filteredPosts.length > 0 ? (
        <div className="flex flex-col">
          {filteredPosts.map((post) => (
            <PostCard key={post.id || (post as any)._id} post={post} onPostUpdate={fetchFeed} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Compass className="w-8 h-8" />}
          title="No posts found"
          description="Try selecting another trend category or create a new post!"
          actionText="Explore Content"
          onAction={() => navigate('/explore')}
        />
      )}
    </div>
  );
};
