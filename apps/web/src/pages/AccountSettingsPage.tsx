import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AccountSettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || 'karthik@boundup.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [username, setUsername] = useState(user?.username || 'k2d');

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Account Settings</h1>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#111111]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#111111]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#111111]">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          alert('Account settings updated!');
          navigate(-1);
        }}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
      >
        Save Account Details
      </button>
    </div>
  );
};
