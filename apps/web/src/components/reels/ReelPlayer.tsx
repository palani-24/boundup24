import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, Volume2, VolumeX, Music } from 'lucide-react';
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
    <div className="relative w-full max-w-sm h-[80vh] bg-black rounded-24px overflow-hidden shadow-2xl flex flex-col justify-between my-4 border border-brand-border select-none">
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

      {/* MUTE CONTROLLER */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md z-10"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <div className="h-full flex flex-col justify-end p-4 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
        <div className="flex items-end justify-between">
          {/* AUTHOR & CAPTION INFO */}
          <div className="flex flex-col gap-2 max-w-[75%]">
            <NavLink to={`/profile/${post.author.username}`} className="flex items-center gap-3">
              <Avatar src={post.author.avatarUrl} alt={post.author.fullName} size="md" />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white">@{post.author.username}</span>
                <span className="text-[11px] text-gray-300">{post.author.category || 'Creator'}</span>
              </div>
            </NavLink>

            <p className="text-xs text-white line-clamp-2 leading-relaxed">{post.caption}</p>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-300 font-medium">
              <Music className="w-3.5 h-3.5 animate-spin" />
              <span>Original Audio — {post.author.username}</span>
            </div>
          </div>

          {/* ACTION BUTTONS COLUMN */}
          <div className="flex flex-col items-center gap-4">
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
