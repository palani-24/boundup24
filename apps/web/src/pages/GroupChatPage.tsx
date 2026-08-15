import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Users, Camera, Image } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';

export const GroupChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'designhub', text: 'Welcome everyone to the BoundUp Creators Squad!', time: '09:30 AM' },
    { id: '2', sender: 'creative.soul', text: 'Stoked to be here! 🚀', time: '09:32 AM' },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { id: `m_${Date.now()}`, sender: 'Karthik K', text: inputText, time: 'Just now' }]);
    setInputText('');
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between select-none">
      {/* HEADER */}
      <div className="p-3.5 bg-white border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 text-[#111111] hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center font-extrabold text-xs">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-[#111111]">BoundUp Creators Squad</span>
            <span className="text-[10px] text-[#666666]">8 members • 3 online</span>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[75%] ${m.sender === 'Karthik K' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            {m.sender !== 'Karthik K' && <span className="text-[10px] font-bold text-[#FF5A1F] px-1 mb-0.5">{m.sender}</span>}
            <div
              className={`p-3 rounded-20px text-xs leading-relaxed ${
                m.sender === 'Karthik K'
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

      {/* INPUT */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2 sticky bottom-0 z-20">
        <button type="button" className="p-2 text-[#666666] hover:text-[#FF5A1F]">
          <Camera className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Group message..."
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
