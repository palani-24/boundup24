import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, Volume2, VolumeX, Music, Layers, Captions, Camera, Disc } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { IPost } from '@boundup/shared';
import { apiFetch } from '../../services/api';

interface ReelPlayerProps {
  post: IPost;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isMuted, setIsMuted] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isAudioSaved, setIsAudioSaved] = useState(false);

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

  return (
    <div
      onClick={() => setIsMuted(!isMuted)}
      className="relative w-full max-w-sm h-[80vh] bg-black rounded-24px overflow-hidden shadow-2xl flex flex-col justify-between my-4 border border-brand-border select-none cursor-pointer group"
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

      {/* DUAL CAMERA PREVIEW PIP OVERLAY (MOCKUP INDICATOR) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="w-14 h-20 rounded-12px bg-black/60 border border-white/30 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center text-[10px] text-white font-bold p-1 shadow-lg">
          <Camera className="w-4 h-4 text-emerald-400 mb-1" />
          <span>Dual Cam</span>
        </div>
      </div>

      {/* TOP CONTROLS BADGES */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCaptions(!showCaptions);
          }}
          className={`p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all ${
            showCaptions ? 'border border-brand-primary text-brand-primary' : 'opacity-70'
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
          className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md flex items-center gap-1.5 transition-transform active:scale-90"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-400" />
              <span className="text-[10px] font-bold text-gray-200">Tap for Sound</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400">Audio Playing</span>
            </>
          )}
        </button>
      </div>

      {/* AUTO SUBTITLES OVERLAY */}
      {showCaptions && (
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 z-10 text-center pointer-events-none">
          <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-12px text-xs font-semibold text-amber-300 border border-amber-400/30 inline-block shadow-lg">
            CC: "Exploring vertical video motion and creative editing ✨"
          </span>
        </div>
      )}

      <div className="h-full flex flex-col justify-end p-4 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
        <div className="flex items-end justify-between">
          {/* AUTHOR & CAPTION INFO */}
          <div className="flex flex-col gap-2 max-w-[72%]">
            <NavLink to={`/profile/${post.author.username}`} className="flex items-center gap-3">
              <Avatar src={post.author.avatarUrl} alt={post.author.fullName} size="md" />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white flex items-center gap-1">
                  @{post.author.username}
                  {post.author.isVerified && <span className="text-blue-400 text-xs">✓</span>}
                </span>
                <span className="text-[11px] text-gray-300">{post.author.category || 'Creator'}</span>
              </div>
            </NavLink>

            <p className="text-xs text-white line-clamp-2 leading-relaxed">{post.caption}</p>

            {/* AUDIO TRACK ROW */}
            <div className="flex items-center justify-between bg-black/40 backdrop-blur-md rounded-xl p-1.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-200 font-medium truncate max-w-[75%]">
                <Music className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                <span className="truncate">{post.audioTitle || `Original Sound — @${post.author.username}`}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAudioSaved(!isAudioSaved);
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-brand-primary text-white hover:opacity-90 transition-all flex items-center gap-1"
              >
                <Disc className="w-3 h-3" />
                {isAudioSaved ? 'Saved' : 'Use'}
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS COLUMN */}
          <div className="flex flex-col items-center gap-3">
            <button onClick={handleLikeToggle} className="flex flex-col items-center gap-1">
              <div className="p-3 bg-black/40 backdrop-blur-md rounded-full">
                <Heart
                  className={`w-6 h-6 ${isLiked ? 'text-brand-primary fill-brand-primary' : 'text-white'}`}
                />
              </div>
              <span className="text-xs font-bold">{likesCount}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-black/40 backdrop-blur-md rounded-full">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold">{post.commentsCount || 0}</span>
            </button>

            {/* REMIX / DUET BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert('Remix feature: Record side-by-side with this reel!');
              }}
              className="flex flex-col items-center gap-1"
              title="Remix / Duet Reel"
            >
              <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-purple-400/40 hover:border-purple-400">
                <Layers className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-[10px] font-bold text-purple-200">Remix</span>
            </button>

            <button className="p-3 bg-black/40 backdrop-blur-md rounded-full">
              <Send className="w-6 h-6 text-white" />
            </button>

            <button className="p-3 bg-black/40 backdrop-blur-md rounded-full">
              <Bookmark className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
