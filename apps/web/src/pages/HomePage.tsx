import React, { useState, useEffect } from 'react';
import { StoriesRow } from '../components/feed/StoriesRow';
import { PostCard } from '../components/feed/PostCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Compass, Sparkles, Users, Clock, Mic, Radio, Hash, Flame } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IPost } from '@boundup/shared';
import { useNavigate, NavLink } from 'react-router-dom';

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
      {/* STORIES ROW */}
      <StoriesRow storyGroups={storyGroups} onRefresh={fetchFeed} />

      {/* LIVE AUDIO HUDDLE BANNER */}
      <div className="my-3 p-3 bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900 border border-purple-500/30 rounded-20px shadow-lg text-white flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/20 backdrop-blur-md rounded-14px border border-purple-400/40">
            <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.2 rounded-full bg-red-500 text-[9px] font-extrabold uppercase tracking-wider">LIVE</span>
              <span className="text-xs font-extrabold text-purple-200">Creators Audio Room</span>
            </div>
            <p className="text-[11px] text-gray-200 font-semibold truncate max-w-[200px] sm:max-w-[260px]">
              Discussing Cinematic Design & Mobile Web Apps 🎙️
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Joining Live Audio Room... Mic enabled!')}
          className="px-3 py-1.5 bg-gradient-to-r from-brand-primary to-orange-500 text-white rounded-14px text-xs font-extrabold shadow-sm hover:opacity-90 transition-all flex items-center gap-1"
        >
          Join
        </button>
      </div>

      {/* SMART FEED MODE SWITCHER */}
      <div className="flex items-center justify-between my-2 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-20px p-1.5 shadow-soft">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setFeedMode('forYou')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-14px text-xs font-extrabold transition-all ${
              feedMode === 'forYou'
                ? 'bg-gradient-to-r from-brand-primary to-orange-500 text-white shadow-md'
                : 'text-brand-muted dark:text-slate-400 hover:text-brand-text dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>For You</span>
          </button>

          <button
            onClick={() => setFeedMode('following')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-14px text-xs font-extrabold transition-all ${
              feedMode === 'following'
                ? 'bg-gradient-to-r from-brand-primary to-orange-500 text-white shadow-md'
                : 'text-brand-muted dark:text-slate-400 hover:text-brand-text dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setFeedMode('latest')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-14px text-xs font-extrabold transition-all ${
              feedMode === 'latest'
                ? 'bg-gradient-to-r from-brand-primary to-orange-500 text-white shadow-md'
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
            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 whitespace-nowrap transition-all ${
              activeTag === t
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-white dark:bg-slate-800/80 text-brand-muted dark:text-slate-300 border border-brand-border dark:border-slate-700/70 hover:border-brand-primary'
            }`}
          >
            {t !== 'All' && <Hash className="w-3 h-3 text-brand-primary" />}
            <span>{t === 'All' ? '🔥 All Trends' : t}</span>
          </button>
        ))}
      </div>

      {/* QUICK VOICE POST BANNER */}
      {onCreateClick && (
        <div className="mb-4 p-3.5 bg-gradient-to-r from-brand-primary/15 via-purple-500/10 to-amber-500/5 dark:from-slate-900 dark:to-slate-800 border border-brand-primary/30 dark:border-slate-700 rounded-20px flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-brand-primary to-orange-600 text-white rounded-14px shadow-md">
              <Mic className="w-4 h-4" />
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
            className="px-3.5 py-1.5 bg-brand-primary text-white rounded-14px text-xs font-extrabold shadow-sm hover:opacity-90 transition-opacity"
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
