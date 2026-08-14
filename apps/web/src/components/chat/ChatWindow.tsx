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

  return (
    <div className="w-full h-[calc(100vh-100px)] bg-white border border-brand-border rounded-24px my-2 shadow-soft overflow-hidden grid grid-cols-1 md:grid-cols-12 select-none">
      {/* COLUMN 1: CONVERSATIONS LIST */}
      <div className={`md:col-span-4 border-r border-brand-border flex flex-col h-full ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-lg text-brand-text">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col p-2 gap-1">
          {conversations.map((conv) => {
            const partner = conv.participants.find((p) => (p.id || (p as any)._id) !== user?.id) || conv.participants[0];
            const isActive = (activeConv?.id || (activeConv as any)?._id) === (conv.id || (conv as any)._id);

            return (
              <div
                key={conv.id || (conv as any)._id}
                onClick={() => setActiveConv(conv)}
                className={`flex items-center gap-3 p-3 rounded-16px cursor-pointer transition-colors ${
                  isActive ? 'bg-brand-primary/10 border border-brand-primary/20' : 'hover:bg-black/5'
                }`}
              >
                <Avatar src={partner?.avatarUrl} alt={partner?.fullName} size="md" />
                <div className="flex flex-col flex-1 truncate">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-brand-text truncate">{partner?.fullName}</span>
                    <span className="text-[10px] text-brand-muted">
                      {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-muted truncate">
                    {conv.lastMessage?.text || 'Started a conversation'}
                  </span>
                </div>
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
