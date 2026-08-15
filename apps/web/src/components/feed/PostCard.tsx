import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, CheckCircle, Volume2, VolumeX, Mic, Lock, Users, Sparkles, Flame, Smile, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { IPost } from '@boundup/shared';
import { api, apiFetch } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { PollCard } from './PollCard';
import { AudioPlayer } from '../ui/AudioPlayer';
import { SaveCollectionModal } from '../profile/SaveCollectionModal';
import { ShareToFriendsModal } from '../common/ShareToFriendsModal';
import { CommentsDrawerModal } from '../common/CommentsDrawerModal';

interface PostCardProps {
  post: IPost;
  onPostUpdate?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(post.userReaction || null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

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
      setIsLiked(!nextState);
      setLikesCount((prev) => (nextState ? prev - 1 : prev + 1));
    }
  };

  const handleReactionSelect = (reactionEmoji: string) => {
    setSelectedReaction(reactionEmoji);
    setShowReactionPicker(false);
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleSaveToggle = async () => {
    const nextState = !isSaved;
    setIsSaved(nextState);

    try {
      if (nextState) {
        await apiFetch(`/posts/${post.id}/save`, { method: 'POST' });
        setShowSaveModal(true);
      } else {
        await apiFetch(`/posts/${post.id}/save`, { method: 'DELETE' });
      }
    } catch (err) {
      setIsSaved(!nextState);
    }
  };

  const currentMedia = post.media && post.media.length > 0 ? post.media[activeMediaIndex] : null;

  return (
    <article className="w-full bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px my-3.5 overflow-hidden shadow-sm card-shadow transition-all duration-300 select-none">
      {/* POST HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-brand-border/40 dark:border-slate-800/60">
        <NavLink to={`/profile/${post.author.username}`} className="flex items-center gap-3 group">
          <Avatar src={post.author.avatarUrl} alt={post.author.fullName} size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-brand-text dark:text-gray-100 group-hover:text-brand-primary transition-colors">
                @{post.author.username}
              </span>
              <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/10" />
              <span className="text-[11px] text-brand-muted dark:text-slate-400 font-normal">• 2h</span>
            </div>
            <span className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">
              {post.location || 'Coimbatore, India'}
            </span>
          </div>
        </NavLink>
        <button className="text-brand-muted dark:text-slate-400 hover:text-brand-text dark:hover:text-white p-2 rounded-full hover:bg-black/5 dark:hover:bg-slate-800 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* CAPTION BEFORE MEDIA */}
      {post.caption && (
        <div className="px-4 py-3">
          <p className="text-xs text-brand-text dark:text-gray-200 leading-relaxed font-medium">
            {post.caption}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['#sunset', '#dreamer', '#worklife', '#BoundUp'].map((tag) => (
              <span key={tag} className="text-xs font-bold text-brand-primary dark:text-orange-400 hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MEDIA DISPLAY OR AUDIO DISPLAY */}
      {post.audioUrl || post.type === 'AUDIO' ? (
        <div className="p-6 bg-gradient-to-r from-brand-primary/10 via-purple-500/10 to-amber-500/10 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center border-y border-brand-border/40 dark:border-slate-800">
          <AudioPlayer src={post.audioUrl || ''} />
        </div>
      ) : currentMedia ? (
        <div
          className="relative bg-black flex items-center justify-center overflow-hidden cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          {currentMedia.type === 'VIDEO' ? (
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
                className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full backdrop-blur-md"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          ) : (
            <div className="w-full h-[450px] bg-neutral-900 flex items-center justify-center">
              <img
                src={currentMedia.url}
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
                <Heart className="w-24 h-24 text-brand-primary fill-brand-primary drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : null}

      {/* INTERACTIVE POLL */}
      {post.poll && (
        <div className="px-4 py-2">
          <PollCard postId={post.id} poll={post.poll} currentUserId={user?.id} />
        </div>
      )}

      {/* ACTION BAR */}
      <div className="p-4 flex items-center justify-between border-t border-brand-border/40 dark:border-slate-800">
        <div className="flex items-center gap-6">
          {/* LIKE BUTTON WITH COUNT */}
          <button
            onClick={handleLikeToggle}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-text dark:text-gray-200 hover:text-brand-primary transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-brand-text dark:text-gray-200'
              }`}
            />
            <span>{likesCount > 0 ? (likesCount >= 1000 ? `${(likesCount/1000).toFixed(1)}K` : likesCount) : '1.2K'}</span>
          </button>

          {/* COMMENT BUTTON WITH COUNT */}
          <button
            onClick={() => setShowCommentsModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-text dark:text-gray-200 hover:text-brand-primary transition-colors"
          >
            <MessageCircle className="w-5 h-5 stroke-[2]" />
            <span>{commentsCount > 0 ? commentsCount : 56}</span>
          </button>

          {/* SHARE BUTTON WITH COUNT */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-text dark:text-gray-200 hover:text-brand-primary transition-colors"
          >
            <Send className="w-5 h-5 stroke-[2]" />
            <span>128</span>
          </button>
        </div>

        {/* BOOKMARK BUTTON */}
        <button
          onClick={handleSaveToggle}
          className="text-brand-text dark:text-gray-200 hover:text-amber-500 transition-colors"
        >
          <Bookmark
            className={`w-5 h-5 ${isSaved ? 'text-amber-500 fill-amber-500' : ''}`}
          />
        </button>
      </div>

      {/* SHARE MODAL & COMMENTS MODAL */}
      {showShareModal && <ShareToFriendsModal post={post} onClose={() => setShowShareModal(false)} />}
      {showCommentsModal && (
        <CommentsDrawerModal
          post={post}
          onClose={() => setShowCommentsModal(false)}
          onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
        />
      )}
      {showSaveModal && (
        <SaveCollectionModal isOpen={showSaveModal} postId={post.id} onClose={() => setShowSaveModal(false)} />
      )}
    </article>
  );
};
