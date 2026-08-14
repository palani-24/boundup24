import React, { useState, useEffect } from 'react';
import { X, Send, Heart, MessageCircle, Sparkles, Mic } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { apiFetch } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { IPost, IComment } from '@boundup/shared';

interface CommentsDrawerModalProps {
  post: IPost;
  onClose: () => void;
  onCommentAdded?: () => void;
}

export const CommentsDrawerModal: React.FC<CommentsDrawerModalProps> = ({
  post,
  onClose,
  onCommentAdded,
}) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<IComment[]>([
    {
      id: 'c1',
      postId: post.id,
      author: {
        id: 'u2',
        username: 'alex_dev',
        fullName: 'Alex Rivera',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      } as any,
      content: 'This editing and vertical motion looks incredible! 🔥',
      likesCount: 14,
      isLiked: false,
      repliesCount: 0,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'c2',
      postId: post.id,
      author: {
        id: 'u3',
        username: 'sarah_m',
        fullName: 'Sarah Miller',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      } as any,
      content: 'Amazing camera angles and lighting ✨ What camera did you use?',
      likesCount: 8,
      isLiked: true,
      repliesCount: 0,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await apiFetch(`/posts/${post.id}/comments`);
        if (res.success && res.data.comments?.length > 0) {
          setComments(res.data.comments);
        }
      } catch (_) {}
    };
    fetchComments();
  }, [post.id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const newCommentObj: IComment = {
      id: `comment_${Date.now()}`,
      postId: post.id,
      author: user || ({ username: 'you', fullName: 'You', avatarUrl: '' } as any),
      content: commentInput,
      likesCount: 0,
      isLiked: false,
      repliesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComments([newCommentObj, ...comments]);
    setCommentInput('');

    try {
      await apiFetch(`/posts/${post.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: commentInput }),
      });
      if (onCommentAdded) onCommentAdded();
    } catch (_) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
            }
          : c
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-t-24px sm:rounded-24px max-w-md w-full h-[75vh] sm:h-[650px] shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* HEADER */}
        <div className="p-4 border-b border-brand-border/60 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-brand-primary" />
            <h3 className="font-extrabold font-heading text-sm text-brand-text dark:text-gray-100">
              Comments ({comments.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-brand-muted hover:text-brand-text dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 text-xs">
              <Avatar src={c.author.avatarUrl} alt={c.author.fullName} size="sm" />
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-text dark:text-gray-100">@{c.author.username}</span>
                  <span className="text-[10px] text-brand-muted dark:text-slate-400">
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-brand-text dark:text-gray-200 leading-relaxed bg-brand-bg dark:bg-slate-800/60 p-2.5 rounded-16px border border-brand-border/40 dark:border-slate-700/60">
                  {c.content}
                </p>
                <div className="flex items-center gap-3 px-1 text-[11px] text-brand-muted dark:text-slate-400 font-semibold">
                  <button
                    onClick={() => handleToggleCommentLike(c.id)}
                    className={`flex items-center gap-1 hover:text-brand-primary ${c.isLiked ? 'text-brand-primary font-bold' : ''}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-brand-primary text-brand-primary' : ''}`} />
                    <span>{c.likesCount || 0}</span>
                  </button>
                  <button className="hover:underline">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT FOOTER */}
        <form onSubmit={handlePostComment} className="p-3 border-t border-brand-border/60 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <Avatar src={user?.avatarUrl} alt="Your Avatar" size="sm" />
          <input
            type="text"
            placeholder={`Add a comment for @${post.author.username}...`}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 h-10 border border-brand-border dark:border-slate-700 rounded-20px px-3.5 text-xs bg-brand-bg dark:bg-slate-800 text-brand-text dark:text-gray-100 focus:outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            disabled={!commentInput.trim() || isSubmitting}
            className={`p-2.5 rounded-full text-white transition-all ${
              commentInput.trim() ? 'bg-brand-primary hover:opacity-90 shadow-sm' : 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
