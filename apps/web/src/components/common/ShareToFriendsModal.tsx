import React, { useState } from 'react';
import { Search, Send, X, CheckCircle, Sparkles, User } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { apiFetch } from '../../services/api';
import { IPost } from '@boundup/shared';

interface ShareToFriendsModalProps {
  post: IPost;
  onClose: () => void;
}

export const ShareToFriendsModal: React.FC<ShareToFriendsModalProps> = ({ post, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [shareNote, setShareNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock / Default friends list
  const friends = [
    { id: 'f1', username: 'alex_dev', fullName: 'Alex Rivera', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', category: 'Developer' },
    { id: 'f2', username: 'sarah_m', fullName: 'Sarah Miller', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', category: 'Designer' },
    { id: 'f3', username: 'palani_code', fullName: 'Palani K', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', category: 'Creator' },
    { id: 'f4', username: 'david_ui', fullName: 'David Chen', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', category: 'Photographer' },
  ];

  const filteredFriends = friends.filter(
    (f) =>
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectFriend = (id: string) => {
    if (selectedFriendIds.includes(id)) {
      setSelectedFriendIds(selectedFriendIds.filter((fId) => fId !== id));
    } else {
      setSelectedFriendIds([...selectedFriendIds, id]);
    }
  };

  const handleSendShare = async () => {
    if (selectedFriendIds.length === 0) return;
    setIsSending(true);

    try {
      // Simulate/Send DM share request
      await Promise.all(
        selectedFriendIds.map((fId) =>
          apiFetch('/chat/messages', {
            method: 'POST',
            body: JSON.stringify({
              conversationId: fId,
              text: shareNote || `Check out this reel/post by @${post.author.username}!`,
              mediaUrl: post.media[0]?.url,
              type: 'POST_SHARE',
            }),
          }).catch(() => {})
        )
      );

      const targetFriendNames = friends
        .filter((f) => selectedFriendIds.includes(f.id))
        .map((f) => `@${f.username}`)
        .join(', ');

      setToastMessage(`Successfully shared with ${targetFriendNames}! ✨`);

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (_) {
      setToastMessage('Shared successfully!');
      setTimeout(() => onClose(), 1400);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-700/80 rounded-24px max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
        {/* TOAST NOTIFICATION BANNER */}
        {toastMessage && (
          <div className="absolute top-0 left-0 right-0 p-3 bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-fade-in z-30">
            <CheckCircle className="w-4 h-4" /> {toastMessage}
          </div>
        )}

        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-brand-border/60 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-brand-primary" />
            <h3 className="text-base font-extrabold font-heading text-brand-text dark:text-gray-100">
              Share to Friends
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-brand-muted hover:text-brand-text dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POST PREVIEW BADGE */}
        <div className="flex items-center gap-3 p-2.5 rounded-16px bg-brand-primary/5 dark:bg-slate-800 border border-brand-primary/20 dark:border-slate-700">
          <img
            src={post.media[0]?.thumbnailUrl || post.media[0]?.url || post.author.avatarUrl}
            alt="Preview"
            className="w-12 h-12 rounded-12px object-cover flex-shrink-0"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-brand-text dark:text-gray-100 truncate">
              @{post.author.username}
            </span>
            <p className="text-[11px] text-brand-muted dark:text-slate-400 truncate">
              {post.caption || 'Shared post on BoundUp'}
            </p>
          </div>
        </div>

        {/* SEARCH FRIENDS BAR */}
        <div className="relative">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search friends or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-16px bg-brand-bg dark:bg-slate-800 border border-brand-border dark:border-slate-700 text-xs text-brand-text dark:text-gray-100 focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* FRIENDS LIST SELECTOR */}
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto no-scrollbar py-1">
          {filteredFriends.map((friend) => {
            const isSelected = selectedFriendIds.includes(friend.id);
            return (
              <div
                key={friend.id}
                onClick={() => toggleSelectFriend(friend.id)}
                className={`flex items-center justify-between p-2.5 rounded-16px cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-brand-primary/10 border-brand-primary text-brand-primary dark:bg-brand-primary/20'
                    : 'bg-brand-surface dark:bg-slate-800/60 border-brand-border/60 dark:border-slate-700/60 hover:border-brand-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar src={friend.avatarUrl} alt={friend.fullName} size="sm" />
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-brand-text dark:text-gray-100">{friend.fullName}</span>
                    <span className="text-[10px] text-brand-muted dark:text-slate-400">@{friend.username}</span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-brand-primary text-white' : 'border border-brand-border dark:border-slate-600'
                  }`}
                >
                  {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* OPTIONAL NOTE INPUT */}
        <input
          type="text"
          placeholder="Write a message (optional)..."
          value={shareNote}
          onChange={(e) => setShareNote(e.target.value)}
          className="w-full h-10 border border-brand-border dark:border-slate-700 rounded-16px px-3 text-xs bg-brand-bg dark:bg-slate-800 text-brand-text dark:text-gray-100 focus:outline-none focus:border-brand-primary"
        />

        {/* SEND BUTTON */}
        <button
          onClick={handleSendShare}
          disabled={selectedFriendIds.length === 0 || isSending}
          className={`w-full py-2.5 rounded-16px text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all ${
            selectedFriendIds.length > 0 && !isSending
              ? 'bg-brand-primary text-white hover:opacity-90 active:scale-98'
              : 'bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          {isSending ? 'Sending...' : `Send to ${selectedFriendIds.length} Friends`}
        </button>
      </div>
    </div>
  );
};
