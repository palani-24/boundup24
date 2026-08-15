import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Image, Mic, Camera, CheckCheck } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';

export const DirectChatPage: React.FC = () => {
  const { id = 'designhub' } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'them', text: `Hey! Thanks for connecting on BoundUp 🔥`, time: '10:14 AM' },
    { id: 'm2', sender: 'me', text: 'Hey! Glad to connect. The mobile experience feels super fast!', time: '10:15 AM' },
    { id: 'm3', sender: 'them', text: 'Yes, white & orange palette looks amazing! What are you working on?', time: '10:16 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'me',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Trigger realistic real-time automated recipient response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Awesome! I just saw your update 🚀',
        'Sounds great, let me check that out right now!',
        'Got it! Thanks for letting me know ✨',
        'Awesome design! BoundUp is looking super clean.',
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          sender: 'them',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 750);
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen w-full bg-[#FAFAFC] flex flex-col justify-between select-none max-w-3xl mx-auto border-x border-[#E5E7EB] bg-white">
      {/* CHAT HEADER */}
      <div className="p-3 bg-white border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 text-[#111111] hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300" size="sm" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-[#111111]">@{id}</span>
            <span className="text-[10px] text-[#FF5A1F] font-bold">{isTyping ? 'Typing...' : 'Online'}</span>
          </div>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-[#FAFAFC]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div
              className={`p-3 rounded-20px text-xs leading-relaxed font-medium shadow-sm ${
                m.sender === 'me'
                  ? 'bg-[#FF5A1F] text-white rounded-br-none'
                  : 'bg-white border border-[#E5E7EB] text-[#111111] rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
            <div className="flex items-center gap-1 mt-1 px-1 text-[9px] text-[#666666]">
              <span>{m.time}</span>
              {m.sender === 'me' && <CheckCheck className="w-3 h-3 text-[#FF5A1F]" />}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="mr-auto flex items-center gap-1 p-3 bg-white border border-[#E5E7EB] rounded-20px rounded-bl-none shadow-sm">
            <span className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FIELD */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2 sticky bottom-0 z-20">
        <button type="button" className="p-2 text-[#666666] hover:text-[#FF5A1F] transition-colors">
          <Camera className="w-5 h-5" />
        </button>
        <button type="button" className="p-2 text-[#666666] hover:text-[#FF5A1F] transition-colors">
          <Image className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 py-2 px-4 bg-[#F7F7F7] border border-[#E5E7EB] rounded-full text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-[#FF5A1F] text-white rounded-full shadow-md hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
