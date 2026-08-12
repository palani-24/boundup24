import React, { useState } from 'react';
import { X, Image, Film, MapPin, Tag, Sliders, Sparkles, BarChart2, Lock, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { api, apiFetch } from '../../services/api';

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
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CLOSE_FRIENDS'>('PUBLIC');
  const [isCommentsDisabled, setIsCommentsDisabled] = useState(false);
  const [isLikeCountHidden, setIsLikeCountHidden] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Poll state
  const [enablePoll, setEnablePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');

  if (!isOpen) return null;

  const handleGenerateAICaption = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await api.post('/posts/ai-caption', { prompt: caption || location || 'Life' });
      if (res.data?.success && res.data.data) {
        setCaption(res.data.data.caption);
        if (res.data.data.hashtags) {
          setHashtagsInput(res.data.data.hashtags.join(', '));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async () => {
    if (!mediaUrl && !enablePoll) {
      alert('Please enter a valid media URL or create a poll');
      return;
    }

    setIsSubmitting(true);
    try {
      const hashtags = hashtagsInput
        ? hashtagsInput.split(',').map((h) => h.trim().replace('#', ''))
        : [];

      const pollData = enablePoll && pollQuestion.trim()
        ? {
            question: pollQuestion.trim(),
            options: [
              { text: pollOption1.trim() || 'Option A', votes: [] },
              { text: pollOption2.trim() || 'Option B', votes: [] },
            ],
          }
        : undefined;

      await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
          media: mediaUrl ? [{ url: mediaUrl, type: mediaType, aspectRatio }] : [],
          caption,
          location,
          hashtags,
          visibility,
          poll: pollData,
          isCommentsDisabled,
          isLikeCountHidden,
        }),
      });

      setMediaUrl('');
      setCaption('');
      setLocation('');
      setHashtagsInput('');
      setEnablePoll(false);
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
      <div className="bg-white dark:bg-slate-800 rounded-24px max-w-2xl w-full overflow-hidden shadow-glass flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-brand-border dark:border-slate-700 select-none">
          <button onClick={onClose} className="text-sm font-semibold text-brand-muted dark:text-slate-400 hover:text-brand-text">
            Cancel
          </button>
          <h2 className="text-base font-bold text-brand-text dark:text-gray-100 font-heading">Create New Post</h2>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-sm font-bold text-brand-primary hover:text-brand-accent disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Share'}
          </button>
        </header>

        {/* BODY */}
        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* MEDIA PREVIEW & INPUT */}
          <div className="md:w-1/2 p-6 bg-gray-50 dark:bg-slate-900 flex flex-col gap-4 border-r border-brand-border dark:border-slate-700">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-muted dark:text-slate-400 uppercase">Media Source URL</label>
              <input
                type="text"
                placeholder="Paste image or video URL..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full h-11 border border-brand-border dark:border-slate-700 rounded-12px px-4 text-xs bg-white dark:bg-slate-800 dark:text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Media Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMediaType('IMAGE')}
                className={`flex-1 h-9 rounded-12px text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  mediaType === 'IMAGE' ? 'bg-brand-primary text-white' : 'bg-white dark:bg-slate-800 border border-brand-border dark:border-slate-700 text-brand-text dark:text-gray-200'
                }`}
              >
                <Image className="w-4 h-4" /> Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('VIDEO')}
                className={`flex-1 h-9 rounded-12px text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  mediaType === 'VIDEO' ? 'bg-brand-primary text-white' : 'bg-white dark:bg-slate-800 border border-brand-border dark:border-slate-700 text-brand-text dark:text-gray-200'
                }`}
              >
                <Film className="w-4 h-4" /> Video
              </button>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="w-full h-48 bg-black/10 rounded-16px overflow-hidden flex items-center justify-center border border-dashed border-brand-border dark:border-slate-700 mt-1">
              {mediaUrl ? (
                mediaType === 'VIDEO' ? (
                  <video src={mediaUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="flex flex-col items-center gap-2 text-brand-muted dark:text-slate-400 p-4 text-center">
                  <Image className="w-8 h-8 stroke-[1.5]" />
                  <span className="text-xs font-medium">Media preview will appear here</span>
                </div>
              )}
            </div>

            {/* Visibility Options */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-xs font-bold text-brand-muted dark:text-slate-400 uppercase">Audience Visibility</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('PUBLIC')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    visibility === 'PUBLIC'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                      : 'border-gray-200 dark:border-slate-700 text-gray-500'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Public
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('CLOSE_FRIENDS')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    visibility === 'CLOSE_FRIENDS'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                      : 'border-gray-200 dark:border-slate-700 text-gray-500'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Close Friends
                </button>
              </div>
            </div>
          </div>

          {/* POST DETAILS & ADVANCED OPTIONS */}
          <div className="md:w-1/2 p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-brand-muted dark:text-slate-400 uppercase">Caption</label>
                <button
                  type="button"
                  onClick={handleGenerateAICaption}
                  disabled={isGeneratingAI}
                  className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {isGeneratingAI ? 'Generating...' : 'AI Caption'}
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Write a caption... Or tap AI Caption to auto-suggest!"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border border-brand-border dark:border-slate-700 rounded-12px p-3 text-xs bg-white dark:bg-slate-900 dark:text-gray-100 focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-muted dark:text-slate-400 uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Hashtags
              </label>
              <input
                type="text"
                placeholder="photography, travel, tech"
                value={hashtagsInput}
                onChange={(e) => setHashtagsInput(e.target.value)}
                className="w-full h-10 border border-brand-border dark:border-slate-700 rounded-12px px-3 text-xs bg-white dark:bg-slate-900 dark:text-gray-100 focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Poll Builder Section */}
            <div className="border-t border-brand-border dark:border-slate-700 pt-3">
              <button
                type="button"
                onClick={() => setEnablePoll(!enablePoll)}
                className="text-xs font-bold text-orange-500 flex items-center gap-1.5 mb-2"
              >
                <BarChart2 className="w-4 h-4" /> {enablePoll ? 'Remove Interactive Poll' : 'Add Interactive Poll'}
              </button>

              {enablePoll && (
                <div className="space-y-2 bg-orange-50/50 dark:bg-slate-900 p-3 rounded-2xl border border-orange-100 dark:border-slate-700">
                  <input
                    type="text"
                    placeholder="Poll Question (e.g. Which camera set is best?)"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full h-9 border border-gray-200 dark:border-slate-700 rounded-xl px-3 text-xs bg-white dark:bg-slate-800 dark:text-gray-100"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Option 1"
                      value={pollOption1}
                      onChange={(e) => setPollOption1(e.target.value)}
                      className="h-8 border border-gray-200 dark:border-slate-700 rounded-xl px-3 text-xs bg-white dark:bg-slate-800 dark:text-gray-100"
                    />
                    <input
                      type="text"
                      placeholder="Option 2"
                      value={pollOption2}
                      onChange={(e) => setPollOption2(e.target.value)}
                      className="h-8 border border-gray-200 dark:border-slate-700 rounded-xl px-3 text-xs bg-white dark:bg-slate-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

