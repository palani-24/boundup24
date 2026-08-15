import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Avatar } from '../components/ui/Avatar';

export const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || 'Karthik K');
  const [username, setUsername] = useState(user?.username || 'k2d');
  const [bio, setBio] = useState(user?.bio || 'Designer • Developer • Dreamer Building products that matter.');
  const [website, setWebsite] = useState(user?.website || 'https://boundup.app');

  const handleSave = () => {
    updateUser({ fullName, username, bio, website } as any);
    alert('Profile updated successfully!');
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Edit Profile</h1>
          <button onClick={handleSave} className="p-2 text-[#FF5A1F] hover:opacity-80">
            <Check className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* AVATAR CHANGE */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Avatar src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'} size="xl" />
            <button className="absolute bottom-0 right-0 p-2 bg-[#FF5A1F] text-white rounded-full border-2 border-white shadow-md">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-extrabold text-[#FF5A1F] cursor-pointer hover:underline">Change Profile Photo</span>
        </div>

        {/* FORM FIELDS */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#111111]">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>

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
            <label className="text-xs font-extrabold text-[#111111]">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F] resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-[#111111]">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
      >
        Save Changes
      </button>
    </div>
  );
};
