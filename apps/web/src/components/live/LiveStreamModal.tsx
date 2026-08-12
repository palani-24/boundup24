import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../../services/socket';
import { Radio, X, Send, Heart, Flame, Sparkles } from 'lucide-react';

interface LiveMessage {
  id: string;
  username: string;
  avatarUrl?: string;
  message: string;
}

interface Reaction {
  id: string;
  emoji: string;
  left: number;
}

interface LiveStreamModalProps {
  isOpen: boolean;
  roomId: string;
  hostName: string;
  hostAvatarUrl?: string;
  onClose: () => void;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({
  isOpen,
  roomId,
  hostName,
  hostAvatarUrl,
  onClose,
}) => {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const socket = getSocket();
    socket.emit('live:join', { roomId, username: 'You' });

    socket.on('live:chat', (msg: LiveMessage) => {
      setMessages((prev) => [...prev.slice(-40), msg]);
    });

    socket.on('live:reaction', ({ emoji, id }: { emoji: string; id: string }) => {
      const left = Math.floor(Math.random() * 80) + 10;
      setReactions((prev) => [...prev, { id, emoji, left }]);

      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 2000);
    });

    return () => {
      socket.emit('live:leave', { roomId, username: 'You' });
      socket.off('live:chat');
      socket.off('live:reaction');
    };
  }, [isOpen, roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const socket = getSocket();
    socket.emit('live:chat', {
      roomId,
      message: inputText.trim(),
      username: 'You',
    });
    setInputText('');
  };

  const handleSendReaction = (emoji: string) => {
    const socket = getSocket();
    socket.emit('live:reaction', { roomId, emoji });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-md h-[85vh] bg-slate-950 rounded-3xl overflow-hidden flex flex-col border border-slate-800 shadow-2xl">
        
        {/* Floating Reactions Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {reactions.map((r) => (
            <div
              key={r.id}
              className="absolute bottom-20 text-3xl animate-bounce duration-1000 transition-all"
              style={{ left: `${r.left}%` }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Live Header */}
        <div className="p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <img
              src={hostAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={hostName}
              className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
            />
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                {hostName}
                <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Radio className="w-3 h-3" /> LIVE
                </span>
              </h4>
              <p className="text-[11px] text-gray-400">128 viewers watching</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Placeholder */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-center p-6 opacity-60">
            <Radio className="w-16 h-16 text-orange-500 mx-auto mb-2 animate-ping" />
            <p className="text-xs text-slate-300 font-medium">Live Stream Feed Active</p>
          </div>
        </div>

        {/* Live Chat Drawer */}
        <div className="p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-20 space-y-3">
          <div className="h-36 overflow-y-auto space-y-2 text-xs pr-1 no-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className="bg-white/10 backdrop-blur-sm p-2 rounded-xl text-white">
                <span className="font-bold text-orange-400 mr-1.5">{m.username}:</span>
                <span>{m.message}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Reaction Buttons & Chat Form */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSendReaction('❤️')}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-red-500 transition-transform active:scale-125"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <button
                type="button"
                onClick={() => handleSendReaction('🔥')}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-500 transition-transform active:scale-125"
              >
                <Flame className="w-4 h-4 fill-current" />
              </button>
              <button
                type="button"
                onClick={() => handleSendReaction('✨')}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-purple-400 transition-transform active:scale-125"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
              <input
                type="text"
                placeholder="Comment live..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
              />
              <button type="submit" className="text-orange-500 p-1 hover:text-orange-400">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
