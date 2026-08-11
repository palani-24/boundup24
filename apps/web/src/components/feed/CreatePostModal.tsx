import React, { useState } from 'react';
import { X, Image, Film, MapPin, Tag, Sliders, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { apiFetch } from '../../services/api';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '16:9' | '9:16'>('1:1');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [hashtagsInput, setHashtagsInput] = useState('');
  const [isCommentsDisabled, setIsCommentsDisabled] = useState(false);
  const [isLikeCountHidden, setIsLikeCountHidden] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!mediaUrl) {
      alert('Please enter a valid media URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const hashtags = hashtagsInput
        ? hashtagsInput.split(',').map((h) => h.trim().replace('#', ''))
        : [];

      await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
          media: [{ url: mediaUrl, type: mediaType, aspectRatio }],
          caption,
          location,
          hashtags,
          isCommentsDisabled,
          isLikeCountHidden,
        }),
      });

      setMediaUrl('');
      setCaption('');
      setLocation('');
      setHashtagsInput('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-24px max-w-2xl w-full overflow-hidden shadow-glass flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-brand-border select-none">
          <button onClick={onClose} className="text-sm font-semibold text-brand-muted hover:text-brand-text">
            Cancel
          </button>
          <h2 className="text-base font-bold text-brand-text font-heading">Create New Post</h2>
          <button
            onClick={handleSubmit}
            disabled={!mediaUrl || isSubmitting}
            className="text-sm font-bold text-brand-primary hover:text-brand-accent disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Share'}
          </button>
        </header>

        {/* BODY */}
        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* MEDIA PREVIEW & INPUT */}
          <div className="md:w-1/2 p-6 bg-gray-50 flex flex-col gap-4 border-r border-brand-border">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-muted uppercase">Media Source URL</label>
              <input
                type="text"
                placeholder="Paste image or video URL..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full h-11 border border-brand-border rounded-12px px-4 text-xs bg-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Media Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMediaType('IMAGE')}
                className={`flex-1 h-9 rounded-12px text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  mediaType === 'IMAGE' ? 'bg-brand-primary text-white' : 'bg-white border border-brand-border text-brand-text'
                }`}
              >
                <Image className="w-4 h-4" /> Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('VIDEO')}
                className={`flex-1 h-9 rounded-12px text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  mediaType === 'VIDEO' ? 'bg-brand-primary text-white' : 'bg-white border border-brand-border text-brand-text'
                }`}
              >
                <Film className="w-4 h-4" /> Video
              </button>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brand-muted uppercase">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {(['1:1', '4:5', '16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`h-8 rounded-8px text-xs font-semibold border ${
                      aspectRatio === ratio
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-brand-border bg-white text-brand-muted'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="w-full h-64 bg-black/10 rounded-16px overflow-hidden flex items-center justify-center border border-dashed border-brand-border mt-2">
              {mediaUrl ? (
                mediaType === 'VIDEO' ? (
                  <video src={mediaUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="flex flex-col items-center gap-2 text-brand-muted p-4 text-center">
                  <Image className="w-8 h-8 stroke-[1.5]" />
                  <span className="text-xs font-medium">Enter a media URL above to see live preview</span>
                </div>
              )}
            </div>
          </div>

          {/* POST DETAILS & ADVANCED OPTIONS */}
          <div className="md:w-1/2 p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-muted uppercase">Caption</label>
              <textarea
                rows={4}
                placeholder="Write a caption... (Use #hashtags)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border border-brand-border rounded-12px p-3 text-xs focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-muted uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Add Location
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, California"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-muted uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Hashtags
              </label>
              <input
                type="text"
                placeholder="photography, travel, tech (comma separated)"
                value={hashtagsInput}
                onChange={(e) => setHashtagsInput(e.target.value)}
                className="w-full h-10 border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* ADVANCED SETTINGS */}
            <div className="border-t border-brand-border pt-4 flex flex-col gap-3">
              <span className="text-xs font-bold text-brand-muted uppercase flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Advanced Options
              </span>

              <label className="flex items-center justify-between text-xs font-medium text-brand-text cursor-pointer">
                <span>Hide like count on this post</span>
                <input
                  type="checkbox"
                  checked={isLikeCountHidden}
                  onChange={(e) => setIsLikeCountHidden(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-medium text-brand-text cursor-pointer">
                <span>Disable comments</span>
                <input
                  type="checkbox"
                  checked={isCommentsDisabled}
                  onChange={(e) => setIsCommentsDisabled(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
