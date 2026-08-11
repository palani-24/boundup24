import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { IPost } from '@boundup/shared';
import { apiFetch } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

interface PostCardProps {
  post: IPost;
  onPostUpdate?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Double tap to like handler
  const handleDoubleTap = () => {
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 800);
    if (!isLiked) {
      handleLikeToggle();
    }
  };

  const handleLikeToggle = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : prev - 1));

    try {
      if (nextState) {
        await apiFetch(`/posts/${post.id}/like`, { method: 'POST' });
      } else {
        await apiFetch(`/posts/${post.id}/like`, { method: 'DELETE' });
      }
    } catch (err) {
      // Revert optimistic update on failure
      setIsLiked(!nextState);
      setLikesCount((prev) => (nextState ? prev - 1 : prev + 1));
    }
  };

  const handleSaveToggle = async () => {
    const nextState = !isSaved;
    setIsSaved(nextState);

    try {
      if (nextState) {
        await apiFetch(`/posts/${post.id}/save`, { method: 'POST' });
      } else {
        await apiFetch(`/posts/${post.id}/save`, { method: 'DELETE' });
      }
    } catch (err) {
      setIsSaved(!nextState);
    }
  };

  const loadComments = async () => {
    setShowComments(true);
    try {
      const res = await apiFetch(`/posts/${post.id}/comments`);
      if (res.success) {
        setComments(res.data.comments);
      }
    } catch (err) {}
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const res = await apiFetch(`/posts/${post.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: commentInput }),
      });
      if (res.success) {
        setComments([res.data.comment, ...comments]);
        setCommentInput('');
        if (onPostUpdate) onPostUpdate();
      }
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const currentMedia = post.media[activeMediaIndex] || post.media[0];

  return (
    <article className="w-full bg-white border border-brand-border rounded-24px my-4 overflow-hidden shadow-soft transition-all duration-300 hover:shadow-ambient select-none">
      {/* POST HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-brand-border/40">
        <NavLink to={`/profile/${post.author.username}`} className="flex items-center gap-3 group">
          <Avatar src={post.author.avatarUrl} alt={post.author.fullName} size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-brand-text group-hover:text-brand-primary transition-colors">
                {post.author.username}
              </span>
              {post.author.isVerified && <CheckCircle className="w-4 h-4 text-brand-primary fill-brand-primary/10" />}
            </div>
            {post.location && <span className="text-[11px] text-brand-muted">{post.location}</span>}
          </div>
        </NavLink>
        <button className="text-brand-muted hover:text-brand-text p-2 rounded-full hover:bg-black/5 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* MEDIA DISPLAY */}
      <div
        className="relative bg-black flex items-center justify-center overflow-hidden cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        {currentMedia?.type === 'VIDEO' ? (
          <div className="relative w-full h-[450px]">
            <video
              src={currentMedia.url}
              poster={currentMedia.thumbnailUrl}
              muted={isMuted}
              controls
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="w-full h-[450px] bg-neutral-900 flex items-center justify-center">
            <img
              src={currentMedia?.url}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Double-tap heart splash animation */}
        <AnimatePresence>
          {showHeartAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTION BAR */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeToggle}
              className="text-brand-text hover:opacity-80 transition-transform active:scale-125"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isLiked ? 'text-brand-primary fill-brand-primary' : 'text-brand-text'
                }`}
              />
            </button>

            <button
              onClick={loadComments}
              className="text-brand-text hover:opacity-80 transition-transform active:scale-110"
            >
              <MessageCircle className="w-6 h-6 stroke-[2]" />
            </button>

            <button className="text-brand-text hover:opacity-80 transition-transform active:scale-110">
              <Send className="w-6 h-6 stroke-[2]" />
            </button>
          </div>

          <button
            onClick={handleSaveToggle}
            className="text-brand-text hover:opacity-80 transition-transform active:scale-110"
          >
            <Bookmark
              className={`w-6 h-6 ${isSaved ? 'text-brand-primary fill-brand-primary' : 'text-brand-text'}`}
            />
          </button>
        </div>

        {/* LIKES COUNT */}
        {!post.isLikeCountHidden && (
          <div className="text-xs font-extrabold text-brand-text">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </div>
        )}

        {/* CAPTION & HASHTAGS */}
        {post.caption && (
          <p className="text-sm text-brand-text leading-relaxed">
            <NavLink to={`/profile/${post.author.username}`} className="font-bold mr-2 hover:underline">
              {post.author.username}
            </NavLink>
            {post.caption}
          </p>
        )}

        {/* HASHTAGS PILLS */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-1">
            {post.hashtags.map((tag) => (
              <NavLink
                key={tag}
                to={`/hashtag/${tag}`}
                className="text-xs font-semibold text-brand-primary hover:underline bg-brand-primary/10 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </NavLink>
            ))}
          </div>
        )}

        {/* COMMENTS PREVIEW */}
        <button
          onClick={loadComments}
          className="text-xs text-brand-muted font-medium hover:text-brand-text text-left mt-1"
        >
          {post.commentsCount > 0
            ? `View all ${post.commentsCount} comments`
            : 'Add a comment...'}
        </button>
      </div>

      {/* COMMENTS MODAL / DRAWER */}
      {showComments && (
        <div className="p-4 border-t border-brand-border bg-gray-50/50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-xs text-brand-text uppercase tracking-wider font-heading">Comments</h4>
            <button onClick={() => setShowComments(false)} className="text-xs font-semibold text-brand-muted hover:text-brand-text">
              Close
            </button>
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 h-9 bg-white border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary"
            />
            <button
              type="submit"
              disabled={!commentInput.trim() || isSubmittingComment}
              className="h-9 px-4 bg-brand-primary text-white text-xs font-bold rounded-12px hover:bg-brand-accent transition-colors disabled:opacity-50"
            >
              Post
            </button>
          </form>

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c._id || c.id} className="flex items-start gap-2.5 text-xs">
                <Avatar src={c.author.avatarUrl} alt={c.author.fullName} size="sm" />
                <div className="flex flex-col bg-white p-2.5 rounded-12px border border-brand-border/40 w-full">
                  <span className="font-bold text-brand-text">{c.author.username}</span>
                  <p className="text-brand-text mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
