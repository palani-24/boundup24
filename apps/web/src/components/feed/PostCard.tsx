import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, CheckCircle, Volume2, VolumeX, Mic, Lock, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { IPost } from '@boundup/shared';
import { api, apiFetch } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { PollCard } from './PollCard';
import { AudioPlayer } from '../ui/AudioPlayer';
import { VoiceRecorderModal } from '../ui/VoiceRecorderModal';
import { SaveCollectionModal } from '../profile/SaveCollectionModal';

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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

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

  const handleVoiceCommentRecorded = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('media', file);
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const audioUrl = uploadRes.data?.url;
      if (audioUrl) {
        const commentRes = await apiFetch(`/posts/${post.id}/comments`, {
          method: 'POST',
          body: JSON.stringify({ content: '', audioUrl }),
        });
        if (commentRes.success) {
          setComments([commentRes.data.comment, ...comments]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentMedia = post.media && post.media.length > 0 ? post.media[activeMediaIndex] : null;

  return (
    <article className="w-full bg-white dark:bg-slate-800 border border-brand-border dark:border-slate-700/80 rounded-24px my-4 overflow-hidden shadow-soft transition-all duration-300 hover:shadow-ambient select-none">
      {/* POST HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-brand-border/40 dark:border-slate-700/50">
        <NavLink to={`/profile/${post.author.username}`} className="flex items-center gap-3 group">
          <Avatar src={post.author.avatarUrl} alt={post.author.fullName} size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-brand-text dark:text-gray-100 group-hover:text-brand-primary transition-colors">
                {post.author.username}
              </span>
              {post.author.isVerified && <CheckCircle className="w-4 h-4 text-brand-primary fill-brand-primary/10" />}
              {post.visibility === 'CLOSE_FRIENDS' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Close Friends
                </span>
              )}
            </div>
            {post.location && <span className="text-[11px] text-brand-muted dark:text-slate-400">{post.location}</span>}
          </div>
        </NavLink>
        <button className="text-brand-muted dark:text-slate-400 hover:text-brand-text p-2 rounded-full hover:bg-black/5 dark:hover:bg-slate-700 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* MEDIA DISPLAY OR AUDIO DISPLAY */}
      {post.audioUrl || post.type === 'AUDIO' ? (
        <div className="p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
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
                className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full backdrop-blur-sm"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
                <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : null}

      {/* INTERACTIVE POLL */}
      {post.poll && (
        <div className="px-4">
          <PollCard postId={post.id} poll={post.poll} currentUserId={user?.id} />
        </div>
      )}

      {/* ACTION BAR */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeToggle}
              className="text-brand-text dark:text-gray-200 hover:opacity-80 transition-transform active:scale-125"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isLiked ? 'text-brand-primary fill-brand-primary' : 'text-brand-text dark:text-gray-200'
                }`}
              />
            </button>

            <button
              onClick={loadComments}
              className="text-brand-text dark:text-gray-200 hover:opacity-80 transition-transform active:scale-110"
            >
              <MessageCircle className="w-6 h-6 stroke-[2]" />
            </button>

            <button className="text-brand-text dark:text-gray-200 hover:opacity-80 transition-transform active:scale-110">
              <Send className="w-6 h-6 stroke-[2]" />
            </button>
          </div>

          <button
            onClick={handleSaveToggle}
            className="text-brand-text dark:text-gray-200 hover:opacity-80 transition-transform active:scale-110"
          >
            <Bookmark
              className={`w-6 h-6 ${isSaved ? 'text-brand-primary fill-brand-primary' : 'text-brand-text dark:text-gray-200'}`}
            />
          </button>
        </div>

        {/* LIKES COUNT */}
        {!post.isLikeCountHidden && (
          <div className="text-xs font-extrabold text-brand-text dark:text-gray-200">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </div>
        )}

        {/* CAPTION & HASHTAGS */}
        {post.caption && (
          <p className="text-sm text-brand-text dark:text-gray-200 leading-relaxed">
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
          className="text-xs text-brand-muted dark:text-slate-400 font-medium hover:text-brand-text dark:hover:text-gray-200 text-left mt-1"
        >
          {post.commentsCount > 0
            ? `View all ${post.commentsCount} comments`
            : 'Add a comment...'}
        </button>
      </div>

      {/* COMMENTS MODAL / DRAWER */}
      {showComments && (
        <div className="p-4 border-t border-brand-border dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-xs text-brand-text dark:text-gray-200 uppercase tracking-wider font-heading">Comments</h4>
            <button onClick={() => setShowComments(false)} className="text-xs font-semibold text-brand-muted dark:text-slate-400 hover:text-brand-text">
              Close
            </button>
          </div>

          <form onSubmit={handleAddComment} className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 h-9 bg-white dark:bg-slate-800 border border-brand-border dark:border-slate-700 rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary dark:text-gray-100"
            />
            
            <button
              type="button"
              onClick={() => setShowVoiceRecorder(true)}
              className="h-9 w-9 bg-gray-100 dark:bg-slate-700 text-orange-500 rounded-12px flex items-center justify-center hover:bg-orange-100 transition-colors"
              title="Record Voice Comment"
            >
              <Mic className="w-4 h-4" />
            </button>

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
                <div className="flex flex-col bg-white dark:bg-slate-800 p-2.5 rounded-12px border border-brand-border/40 dark:border-slate-700 w-full">
                  <span className="font-bold text-brand-text dark:text-gray-200">{c.author.username}</span>
                  {c.audioUrl ? (
                    <div className="mt-1">
                      <AudioPlayer src={c.audioUrl} />
                    </div>
                  ) : (
                    <p className="text-brand-text dark:text-gray-300 mt-0.5">{c.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Collection Modal */}
      <SaveCollectionModal
        isOpen={showSaveModal}
        postId={post.id}
        onClose={() => setShowSaveModal(false)}
      />

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
        onAudioRecorded={handleVoiceCommentRecorded}
      />
    </article>
  );
};

