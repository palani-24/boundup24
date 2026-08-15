import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Check,
  Globe,
  User,
  AtSign,
  FileText,
  Tag,
  Smile,
  Lock,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Shield,
  Briefcase,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Avatar } from '../components/ui/Avatar';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300',
];

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000',
];

const CATEGORIES = [
  'Software Engineer',
  'Content Creator',
  'Digital Artist',
  'Photographer',
  'Entrepreneur',
  'UI/UX Designer',
  'Gamer & Streamer',
  'Musician & Producer',
  'Fitness Coach',
  'Fashion & Style',
  'Traveler & Vlogger',
  'Student',
];

export const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  // State for all edit profile options
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
  );
  const [coverUrl, setCoverUrl] = useState(
    (user as any)?.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000'
  );
  const [fullName, setFullName] = useState(user?.fullName || 'Karthik K');
  const [username, setUsername] = useState(user?.username || 'k2d');
  const [bio, setBio] = useState(
    user?.bio || 'Designer • Developer • Dreamer 🚀 Building products that matter for creators worldwide.'
  );
  const [category, setCategory] = useState((user as any)?.category || 'Software Engineer');
  const [pronouns, setPronouns] = useState((user as any)?.pronouns || 'He/Him');
  const [website, setWebsite] = useState(user?.website || 'https://boundup.app');
  const [gender, setGender] = useState((user as any)?.gender || 'Prefer not to say');
  const [email, setEmail] = useState(user?.email || 'karthik@boundup.com');
  const [phone, setPhone] = useState((user as any)?.phone || '+91 98765 43210');

  // Privacy & Display Toggles
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [isProfessional, setIsProfessional] = useState((user as any)?.isProfessional || true);
  const [showCategory, setShowCategory] = useState((user as any)?.showCategory !== false);

  // Social Links Tree
  const [socialLinks, setSocialLinks] = useState<{ label: string; url: string }[]>(
    (user as any)?.socialLinks || [
      { label: 'GitHub', url: 'https://github.com/palani-24' },
      { label: 'Portfolio', url: 'https://k2d.dev' },
      { label: 'Twitter', url: 'https://twitter.com/k2d_dev' },
    ]
  );

  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'privacy'>('profile');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { label: '', url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateUser({
      avatarUrl,
      fullName,
      username,
      bio,
      website,
      isPrivate,
      coverUrl,
      category,
      pronouns,
      gender,
      email,
      phone,
      isProfessional,
      showCategory,
      socialLinks,
    } as any);

    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none pb-24 max-w-2xl mx-auto">
      {/* SUCCESS TOAST */}
      {showSavedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#FF5A1F]" />
          <span className="text-xs font-extrabold">Profile updated successfully!</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 bg-white p-3 rounded-20px shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-[#111111] hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-extrabold font-heading text-[#111111]">Edit Profile & Options</h1>
            <span className="text-[10px] text-[#FF5A1F] font-bold">@{username}</span>
          </div>
          <button
            onClick={handleSave}
            className="p-2 bg-[#FF5A1F] text-white hover:bg-[#e04d16] rounded-full shadow-md transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-16px border border-[#E5E7EB] shadow-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 text-xs font-extrabold rounded-12px transition-all ${
              activeTab === 'profile'
                ? 'bg-[#FF5A1F] text-white shadow-sm'
                : 'text-[#666666] hover:bg-gray-100'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`py-2 text-xs font-extrabold rounded-12px transition-all ${
              activeTab === 'links'
                ? 'bg-[#FF5A1F] text-white shadow-sm'
                : 'text-[#666666] hover:bg-gray-100'
            }`}
          >
            Social Links
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-2 text-xs font-extrabold rounded-12px transition-all ${
              activeTab === 'privacy'
                ? 'bg-[#FF5A1F] text-white shadow-sm'
                : 'text-[#666666] hover:bg-gray-100'
            }`}
          >
            Privacy & Options
          </button>
        </div>

        {/* TAB 1: PROFILE INFO & MEDIA */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-6">
            {/* COVER BANNER & AVATAR PICKER */}
            <div className="bg-white border border-[#E5E7EB] rounded-24px p-4 shadow-sm flex flex-col gap-4">
              <span className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#FF5A1F]" /> Cover Banner & Profile Picture
              </span>

              {/* COVER BANNER PREVIEW */}
              <div className="relative w-full h-28 rounded-20px overflow-hidden border border-[#E5E7EB]">
                <img src={coverUrl} alt="Cover Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="text-[10px] font-extrabold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                    Cover Banner Active
                  </span>
                </div>
              </div>

              {/* BANNER PRESET SELECTOR */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {PRESET_BANNERS.map((banner, i) => (
                  <button
                    key={i}
                    onClick={() => setCoverUrl(banner)}
                    className={`w-14 h-9 rounded-8px overflow-hidden border-2 flex-shrink-0 transition-transform ${
                      coverUrl === banner ? 'border-[#FF5A1F] scale-105 shadow-md' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={banner} className="w-full h-full object-cover" alt={`Preset ${i}`} />
                  </button>
                ))}
              </div>

              {/* AVATAR PICKER */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="relative">
                  <Avatar src={avatarUrl} size="xl" className="ring-4 ring-[#FF5A1F]/20" />
                  <button className="absolute bottom-0 right-0 p-2 bg-[#FF5A1F] text-white rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {PRESET_AVATARS.map((av, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatarUrl(av)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all ${
                        avatarUrl === av ? 'border-[#FF5A1F] scale-110 shadow-md' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={av} className="w-full h-full object-cover" alt={`Avatar ${i}`} />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Paste Profile Photo URL (https://...)"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full h-9 bg-[#F7F7F7] border border-[#E5E7EB] rounded-12px px-3 text-[11px] text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
            </div>

            {/* IDENTITY & BIO FIELDS */}
            <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF5A1F]" /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-[#FF5A1F]" /> Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-2.5 pl-7 pr-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#666666]">
                    @
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FF5A1F]" /> Bio Description
                  </label>
                  <span className="text-[10px] text-[#666666] font-bold">{150 - bio.length} chars left</span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 150))}
                  rows={3}
                  className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F] resize-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#FF5A1F]" /> Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-[#FF5A1F]" /> Pronouns
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. He/Him, She/Her"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#FF5A1F]" /> Primary Website Link
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOCIAL LINKS TREE */}
        {activeTab === 'links' && (
          <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-xs font-extrabold text-[#111111]">Social Links Tree</h3>
                <p className="text-[11px] text-[#666666]">Add external links to showcase on your profile bio.</p>
              </div>
              <button
                type="button"
                onClick={handleAddSocialLink}
                className="px-3 py-1.5 bg-[#FF5A1F] text-white rounded-full text-xs font-extrabold flex items-center gap-1 hover:bg-[#e04d16] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {socialLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px">
                  <input
                    type="text"
                    placeholder="Platform (GitHub, YouTube)"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].label = e.target.value;
                      setSocialLinks(updated);
                    }}
                    className="w-1/3 py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-12px text-xs font-extrabold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                  />
                  <input
                    type="text"
                    placeholder="URL (https://...)"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[idx].url = e.target.value;
                      setSocialLinks(updated);
                    }}
                    className="flex-1 py-2 px-2.5 bg-white border border-[#E5E7EB] rounded-12px text-xs font-medium text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialLink(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRIVACY & OPTIONS */}
        {activeTab === 'privacy' && (
          <div className="flex flex-col gap-6">
            {/* ACCOUNT CONTROLS */}
            <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#FF5A1F]" /> Account Privacy & Visibility
              </h3>

              <div className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-16px border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-[#FF5A1F] rounded-12px">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-[#111111]">Private Account</span>
                    <span className="text-[10px] text-[#666666]">Only approved followers can see your posts.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-5 h-5 accent-[#FF5A1F] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-16px border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-[#FF5A1F] rounded-12px">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-[#111111]">Professional Creator Account</span>
                    <span className="text-[10px] text-[#666666]">Unlock analytics, insights & monetization features.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isProfessional}
                  onChange={(e) => setIsProfessional(e.target.checked)}
                  className="w-5 h-5 accent-[#FF5A1F] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-16px border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-[#FF5A1F] rounded-12px">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-[#111111]">Show Category Label</span>
                    <span className="text-[10px] text-[#666666]">Display "{category}" badge on your profile.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showCategory}
                  onChange={(e) => setShowCategory(e.target.checked)}
                  className="w-5 h-5 accent-[#FF5A1F] cursor-pointer"
                />
              </div>
            </div>

            {/* PERSONAL CONTACT INFORMATION */}
            <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#FF5A1F]" /> Personal Contact Information
              </h3>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF5A1F]" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-[#111111] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF5A1F]" /> Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-[#111111]">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs font-bold text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SAVE BUTTON FOOTER */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 mt-6 bg-[#FF5A1F] text-white rounded-20px text-xs font-extrabold shadow-lg hover:bg-[#e04d16] transition-all transform active:scale-95 flex items-center justify-center gap-2"
      >
        <Check className="w-4 h-4 stroke-[3]" /> Save All Profile Options
      </button>
    </div>
  );
};
