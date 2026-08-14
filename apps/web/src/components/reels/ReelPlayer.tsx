import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, Volume2, VolumeX, Music, Layers, Captions, Camera, Disc, Sparkles } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { IPost } from '@boundup/shared';
import { apiFetch } from '../../services/api';
import { ShareToFriendsModal } from '../common/ShareToFriendsModal';
import { CommentsDrawerModal } from '../common/CommentsDrawerModal';

interface ReelPlayerProps {
  post: IPost;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 310);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [isMuted, setIsMuted] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isAudioSaved, setIsAudioSaved] = useState(false);

  // MODALS STATE
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const media = post.media[0];

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
    <div
      onClick={() => setIsMuted(!isMuted)}
      className="relative w-full max-w-sm h-[80vh] bg-slate-950 rounded-24px overflow-hidden shadow-ambient flex flex-col justify-between my-4 border border-white/20 select-none cursor-pointer group hover:border-brand-primary/60 transition-all duration-300 ring-1 ring-white/10"
    >
      {/* VIDEO ELEMENT */}
      {media?.type === 'VIDEO' ? (
        <video
          src={media.url}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img src={media?.url} alt="Reel media" className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* CINEMATIC GLOW OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

      {/* DUAL CAMERA PREVIEW PIP OVERLAY */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="w-14 h-20 rounded-16px bg-black/60 border border-emerald-400/40 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center text-[10px] text-white font-extrabold p-1 shadow-lg group-hover:scale-105 transition-transform">
          <Camera className="w-4 h-4 text-emerald-400 mb-1 animate-pulse" />
          <span className="text-emerald-300">Dual Cam</span>
        </div>
      </div>

      {/* TOP CONTROLS BADGES */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCaptions(!showCaptions);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            showCaptions
              ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-amber-500/20'
              : 'bg-black/60 text-white opacity-70 border border-white/20'
          }`}
          title="Toggle Auto Subtitles"
        >
          <Captions className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-transform active:scale-90 shadow-md"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span className="text-[10px] font-extrabold text-gray-200">Tap for Sound</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-extrabold text-emerald-400">Audio Playing</span>
            </>
          )}
        </button>
      </div>

      {/* AUTO SUBTITLES OVERLAY */}
      {showCaptions && (
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 z-10 text-center pointer-events-none">
          <span className="px-3.5 py-1.5 bg-black/80 backdrop-blur-md rounded-16px text-xs font-semibold text-amber-300 border border-amber-400/30 inline-block shadow-2xl animate-fade-in">
            CC: "Surfing the morning swells in Bali 🏄‍♂️🌊 Pure freedom!"
          </span>
        </div>
      )}

      {/* BOTTOM OVERLAY INFO & ACTION BAR */}
      <div className="h-full flex flex-col justify-end p-4 z-10 text-white">
        <div className="flex items-end justify-between">
          {/* AUTHOR & CAPTION INFO */}
          <div className="flex flex-col gap-2 max-w-[72%]">
            <NavLink to={`/profile/${post.author.username}`} className="flex items-center gap-3 group/author">
              <div className="relative">
                <Avatar src={post.author.avatarUrl} alt={post.author.fullName} size="md" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-primary border-2 border-black flex items-center justify-center text-[8px] font-black">
                  +
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-white group-hover/author:text-brand-primary transition-colors flex items-center gap-1">
                  @{post.author.username}
                  {post.author.isVerified && <span className="text-blue-400 text-xs">✓</span>}
                </span>
                <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit border border-emerald-500/20">
                  {post.author.category || 'Creator'}
                </span>
              </div>
            </NavLink>

            <p className="text-xs text-gray-100 line-clamp-2 leading-relaxed font-medium">
              {post.caption || 'Surfing the morning swells in Bali 🏄‍♂️🌊 Pure freedom! #surfing #bali #ocean'}
            </p>

            {/* AUDIO TRACK ROW */}
            <div className="flex items-center justify-between bg-black/50 backdrop-blur-md rounded-16px p-2 border border-white/20 shadow-md">
              <div className="flex items-center gap-2 text-[11px] text-gray-200 font-bold truncate max-w-[72%]">
                <Music className="w-4 h-4 animate-spin text-brand-primary" />
                <span className="truncate">{post.audioTitle || `Original Sound — @${post.author.username}`}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAudioSaved(!isAudioSaved);
                }}
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-12px transition-all flex items-center gap-1 shadow-sm ${
                  isAudioSaved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-brand-primary to-orange-600 text-white hover:opacity-90'
                }`}
              >
                <Disc className="w-3 h-3 animate-spin" />
                {isAudioSaved ? 'Saved' : 'Use'}
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS COLUMN */}
          <div className="flex flex-col items-center gap-3">
            {/* LIKE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle();
              }}
              className="flex flex-col items-center gap-1 group/btn"
            >
              <div className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 group-hover/btn:scale-110 transition-transform shadow-lg">
                <Heart
                  className={`w-6 h-6 ${
                    isLiked ? 'text-brand-primary fill-brand-primary animate-pulse' : 'text-white'
                  }`}
                />
              </div>
              <span className="text-xs font-extrabold">{likesCount}</span>
            </button>

            {/* COMMENT BUTTON (OPEN COMMENTS DRAWER) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentsModal(true);
              }}
              className="flex flex-col items-center gap-1 group/btn"
            >
              <div className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 group-hover/btn:scale-110 transition-transform shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-extrabold">{commentsCount}</span>
            </button>

            {/* REMIX / DUET BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert('Remix feature: Record side-by-side video duet with this reel!');
              }}
              className="flex flex-col items-center gap-1 group/btn"
              title="Remix / Duet Reel"
            >
              <div className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-purple-400/40 group-hover/btn:border-purple-400 group-hover/btn:scale-110 transition-transform shadow-lg">
                <Layers className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-[10px] font-extrabold text-purple-200">Remix</span>
            </button>

            {/* SHARE BUTTON (OPEN SHARE TO FRIENDS DM MODAL) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareModal(true);
              }}
              className="flex flex-col items-center gap-1 group/btn"
              title="Share to Friends via DM"
            >
              <div className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 group-hover/btn:scale-110 transition-transform shadow-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-extrabold text-gray-200">Share</span>
            </button>

            {/* BOOKMARK BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveToggle();
              }}
              className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:scale-110 transition-transform shadow-lg"
            >
              <Bookmark className={`w-6 h-6 ${isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
            </button>
          </div>
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
