import React, { useState } from 'react';
import { Plus, X, Eye } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { apiFetch } from '../../services/api';

interface StoriesRowProps {
  storyGroups?: any[];
  onRefresh?: () => void;
}

export const StoriesRow: React.FC<StoriesRowProps> = ({ storyGroups = [], onRefresh }) => {
  const { user } = useAuthStore();
  const [activeStoryGroup, setActiveStoryGroup] = useState<any | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleCreateStory = async () => {
    if (!mediaUrlInput) return;
    setIsPublishing(true);
    try {
      await apiFetch('/stories', {
        method: 'POST',
        body: JSON.stringify({ mediaUrl: mediaUrlInput, caption: captionInput }),
      });
      setIsCreating(false);
      setMediaUrlInput('');
      setCaptionInput('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to publish story');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleViewStory = async (group: any, idx = 0) => {
    setActiveStoryGroup(group);
    setStoryIndex(idx);
    const story = group.stories[idx];
    if (story) {
      try {
        await apiFetch(`/stories/${story.id}/view`, { method: 'POST' });
      } catch (_) {}
    }
  };

  return (
    <div className="w-full bg-white border border-brand-border rounded-24px p-4 my-3 shadow-soft select-none">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Your Story Add Button */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer" onClick={() => setIsCreating(true)}>
          <div className="relative">
            <Avatar src={user?.avatarUrl} alt={user?.fullName} size="lg" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-soft">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-brand-text truncate w-16 text-center">Your Story</span>
        </div>

        {/* Stories list */}
        {storyGroups.map((group) => {
          const author = group.author;
          return (
            <div
              key={author._id || author.id}
              onClick={() => handleViewStory(group, 0)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <Avatar
                src={author.avatarUrl}
                alt={author.fullName}
                size="lg"
                hasStory={true}
                hasViewedStory={group.allViewed}
              />
              <span className="text-[11px] font-medium text-brand-text truncate w-16 text-center group-hover:text-brand-primary">
                {author.username}
              </span>
            </div>
          );
        })}
      </div>

      {/* CREATE STORY MODAL */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-24px max-w-md w-full p-6 shadow-glass relative">
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-text"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-brand-text mb-4 font-heading">Add to Your Story</h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Image/Media URL..."
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                className="w-full h-11 border border-brand-border rounded-12px px-4 text-sm focus:outline-none focus:border-brand-primary"
              />
              <input
                type="text"
                placeholder="Story caption (optional)..."
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                className="w-full h-11 border border-brand-border rounded-12px px-4 text-sm focus:outline-none focus:border-brand-primary"
              />

              {mediaUrlInput && (
                <div className="w-full h-48 rounded-16px overflow-hidden bg-black/5 flex items-center justify-center">
                  <img src={mediaUrlInput} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <button
                onClick={handleCreateStory}
                disabled={!mediaUrlInput || isPublishing}
                className="w-full h-11 bg-brand-primary text-white rounded-16px font-bold hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                {isPublishing ? 'Publishing...' : 'Share to Story'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW STORY MODAL */}
      {activeStoryGroup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveStoryGroup(null)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-sm w-full h-[80vh] bg-black rounded-24px overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
            {/* Header info */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeStoryGroup.author.avatarUrl}
                  alt={activeStoryGroup.author.fullName}
                  size="sm"
                />
                <span className="font-bold text-sm">{activeStoryGroup.author.username}</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">
                <Eye className="w-3.5 h-3.5" />
                <span>{activeStoryGroup.stories[storyIndex]?.viewsCount || 0}</span>
              </div>
            </div>

            {/* Media Image */}
            {activeStoryGroup.stories[storyIndex] && (
              <img
                src={activeStoryGroup.stories[storyIndex].mediaUrl}
                alt="Story content"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Caption Overlay */}
            {activeStoryGroup.stories[storyIndex]?.caption && (
              <div className="z-10 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-sm font-medium">
                {activeStoryGroup.stories[storyIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
