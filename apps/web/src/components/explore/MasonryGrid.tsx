import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, Film } from 'lucide-react';
import { IPost } from '@boundup/shared';

interface MasonryGridProps {
  posts: IPost[];
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 my-4">
      {posts.map((post, idx) => {
        const firstMedia = post.media[0];
        // Create dynamic height spanning for masonry effect
        const isTall = idx % 5 === 1 || idx % 7 === 3;

        return (
          <NavLink
            key={post.id || (post as any)._id}
            to={`/post/${post.id || (post as any)._id}`}
            className={`relative group rounded-16px overflow-hidden bg-black/10 border border-brand-border/40 shadow-soft ${
              isTall ? 'row-span-2 h-80' : 'h-48'
            }`}
          >
            {firstMedia?.type === 'VIDEO' ? (
              <video
                src={firstMedia.url}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <img
                src={firstMedia?.url}
                alt="Explore item"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}

            {/* Video Indicator Badge */}
            {firstMedia?.type === 'VIDEO' && (
              <div className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-sm">
                <Film className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Hover overlay with likes and comments */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 text-white font-bold text-sm">
              <div className="flex items-center gap-1">
                <Heart className="w-5 h-5 fill-white" />
                <span>{post.likesCount || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{post.commentsCount || 0}</span>
              </div>
            </div>
          </NavLink>
        );
      })}
    </div>
  );
};
