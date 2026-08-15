import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Smile, Trash2, Check, CheckCheck, Info, User, Phone, Video as VideoCall, Flame } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { getSocket } from '../../services/socket';
import { apiFetch } from '../../services/api';
import { IConversation, IMessage } from '@boundup/shared';

interface ChatWindowProps {
  conversationId?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const { user } = useAuthStore();
  const { typingUsers } = useChatStore();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activeConv, setActiveConv] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await apiFetch('/chat/conversations');
        if (res.success) {
          setConversations(res.data.conversations);
          if (conversationId) {
            const found = res.data.conversations.find((c: any) => c.id === conversationId || c._id === conversationId);
            if (found) setActiveConv(found);
          } else if (res.data.conversations.length > 0 && !activeConv) {
            setActiveConv(res.data.conversations[0]);
          }
        }
      } catch (_) {}
    };
    fetchConversations();
  }, [conversationId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;

    const convId = activeConv.id || (activeConv as any)._id;

    const fetchMessages = async () => {
      try {
        const res = await apiFetch(`/chat/conversations/${convId}/messages`);
        if (res.success) {
          setMessages(res.data.messages);
        }
      } catch (_) {}
    };

    fetchMessages();

    // Join Socket room
    const socket = getSocket();
    socket.emit('conversation:join', convId);

    const handleNewMessage = (msg: IMessage) => {
      if (msg.conversationId === convId || (msg as any).conversation === convId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('message:new', handleNewMessage);

    return () => {
      socket.emit('conversation:leave', convId);
      socket.off('message:new', handleNewMessage);
    };
  }, [activeConv]);

  // Auto scroll down
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!textInput.trim() && !mediaUrlInput.trim()) || !activeConv) return;

    const convId = activeConv.id || (activeConv as any)._id;

    try {
      const res = await apiFetch('/chat/messages', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: convId,
          text: textInput,
          mediaUrl: mediaUrlInput || undefined,
          type: mediaUrlInput ? 'IMAGE' : 'TEXT',
        }),
      });

      if (res.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setTextInput('');
        setMediaUrlInput('');
        setShowMediaInput(false);
      }
    } catch (_) {
      alert('Failed to send message');
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      await apiFetch(`/chat/messages/${msgId}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== msgId && (m as any)._id !== msgId));
    } catch (_) {}
  };

  const otherParticipant = activeConv?.participants.find((p) => (p.id || (p as any)._id) !== user?.id);

  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback mock conversations matching Image 1
  const mockConversations = [
    {
      id: 'c1',
      partner: {
        username: 'designhub',
        fullName: 'designhub',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
        isVerified: false,
      },
      lastMessageText: 'Sent a photo',
      time: '2m',
      unreadBadge: 2,
    },
    {
      id: 'c2',
      partner: {
        username: 'creative.soul',
        fullName: 'creative.soul',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        isVerified: false,
      },
      lastMessageText: 'Sounds great! 🔥',
      time: '4m',
      unreadBadge: 0,
    },
    {
      id: 'c3',
      partner: {
        username: 'k2d',
        fullName: 'Karthik K',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        isVerified: true,
      },
      lastMessageText: 'See you soon!',
      time: '1h',
      unreadBadge: 0,
    },
    {
      id: 'c4',
      partner: {
        username: 'ux.mentor',
        fullName: 'ux.mentor',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300',
        isVerified: false,
      },
      lastMessageText: 'Shared a resource',
      time: '3h',
      unreadBadge: 0,
    },
    {
      id: 'c5',
      partner: {
        username: 'travel.diary',
        fullName: 'travel.diary',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300',
        isVerified: false,
      },
      lastMessageText: 'Where next? ✈️',
      time: '1d',
      unreadBadge: 0,
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-100px)] bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px my-2 shadow-sm card-shadow overflow-hidden grid grid-cols-1 md:grid-cols-12 select-none">
      {/* COLUMN 1: CONVERSATIONS LIST */}
      <div className={`md:col-span-4 border-r border-brand-border dark:border-slate-800 flex flex-col h-full ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        {/* HEADER & EDIT NEW MESSAGE BUTTON */}
        <div className="p-4 border-b border-brand-border/60 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-xl text-brand-text dark:text-gray-100">Messages</h2>
          <button
            onClick={() => alert('New Message Modal')}
            className="p-2 text-brand-text dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="New Chat"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH INPUT BAR */}
        <div className="p-3 border-b border-brand-border/40 dark:border-slate-800">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-3.5 bg-gray-100 dark:bg-slate-800 border border-transparent rounded-full text-xs text-brand-text dark:text-gray-100 placeholder:text-brand-muted dark:placeholder:text-slate-400 focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* CATEGORY FILTER TABS (ALL, DIRECT, GROUPS - IMAGE 1) */}
        <div className="flex items-center gap-1.5 p-3 border-b border-brand-border/40 dark:border-slate-800">
          {[
            { id: 'all', label: 'All' },
            { id: 'direct', label: 'Direct' },
            { id: 'groups', label: 'Groups' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-800 text-brand-muted dark:text-slate-400 hover:text-brand-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CONVERSATION LIST ITEMS */}
        <div className="flex-1 overflow-y-auto flex flex-col p-2 gap-1">
          {mockConversations.map((conv) => {
            const isActive = (activeConv?.id || (activeConv as any)?._id) === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() =>
                  setActiveConv({
                    id: conv.id,
                    participants: [conv.partner],
                  } as any)
                }
                className={`flex items-center justify-between p-3 rounded-20px cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-brand-primary/10 border border-brand-primary/20'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative">
                    <Avatar src={conv.partner.avatarUrl} alt={conv.partner.username} size="md" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="flex flex-col truncate">
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-xs text-brand-text dark:text-gray-100 truncate">
                        {conv.partner.username}
                      </span>
                      {conv.partner.isVerified && <Check className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                    <span className="text-[11px] text-brand-muted dark:text-slate-400 font-medium truncate mt-0.5">
                      {conv.lastMessageText} • {conv.time}
                    </span>
                  </div>
                </div>

                {/* UNREAD BADGE */}
                {conv.unreadBadge > 0 && (
                  <span className="w-5 h-5 bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                    {conv.unreadBadge}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN 2: ACTIVE CONVERSATION VIEW */}
      <div className={`md:col-span-8 flex flex-col h-full ${!activeConv ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {activeConv ? (
          <>
            {/* CHAT HEADER */}
            <header className="p-3.5 border-b border-brand-border flex items-center justify-between bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveConv(null)} className="md:hidden text-brand-muted hover:text-brand-text">
                  ←
                </button>
                <Avatar src={otherParticipant?.avatarUrl} alt={otherParticipant?.fullName} size="md" />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-brand-text flex items-center gap-1.5">
                    {otherParticipant?.fullName}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                  </span>
                  <span className="text-[11px] text-brand-primary font-medium">
                    {typingUsers.get(activeConv.id || (activeConv as any)._id) ? 'typing...' : `@${otherParticipant?.username}`}
                  </span>
                </div>
              </div>

              {/* CALL & VANISH MODE CONTROLS */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => alert(`Starting voice call with @${otherParticipant?.username}...`)}
                  className="p-2.5 rounded-full hover:bg-brand-primary/10 text-brand-primary transition-colors"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Starting video call with @${otherParticipant?.username}...`)}
                  className="p-2.5 rounded-full hover:bg-purple-500/10 text-purple-600 transition-colors"
                  title="Video Call"
                >
                  <VideoCall className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const isVanish = !activeConv.isVanishMode;
                    setActiveConv({ ...activeConv, isVanishMode: isVanish });
                  }}
                  className={`p-2.5 rounded-full transition-all ${
                    activeConv.isVanishMode
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'hover:bg-amber-500/10 text-amber-500'
                  }`}
                  title="Toggle Vanish / Disappearing Mode"
                >
                  <Flame className="w-4 h-4" />
                </button>
                <button onClick={() => setShowDetails(!showDetails)} className="p-2.5 text-brand-muted hover:text-brand-text">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* VANISH MODE WARNING BANNER */}
            {activeConv.isVanishMode && (
              <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs font-bold text-amber-700">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                  Vanish Mode Active — Messages disappear after leaving chat
                </span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">Encrypted</span>
              </div>
            )}

            {/* MESSAGES LIST */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/50">
              {messages.map((msg) => {
                const isMine = (msg.sender.id || (msg.sender as any)._id || (msg.sender as any)) === user?.id;

                return (
                  <div key={msg.id || (msg as any)._id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 group">
                      {!isMine && <Avatar src={msg.sender.avatarUrl} alt={msg.sender.fullName} size="sm" />}
                      <div
                        className={`max-w-xs md:max-w-md p-3.5 rounded-24px text-xs leading-relaxed ${
                          isMine ? 'bg-brand-primary text-white rounded-br-none shadow-soft' : 'bg-white text-brand-text rounded-bl-none border border-brand-border'
                        }`}
                      >
                        {msg.mediaUrl && (
                          <img src={msg.mediaUrl} alt="Message media" className="w-full h-40 object-cover rounded-16px mb-2" />
                        )}
                        {msg.text}
                      </div>

                      {isMine && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id || (msg as any)._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded-full transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-brand-muted mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* MEDIA INPUT EXPANSION */}
            {showMediaInput && (
              <div className="p-3 bg-gray-100 border-t border-brand-border flex gap-2">
                <input
                  type="text"
                  placeholder="Image URL attachment..."
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  className="flex-1 h-9 bg-white border border-brand-border rounded-12px px-3 text-xs focus:outline-none"
                />
              </div>
            )}

            {/* MESSAGE INPUT BOX */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-brand-border bg-white flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMediaInput(!showMediaInput)}
                className="p-2 text-brand-muted hover:text-brand-primary transition-colors"
              >
                <Image className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder="Message..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="flex-1 h-11 border border-brand-border rounded-16px px-4 text-xs focus:outline-none focus:border-brand-primary"
              />

              <button
                type="submit"
                disabled={!textInput.trim() && !mediaUrlInput.trim()}
                className="w-11 h-11 bg-brand-primary text-white rounded-16px flex items-center justify-center hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-brand-muted">
            <User className="w-12 h-12 stroke-[1.5] mb-2 text-brand-primary/40" />
            <h3 className="font-bold text-brand-text font-heading text-lg">Your Messages</h3>
            <p className="text-xs">Select a conversation to start messaging in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
};
