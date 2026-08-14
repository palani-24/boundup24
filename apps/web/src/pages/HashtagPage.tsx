import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Hash, Sparkles, UserPlus, Check, Trophy, Tag } from 'lucide-react';
import { MasonryGrid } from '../components/explore/MasonryGrid';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Avatar } from '../components/ui/Avatar';
import { apiFetch } from '../services/api';
import { IPost } from '@boundup/shared';

export const HashtagPage: React.FC = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [hashtagInfo, setHashtagInfo] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const topCreators = [
    { username: 'palani', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', postsCount: 18 },
    { username: 'alex_dev', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', postsCount: 12 },
    { username: 'sarah_m', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', postsCount: 9 },
  ];

  const relatedTags = ['webdev', 'techtrends', 'coding', 'reactjs', 'design'];

  useEffect(() => {
    const fetchHashtag = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch(`/hashtags/${tag}`);
        if (res.success) {
          setHashtagInfo(res.data.hashtag);
          setPosts(res.data.posts);
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };
    if (tag) fetchHashtag();
  }, [tag]);

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-3 select-none">
      {/* HASHTAG HEADER BANNER */}
      <div className="bg-white border border-brand-border rounded-24px p-6 shadow-soft mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-20px bg-gradient-to-br from-brand-primary/20 via-purple-500/10 to-brand-primary/5 text-brand-primary flex items-center justify-center border border-brand-primary/20 shadow-sm">
            <Hash className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold font-heading text-brand-text">#{tag}</h1>
              <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-extrabold">Trending Topic</span>
            </div>
            <span className="text-xs font-semibold text-brand-muted mt-0.5">
              {hashtagInfo?.postCount || posts.length || 24} public posts
            </span>
          </div>
        </div>

        {/* FOLLOW HASHTAG BUTTON */}
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-16px text-xs font-extrabold transition-all shadow-sm ${
            isFollowing
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
              : 'bg-brand-primary text-white hover:opacity-90'
          }`}
        >
          {isFollowing ? (
            <>
              <Check className="w-4 h-4" /> Following #{tag}
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Follow #{tag}
            </>
          )}
        </button>
      </div>

      {/* TOP CONTRIBUTORS & RELATED TAGS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* LEADERBOARD */}
        <div className="md:col-span-2 bg-brand-surface border border-brand-border rounded-20px p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-xs font-extrabold text-brand-text">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top Contributors for #{tag}</span>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            {topCreators.map((creator) => (
              <NavLink
                key={creator.username}
                to={`/profile/${creator.username}`}
                className="flex items-center gap-2.5 p-2 rounded-16px bg-brand-bg/60 border border-brand-border/60 hover:border-brand-primary/40 transition-colors flex-shrink-0"
              >
                <Avatar src={creator.avatarUrl} alt={creator.username} size="sm" />
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-brand-text">@{creator.username}</span>
                  <span className="text-[10px] text-brand-muted">{creator.postsCount} posts</span>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* RELATED HASHTAGS */}
        <div className="bg-brand-surface border border-brand-border rounded-20px p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-xs font-extrabold text-brand-text">
            <Tag className="w-4 h-4 text-brand-primary" />
            <span>Related Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {relatedTags.map((rt) => (
              <NavLink
                key={rt}
                to={`/hashtag/${rt}`}
                className="px-2.5 py-1 rounded-lg bg-brand-bg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 border border-brand-border text-[11px] font-bold transition-all"
              >
                #{rt}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : posts.length > 0 ? (
        <MasonryGrid posts={posts} />
      ) : (
        <EmptyState
          icon={<Sparkles className="w-8 h-8" />}
          title={`No posts tagged with #${tag}`}
          description="Be the first to share a post using this hashtag!"
        />
      )}
    </div>
  );
};
