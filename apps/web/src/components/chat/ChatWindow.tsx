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

  // Initial default active conversation with mock messages
  useEffect(() => {
    if (!activeConv && mockConversations.length > 0) {
      const first = mockConversations[0];
      setActiveConv({
        id: first.id,
        participants: [first.partner],
      } as any);

      setMessages([
        {
          id: 'm1',
          sender: first.partner as any,
          text: 'Hey! Check out this design asset I just created! 🚀',
          mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        } as any,
        {
          id: 'm2',
          sender: { id: user?.id || 'me', fullName: user?.fullName || 'You', avatarUrl: user?.avatarUrl } as any,
          text: 'Wow this looks amazing! Pure BoundUp orange vibe 🔥',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        } as any,
        {
          id: 'm3',
          sender: first.partner as any,
          text: 'Thanks! Let me know if you want to collaborate on the next post.',
          createdAt: new Date(Date.now() - 600000).toISOString(),
        } as any,
      ]);
    }
  }, []);

  return (
    <div className="w-full h-[calc(100vh-100px)] bg-white border border-[#E5E7EB] rounded-24px my-2 shadow-sm card-shadow overflow-hidden grid grid-cols-1 md:grid-cols-12 select-none">
      {/* COLUMN 1: CONVERSATIONS LIST */}
      <div className={`md:col-span-4 border-r border-[#E5E7EB] flex flex-col h-full ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        {/* HEADER & EDIT NEW MESSAGE BUTTON */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="font-extrabold text-xl text-[#111111]">Messages</h2>
          <button
            onClick={() => alert('New Direct Message Modal')}
            className="p-2 text-[#111111] hover:bg-orange-50 rounded-full transition-colors"
            title="New Chat"
          >
            <Smile className="w-5 h-5 text-[#FF5A1F]" />
          </button>
        </div>

        {/* SEARCH INPUT BAR */}
        <div className="p-3 border-b border-[#E5E7EB]">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-3.5 bg-[#F7F7F7] border border-[#E5E7EB] focus:border-[#FF5A1F] rounded-full text-xs text-[#111111] placeholder:text-[#666666] focus:outline-none transition-colors"
          />
        </div>

        {/* CATEGORY FILTER TABS (ALL, DIRECT, GROUPS) */}
        <div className="flex items-center gap-1.5 p-3 border-b border-[#E5E7EB]">
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
                  ? 'bg-[#FF5A1F] text-white shadow-sm'
                  : 'bg-gray-100 text-[#666666] hover:text-[#111111]'
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
                onClick={() => {
                  setActiveConv({
                    id: conv.id,
                    participants: [conv.partner],
                  } as any);

                  setMessages([
                    {
                      id: `m_${conv.id}_1`,
                      sender: conv.partner as any,
                      text: `Hey! Message from @${conv.partner.username}`,
                      createdAt: new Date(Date.now() - 3600000).toISOString(),
                    } as any,
                    {
                      id: `m_${conv.id}_2`,
                      sender: { id: user?.id || 'me', fullName: user?.fullName || 'You', avatarUrl: user?.avatarUrl } as any,
                      text: conv.lastMessageText,
                      createdAt: new Date(Date.now() - 600000).toISOString(),
                    } as any,
                  ]);
                }}
                className={`flex items-center justify-between p-3 rounded-20px cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-orange-50 border border-orange-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative">
                    <Avatar src={conv.partner.avatarUrl} alt={conv.partner.username} size="md" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex flex-col truncate">
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-xs text-[#111111] truncate">
                        {conv.partner.username}
                      </span>
                      {conv.partner.isVerified && <Check className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                    <span className="text-[11px] text-[#666666] font-medium truncate mt-0.5">
                      {conv.lastMessageText} • {conv.time}
                    </span>
                  </div>
                </div>

                {/* UNREAD BADGE */}
                {conv.unreadBadge > 0 && (
                  <span className="w-5 h-5 bg-[#FF5A1F] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
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
            {/* CHAT HEADER WITH PROFILE VISIT ACTION */}
            <header className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
              <div
                onClick={() => {
                  if (otherParticipant?.username) {
                    window.location.href = `/profile/${otherParticipant.username}`;
                  }
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveConv(null);
                  }}
                  className="md:hidden text-[#666666] hover:text-[#111111]"
                >
                  ←
                </button>
                <Avatar src={otherParticipant?.avatarUrl} alt={otherParticipant?.fullName} size="md" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5 group-hover:text-[#FF5A1F] transition-colors">
                    {otherParticipant?.fullName || otherParticipant?.username}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                  </span>
                  <span className="text-[11px] text-[#666666] font-medium">
                    {typingUsers.get(activeConv.id || (activeConv as any)._id) ? 'typing...' : `@${otherParticipant?.username || 'user'}`} • View Profile
                  </span>
                </div>
              </div>

              {/* CALL & PROFILE CONTROLS */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => alert(`Starting audio call with @${otherParticipant?.username}...`)}
                  className="p-2.5 rounded-full hover:bg-orange-50 text-[#FF5A1F] transition-colors"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Starting video call with @${otherParticipant?.username}...`)}
                  className="p-2.5 rounded-full hover:bg-purple-50 text-purple-600 transition-colors"
                  title="Video Call"
                >
                  <VideoCall className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (otherParticipant?.username) {
                      window.location.href = `/profile/${otherParticipant.username}`;
                    }
                  }}
                  className="p-2.5 text-[#666666] hover:text-[#FF5A1F] rounded-full hover:bg-orange-50 transition-colors"
                  title="View Profile"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* MESSAGES LIST */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#FAFAFA]">
              {messages.map((msg) => {
                const isMine = (msg.sender?.id || (msg.sender as any)?._id || (msg.sender as any)) === user?.id;

                return (
                  <div key={msg.id || (msg as any)._id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 group">
                      {!isMine && <Avatar src={msg.sender?.avatarUrl} alt={msg.sender?.fullName} size="sm" />}
                      <div
                        className={`max-w-xs md:max-w-md p-3.5 rounded-24px text-xs leading-relaxed font-medium relative ${
                          isMine
                            ? 'bg-[#FF5A1F] text-white rounded-br-none shadow-sm'
                            : 'bg-white text-[#111111] rounded-bl-none border border-[#E5E7EB] shadow-sm'
                        }`}
                      >
                        {msg.mediaUrl && (
                          <img src={msg.mediaUrl} alt="Attachment" className="w-full h-44 object-cover rounded-16px mb-2 border border-black/10" />
                        )}
                        {msg.text}

                        {/* Heart reaction badge */}
                        <div className="absolute -bottom-2 -right-1 bg-white border border-[#E5E7EB] rounded-full px-1 py-0.5 shadow-sm text-[10px] flex items-center gap-0.5">
                          ❤️
                        </div>
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
                    <span className="text-[10px] text-[#666666] font-medium mt-1.5 px-1">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* MEDIA INPUT EXPANSION */}
            {showMediaInput && (
              <div className="p-3 bg-orange-50 border-t border-[#E5E7EB] flex gap-2">
                <input
                  type="text"
                  placeholder="Paste photo attachment URL..."
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  className="flex-1 h-9 bg-white border border-[#E5E7EB] rounded-12px px-3 text-xs focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
            )}

            {/* MESSAGE INPUT BOX */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E7EB] bg-white flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMediaInput(!showMediaInput)}
                className="p-2 text-[#666666] hover:text-[#FF5A1F] transition-colors"
                title="Attach Photo"
              >
                <Image className="w-5 h-5 text-[#FF5A1F]" />
              </button>

              <input
                type="text"
                placeholder="Message..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="flex-1 h-11 border border-[#E5E7EB] rounded-16px px-4 text-xs font-medium text-[#111111] placeholder:text-[#666666] focus:outline-none focus:border-[#FF5A1F]"
              />

              <button
                type="submit"
                disabled={!textInput.trim() && !mediaUrlInput.trim()}
                className="w-11 h-11 bg-[#FF5A1F] text-white rounded-16px flex items-center justify-center hover:bg-[#e04d16] transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#666666]">
            <User className="w-12 h-12 stroke-[1.5] mb-2 text-[#FF5A1F]" />
            <h3 className="font-extrabold text-[#111111] text-lg">Your Direct Messages</h3>
            <p className="text-xs font-medium">Select a conversation to start chatting in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

