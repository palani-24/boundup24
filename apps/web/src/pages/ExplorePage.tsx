import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/explore/SearchBar';
import { MasonryGrid } from '../components/explore/MasonryGrid';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Hash, Sparkles } from 'lucide-react';
import { apiFetch } from '../services/api';
import { IPost } from '@boundup/shared';
import { NavLink } from 'react-router-dom';

export const ExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExplore = async (category = 'All') => {
    setIsLoading(true);
    try {
      const [gridRes, hashRes] = await Promise.all([
        apiFetch(`/explore?category=${encodeURIComponent(category)}`),
        apiFetch('/hashtags/trending'),
      ]);

      if (gridRes.success) setPosts(gridRes.data.posts);
      if (hashRes.success) setTrendingHashtags(hashRes.data.hashtags);
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExplore();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col py-4 px-3 select-none">
      <SearchBar onSelectCategory={(cat) => fetchExplore(cat)} />

      {/* TRENDING HASHTAGS ROW */}
      {trendingHashtags.length > 0 && (
        <div className="my-4 bg-white border border-brand-border rounded-24px p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-3 text-brand-text font-heading font-extrabold text-sm">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span>Trending Hashtags</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {trendingHashtags.map((h) => (
              <NavLink
                key={h._id || h.name}
                to={`/hashtag/${h.name}`}
                className="flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-brand-primary hover:text-white transition-colors"
              >
                <Hash className="w-3.5 h-3.5" />
                <span>{h.name}</span>
                <span className="text-[10px] opacity-80">({h.postCount})</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* MASONRY MEDIA GRID */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 my-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-80" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-80" />
        </div>
      ) : posts.length > 0 ? (
        <MasonryGrid posts={posts} />
      ) : (
        <EmptyState
          icon={<Sparkles className="w-8 h-8" />}
          title="No explore content yet"
          description="Be the first to publish posts and explore trends on BOUNDUP!"
        />
      )}
    </div>
  );
};
