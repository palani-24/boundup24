import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, ArrowLeft, MoreHorizontal, Gift } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { IPost } from '@boundup/shared';
import { apiFetch } from '../../services/api';
import { ShareToFriendsModal } from '../common/ShareToFriendsModal';
import { CommentsDrawerModal } from '../common/CommentsDrawerModal';

interface ReelPlayerProps {
  post: IPost;
  reelIndex?: number;
  totalReels?: number;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({ post, reelIndex = 1, totalReels = 5 }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(1200);
  const [commentsCount, setCommentsCount] = useState(56);
  const [sharesCount, setSharesCount] = useState(128);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const navigate = useNavigate();
  const media = post.media?.[0];

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
    } catch (_) {
      setIsLiked(!nextState);
    }
  };

  const handleSaveToggle = async () => {
    setIsSaved(!isSaved);
    try {
      if (!isSaved) {
        await apiFetch(`/posts/${post.id}/save`, { method: 'POST' });
      } else {
        await apiFetch(`/posts/${post.id}/save`, { method: 'DELETE' });
      }
    } catch (_) {}
  };

  return (
    <div className="relative w-full max-w-sm h-[82vh] sm:h-[85vh] bg-black rounded-24px overflow-hidden shadow-2xl flex flex-col justify-between my-2 border border-white/20 select-none mx-auto">
      {/* BACKGROUND MEDIA PHOTO / VIDEO */}
      {media?.type === 'VIDEO' ? (
        <video
          src={media.url}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={media?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'}
          alt="Reel background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* DARK GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

      {/* TOP HEADER BAR (BACK BUTTON, 1/5 COUNTER, 3 DOTS - IMAGE 1 REELS) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <span className="text-xs font-extrabold px-3 py-1 bg-black/40 rounded-full backdrop-blur-md border border-white/20">
          {reelIndex}/{totalReels}
        </span>

        <button className="p-2 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-all">
          <MoreHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* RIGHT SIDE FLOATING ACTION BUTTONS (IMAGE 1 REELS) */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-4">
        {/* LIKE */}
        <button onClick={handleLikeToggle} className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20 group-hover:scale-110 transition-transform">
            <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          </div>
          <span className="text-xs font-extrabold text-white">1.2K</span>
        </button>

        {/* COMMENT */}
        <button onClick={() => setShowCommentsModal(true)} className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-extrabold text-white">56</span>
        </button>

        {/* SHARE */}
        <button onClick={() => setShowShareModal(true)} className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20 group-hover:scale-110 transition-transform">
            <Send className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-extrabold text-white">128</span>
        </button>

        {/* BOOKMARK */}
        <button onClick={handleSaveToggle} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20 hover:scale-110 transition-transform">
          <Bookmark className={`w-6 h-6 ${isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
        </button>
      </div>

      {/* BOTTOM OVERLAY INFO & COMMENT INPUT BAR (IMAGE 1 REELS) */}
      <div className="z-10 p-4 mt-auto flex flex-col gap-3">
        {/* AUTHOR & CAPTION */}
        <div className="flex flex-col gap-2 max-w-[80%]">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={post.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
              alt={post.author?.username || 'k2d'}
              size="sm"
            />
            <span className="font-extrabold text-xs text-white">@{post.author?.username || 'k2d'}</span>
            <span className="text-[11px] font-bold text-white">•</span>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full transition-all ${
                isFollowing ? 'bg-white/20 text-white' : 'text-orange-400 font-extrabold'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          <span className="text-[11px] text-gray-300 font-medium">Coimbatore, India</span>

          <p className="text-xs text-white leading-relaxed font-medium line-clamp-2">
            Sunsets hit different when you're chasing dreams 🌅 Work. Travel. Repeat.
          </p>

          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {['#sunset', '#dreamer', '#worklife', '#BoundUp'].map((t) => (
              <span key={t} className="text-xs font-bold text-sky-400">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* BOTTOM COMMENT INPUT BAR WITH GIFT ICON (IMAGE 1 REELS) */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/20">
          <div className="flex-1 relative flex items-center">
            <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300" size="sm" className="absolute left-2" />
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-black/60 border border-white/30 rounded-full text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 backdrop-blur-md"
            />
            <button className="absolute right-3 text-amber-400 hover:scale-110 transition-transform">
              <Gift className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="p-2.5 bg-black/60 rounded-full border border-white/30 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SHARE TO FRIENDS DM MODAL */}
      {showShareModal && <ShareToFriendsModal post={post} onClose={() => setShowShareModal(false)} />}

      {/* COMMENTS DRAWER MODAL */}
      {showCommentsModal && (
        <CommentsDrawerModal
          post={post}
          onClose={() => setShowCommentsModal(false)}
          onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
        />
      )}
    </div>
  );
};
