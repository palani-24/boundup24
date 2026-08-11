import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostCard } from '../components/feed/PostCard';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { apiFetch } from '../services/api';
import { IPost } from '@boundup/shared';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch(`/posts/${id}`);
        if (res.success) {
          setPost(res.data.post);
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-3 select-none">
      {isLoading ? (
        <Skeleton className="w-full h-[500px]" />
      ) : post ? (
        <PostCard post={post} />
      ) : (
        <EmptyState
          title="Post not found"
          description="This post may have been removed."
          actionText="Back to Feed"
          onAction={() => navigate('/home')}
        />
      )}
    </div>
  );
};
