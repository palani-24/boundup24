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
    <div className="w-full bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px p-3.5 my-3 shadow-sm card-shadow select-none">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Your Story Add Button */}
        <div
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          onClick={() => setIsCreating(true)}
        >
          <div className="relative p-[2px] rounded-full border-2 border-dashed border-brand-primary/60 group-hover:border-brand-primary transition-colors">
            <Avatar src={user?.avatarUrl} alt={user?.fullName} size="lg" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-extrabold text-brand-text dark:text-gray-200 truncate w-16 text-center">
            Your Story
          </span>
        </div>

        {/* Stories List (Instagram Style Gradient Rings) */}
        {storyGroups.map((group) => {
          const author = group.author;
          const hasViewed = group.allViewed;
          return (
            <div
              key={author._id || author.id}
              onClick={() => handleViewStory(group, 0)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <div
                className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${
                  hasViewed ? 'story-ring-viewed' : 'story-ring-gradient shadow-sm'
                }`}
              >
                <div className="p-[2px] bg-white dark:bg-slate-900 rounded-full">
                  <Avatar src={author.avatarUrl} alt={author.fullName} size="lg" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-brand-text dark:text-gray-200 truncate w-16 text-center group-hover:text-brand-primary transition-colors">
                {author.username}
              </span>
            </div>
          );
        })}
      </div>

      {/* CREATE STORY MODAL */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-4 right-4 p-2 text-brand-muted dark:text-slate-400 hover:text-brand-text dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold text-brand-text dark:text-gray-100 mb-4 font-heading">
              Add to Your Story
            </h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Image or Video Media URL (https://...)"
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                className="w-full h-10 border border-brand-border dark:border-slate-700 rounded-16px px-3 text-xs bg-brand-bg dark:bg-slate-800 text-brand-text dark:text-gray-100 focus:outline-none focus:border-brand-primary"
              />
              <input
                type="text"
                placeholder="Story Caption (optional)..."
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                className="w-full h-10 border border-brand-border dark:border-slate-700 rounded-16px px-3 text-xs bg-brand-bg dark:bg-slate-800 text-brand-text dark:text-gray-100 focus:outline-none focus:border-brand-primary"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-bold text-brand-muted dark:text-slate-400 hover:text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateStory}
                  disabled={!mediaUrlInput || isPublishing}
                  className="px-5 py-2 rounded-16px bg-brand-primary text-white text-xs font-extrabold shadow-md hover:opacity-90 transition-all"
                >
                  {isPublishing ? 'Publishing...' : 'Share Story'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {activeStoryGroup && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm h-[85vh] bg-slate-950 rounded-24px overflow-hidden flex flex-col justify-between shadow-2xl border border-white/20">
            {/* PROGRESS BAR */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {activeStoryGroup.stories.map((s: any, idx: number) => (
                <div key={s.id || idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      idx < storyIndex ? 'w-full' : idx === storyIndex ? 'w-full animate-pulse' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* HEADER */}
            <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Avatar src={activeStoryGroup.author.avatarUrl} alt={activeStoryGroup.author.fullName} size="sm" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs">@{activeStoryGroup.author.username}</span>
                  <span className="text-[10px] text-gray-300">
                    {new Date(
                      activeStoryGroup.stories[storyIndex]?.createdAt || Date.now()
                    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveStoryGroup(null)}
                className="p-1.5 bg-black/50 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* STORY MEDIA */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={activeStoryGroup.stories[storyIndex]?.mediaUrl}
                alt="Story media"
                className="w-full h-full object-cover"
              />

              {activeStoryGroup.stories[storyIndex]?.caption && (
                <div className="absolute bottom-6 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-16px text-center border border-white/10 z-20">
                  <p className="text-xs font-bold text-white leading-relaxed">
                    {activeStoryGroup.stories[storyIndex].caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
