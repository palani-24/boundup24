import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Hash, Sparkles } from 'lucide-react';
import { MasonryGrid } from '../components/explore/MasonryGrid';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { apiFetch } from '../services/api';
import { IPost } from '@boundup/shared';

export const HashtagPage: React.FC = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [hashtagInfo, setHashtagInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="bg-white border border-brand-border rounded-24px p-6 shadow-soft mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
          <Hash className="w-8 h-8 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold font-heading text-brand-text">#{tag}</h1>
          <span className="text-xs font-semibold text-brand-muted">
            {hashtagInfo?.postCount || posts.length} posts
          </span>
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
