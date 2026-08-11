import React, { useState, useEffect } from 'react';
import { StoriesRow } from '../components/feed/StoriesRow';
import { PostCard } from '../components/feed/PostCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Compass, PlusSquare } from 'lucide-react';
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
  const navigate = useNavigate();

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const [feedRes, storiesRes] = await Promise.all([
        apiFetch('/posts/feed'),
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
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col py-4 px-2 select-none">
      {/* STORIES ROW */}
      <StoriesRow storyGroups={storyGroups} onRefresh={fetchFeed} />

      {/* FEED POSTS */}
      {isLoading ? (
        <div className="flex flex-col gap-4 my-4">
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
