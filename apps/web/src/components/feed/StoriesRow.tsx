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

  // Fallback mock stories matching Image 1 & Image 3
  const fallbackStories = [
    {
      author: {
        id: '1',
        username: 'k2d',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      },
      stories: [{ id: 's1', mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Sunset vibes ✨' }],
    },
    {
      author: {
        id: '2',
        username: 'designhub',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
      },
      stories: [{ id: 's2', mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', caption: 'Design review setup' }],
    },
    {
      author: {
        id: '3',
        username: 'creative.soul',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      },
      stories: [{ id: 's3', mediaUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', caption: 'Art & Photography' }],
    },
    {
      author: {
        id: '4',
        username: 'ux.mentor',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300',
      },
      stories: [{ id: 's4', mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'UX Masterclass' }],
    },
    {
      author: {
        id: '5',
        username: 'travel.diary',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300',
      },
      stories: [{ id: 's5', mediaUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', caption: 'Wanderlust' }],
    },
    {
      author: {
        id: '6',
        username: 'ai.withme',
        avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300',
      },
      stories: [{ id: 's6', mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', caption: 'AI Future' }],
    },
    {
      author: {
        id: '7',
        username: 'techverse',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300',
      },
      stories: [{ id: 's7', mediaUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', caption: 'Tech Talk' }],
    },
  ];

  const displayStories = storyGroups && storyGroups.length > 0 ? storyGroups : fallbackStories;

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
    const story = group.stories?.[idx];
    if (story?.id) {
      try {
        await apiFetch(`/stories/${story.id}/view`, { method: 'POST' });
      } catch (_) {}
    }
  };

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-24px p-4 my-3 shadow-sm select-none flex flex-col gap-3">
      {/* Header Row on Desktop */}
      <div className="flex items-center justify-between px-1">
        <span className="font-extrabold text-sm text-[#111111]">Stories</span>
        <button className="text-xs font-bold text-[#FF5A1F] hover:underline">See all</button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Your Story Add Button */}
        <div
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          onClick={() => setIsCreating(true)}
        >
          <div className="relative p-[2px] rounded-full border-2 border-dashed border-[#FF5A1F]/60 group-hover:border-[#FF5A1F] transition-colors">
            <Avatar src={user?.avatarUrl} alt={user?.fullName} size="lg" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#FF5A1F] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-extrabold text-[#111111] truncate w-16 text-center">
            Your Story
          </span>
        </div>

        {/* Stories List (Instagram Style Gradient Rings) */}
        {displayStories.map((group, idx) => {
          const author = group.author;
          const hasViewed = group.allViewed;
          return (
            <div
              key={author.id || author._id || idx}
              onClick={() => handleViewStory(group, 0)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <div
                className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${
                  hasViewed ? 'story-ring-viewed' : 'story-ring-gradient shadow-sm'
                }`}
              >
                <div className="p-[2px] bg-white rounded-full">
                  <Avatar src={author.avatarUrl} alt={author.fullName || author.username} size="lg" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#111111] truncate w-16 text-center group-hover:text-[#FF5A1F] transition-colors">
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
              {activeStoryGroup.stories?.map((s: any, idx: number) => (
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
                src={activeStoryGroup.stories?.[storyIndex]?.mediaUrl}
                alt="Story media"
                className="w-full h-full object-cover"
              />

              {activeStoryGroup.stories?.[storyIndex]?.caption && (
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
