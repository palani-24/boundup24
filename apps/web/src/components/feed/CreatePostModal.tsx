import React, { useState, useRef } from 'react';
import { X, Image, Film, MapPin, Tag, Sliders, Sparkles, BarChart2, Lock, Globe, Upload } from 'lucide-react';
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll state
  const [enablePoll, setEnablePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      setMediaType(isVideo ? 'VIDEO' : 'IMAGE');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      alert('Please select a photo/video from your device or create a poll');
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
      <div className="bg-white rounded-24px max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-[#E5E7EB]">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] select-none bg-white">
          <button onClick={onClose} className="text-xs font-bold text-[#666666] hover:text-[#111111]">
            Cancel
          </button>
          <h2 className="text-sm font-extrabold text-[#111111] font-heading">Create New Post</h2>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs font-extrabold text-[#FF5A1F] hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Share'}
          </button>
        </header>

        {/* HIDDEN NATIVE FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* BODY */}
        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* MEDIA PREVIEW & LOCAL FILE PICKER */}
          <div className="md:w-1/2 p-6 bg-[#FAFAFC] flex flex-col gap-4 border-r border-[#E5E7EB]">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-extrabold text-[#666666] uppercase">Device File Upload</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-11 border-2 border-dashed border-[#FF5A1F]/50 hover:border-[#FF5A1F] bg-white rounded-16px px-4 text-xs font-extrabold text-[#FF5A1F] flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4" />
                Select Photo or Video
              </button>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="w-full h-52 bg-black/5 rounded-20px overflow-hidden flex items-center justify-center border border-[#E5E7EB] mt-1 relative">
              {mediaUrl ? (
                mediaType === 'VIDEO' ? (
                  <video src={mediaUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                )
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 text-[#666666] p-4 text-center cursor-pointer hover:text-[#FF5A1F] transition-colors"
                >
                  <Image className="w-8 h-8 stroke-[1.5] text-[#FF5A1F]" />
                  <span className="text-xs font-bold text-[#111111]">Tap to select file from device</span>
                  <span className="text-[10px] text-[#666666]">Photos & videos up to 50MB</span>
                </div>
              )}
            </div>

            {/* Audience Visibility Options */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[11px] font-extrabold text-[#666666] uppercase">Audience Visibility</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('PUBLIC')}
                  className={`flex-1 py-2 rounded-12px text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all ${
                    visibility === 'PUBLIC'
                      ? 'border-[#FF5A1F] bg-orange-50 text-[#FF5A1F]'
                      : 'border-[#E5E7EB] bg-white text-[#666666]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Public
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('CLOSE_FRIENDS')}
                  className={`flex-1 py-2 rounded-12px text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all ${
                    visibility === 'CLOSE_FRIENDS'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-[#E5E7EB] bg-white text-[#666666]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Close Friends
                </button>
              </div>
            </div>
          </div>

          {/* POST DETAILS & ADVANCED OPTIONS */}
          <div className="md:w-1/2 p-6 flex flex-col gap-4 bg-white">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-[#666666] uppercase">Caption</label>
                <button
                  type="button"
                  onClick={handleGenerateAICaption}
                  disabled={isGeneratingAI}
                  className="text-xs font-bold text-[#FF5A1F] flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {isGeneratingAI ? 'Generating...' : 'AI Caption'}
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Write a caption... Or tap AI Caption to auto-suggest!"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-16px p-3 text-xs bg-white text-[#111111] focus:outline-none focus:border-[#FF5A1F] resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-extrabold text-[#666666] uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#FF5A1F]" /> Hashtags
              </label>
              <input
                type="text"
                placeholder="photography, travel, tech"
                value={hashtagsInput}
                onChange={(e) => setHashtagsInput(e.target.value)}
                className="w-full h-10 border border-[#E5E7EB] rounded-16px px-3 text-xs bg-white text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>

            {/* Poll Builder Section */}
            <div className="border-t border-[#E5E7EB] pt-3">
              <button
                type="button"
                onClick={() => setEnablePoll(!enablePoll)}
                className="text-xs font-extrabold text-[#FF5A1F] flex items-center gap-1.5 mb-2"
              >
                <BarChart2 className="w-4 h-4" /> {enablePoll ? 'Remove Interactive Poll' : 'Add Interactive Poll'}
              </button>

              {enablePoll && (
                <div className="space-y-2 bg-[#FAFAFC] p-3 rounded-20px border border-[#E5E7EB]">
                  <input
                    type="text"
                    placeholder="Poll Question (e.g. Which camera set is best?)"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full h-9 border border-[#E5E7EB] rounded-12px px-3 text-xs bg-white text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Option 1"
                      value={pollOption1}
                      onChange={(e) => setPollOption1(e.target.value)}
                      className="h-8 border border-[#E5E7EB] rounded-12px px-3 text-xs bg-white text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                    />
                    <input
                      type="text"
                      placeholder="Option 2"
                      value={pollOption2}
                      onChange={(e) => setPollOption2(e.target.value)}
                      className="h-8 border border-[#E5E7EB] rounded-12px px-3 text-xs bg-white text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
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

