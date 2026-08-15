import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Image, Mic, Camera } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';

export const DirectChatPage: React.FC = () => {
  const { id = 'designhub' } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'them', text: 'Hey Karthik! Love the new BoundUp mobile designs 🔥', time: '10:14 AM' },
    { id: 'm2', sender: 'me', text: 'Thanks! The Orange & White design system turned out super crisp.', time: '10:15 AM' },
    { id: 'm3', sender: 'them', text: 'Sent a photo of the new UI mockup!', time: '10:16 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { id: `m_${Date.now()}`, sender: 'me', text: inputText, time: 'Just now' }]);
    setInputText('');
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between select-none">
      {/* CHAT HEADER */}
      <div className="p-3.5 bg-white border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 text-[#111111] hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300" size="sm" />
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-[#111111]">@{id}</span>
            <span className="text-[10px] text-[#FF5A1F] font-bold">Online</span>
          </div>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[75%] ${m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div
              className={`p-3 rounded-20px text-xs leading-relaxed ${
                m.sender === 'me'
                  ? 'bg-[#FF5A1F] text-white rounded-br-none shadow-sm'
                  : 'bg-white border border-[#E5E7EB] text-[#111111] rounded-bl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-[#666666] mt-1 px-1">{m.time}</span>
          </div>
        ))}
      </div>

      {/* INPUT FIELD */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2 sticky bottom-0 z-20">
        <button type="button" className="p-2 text-[#666666] hover:text-[#FF5A1F]">
          <Camera className="w-5 h-5" />
        </button>
        <button type="button" className="p-2 text-[#666666] hover:text-[#FF5A1F]">
          <Image className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 py-2 px-3.5 bg-[#F7F7F7] border border-[#E5E7EB] rounded-full text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
        />
        <button type="submit" className="p-2.5 bg-[#FF5A1F] text-white rounded-full shadow-md hover:opacity-90">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
