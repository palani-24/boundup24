import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Film,
  Bookmark,
  Tag,
  Plus,
  Share2,
  Lock,
  Edit,
  UserCheck,
  UserPlus,
  MessageSquare,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Pin,
  Eye,
  Volume2,
  VolumeX,
  MoreHorizontal,
  CheckCircle,
  Bell,
  ChevronDown,
  Mail,
  Settings,
  QrCode,
  Archive,
  Star,
  Heart,
  Activity,
  Menu,
  Link as LinkIcon,
  User,
  Shield,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { MasonryGrid } from '../components/explore/MasonryGrid';
import { useAuthStore } from '../store/useAuthStore';
import { apiFetch } from '../services/api';
import { IUser, IPost, IStoryHighlight, IStory } from '@boundup/shared';

export const ProfilePage: React.FC = () => {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [isSelf, setIsSelf] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'videos' | 'saved' | 'tagged' | 'pinned'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // STORY HIGHLIGHTS & ARCHIVE STATE
  const [highlights, setHighlights] = useState<IStoryHighlight[]>([
    {
      id: 'h1',
      title: 'Adventures 🌊',
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
      stories: [
        {
          id: 's1',
          author: currentUser || ({ username: 'palani', fullName: 'Palani' } as any),
          mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          mediaType: 'IMAGE' as any,
          caption: 'Golden Coast memories 🌅',
          viewsCount: 142,
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 's2',
          author: currentUser || ({ username: 'palani', fullName: 'Palani' } as any),
          mediaUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
          mediaType: 'IMAGE' as any,
          caption: 'Sunset walks by the pier ✨',
          viewsCount: 98,
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'h2',
      title: 'Workspace 💻',
      coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
      stories: [
        {
          id: 's3',
          author: currentUser || ({ username: 'palani', fullName: 'Palani' } as any),
          mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
          mediaType: 'IMAGE' as any,
          caption: 'Late night coding setup 🚀',
          viewsCount: 230,
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'h3',
      title: 'Foodie 🍣',
      coverUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300',
      stories: [
        {
          id: 's4',
          author: currentUser || ({ username: 'palani', fullName: 'Palani' } as any),
          mediaUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
          mediaType: 'IMAGE' as any,
          caption: 'Best Japanese ramen bowl 🍜',
          viewsCount: 180,
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ]);

  // STORY VIEWER MODAL STATE
  const [activeViewerHighlight, setActiveViewerHighlight] = useState<IStoryHighlight | null>(null);
  const [storyViewerIndex, setStoryViewerIndex] = useState(0);
  const [isViewerMuted, setIsViewerMuted] = useState(false);

  // CREATE NEW HIGHLIGHT ARCHIVE PICKER MODAL STATE
  const [showCreateHighlightModal, setShowCreateHighlightModal] = useState(false);
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);

  // PAST ARCHIVED STORIES (AVAILABLE TO ADD TO HIGHLIGHTS)
  const archivedStories: IStory[] = [
    {
      id: 'arch_1',
      author: currentUser || ({ username: 'palani', fullName: 'Palani' } as any),
      mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      mediaType: 'IMAGE' as any,
      caption: 'Beach morning breeze 🌊',
      viewsCount: 210,
      expiresAt: new Date().toISOString(),
      createdAt: '2026-08-10T10:00:00Z',
    },
    {
      id: 'arch_2',
      author: currentUser || ({ username: 'palani', fullName: 'Palani' } as any),
      mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
      mediaType: 'IMAGE' as any,
      caption: 'City skyline lights 🏙️',
      viewsCount: 340,
      expiresAt: new Date().toISOString(),
      createdAt: '2026-08-08T18:30:00Z',
    },
    {
      id: 'arch_3',
      author: currentUser || ({ username: 'palani', fullName: 'Palani' } as any),
      mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      mediaType: 'IMAGE' as any,
      caption: 'Building React & TypeScript app ⚡',
      viewsCount: 510,
      expiresAt: new Date().toISOString(),
      createdAt: '2026-08-05T14:15:00Z',
    },
    {
      id: 'arch_4',
      author: currentUser || ({ username: 'palani', fullName: 'Palani' } as any),
      mediaUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      mediaType: 'IMAGE' as any,
      caption: 'Weekend brunch 🥑',
      viewsCount: 175,
      expiresAt: new Date().toISOString(),
      createdAt: '2026-08-01T11:00:00Z',
    },
  ];

  // EDIT PROFILE MODAL STATE
  const [isEditing, setIsEditing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [fullNameInput, setFullNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [websiteInput, setWebsiteInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [pronounsInput, setPronounsInput] = useState('He/Him');
  const [locationInput, setLocationInput] = useState('Chennai, TN');
  const [isPrivateInput, setIsPrivateInput] = useState(false);
  const [socialLinksInput, setSocialLinksInput] = useState<{ label: string; url: string }[]>([
    { label: 'Portfolio', url: 'https://boundup.app' },
    { label: 'GitHub', url: 'https://github.com' },
  ]);

  const defaultMockProfile: IUser = {
    id: currentUser?.id || 'mock_u1',
    username: username || currentUser?.username || 'palani',
    fullName: currentUser?.fullName || 'Palani K',
    avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
    bio: 'Product Designer & Full-stack Creator • Building modern web apps. 🚀',
    website: 'https://boundup.app',
    category: 'Product Creator',
    followersCount: 2420,
    followingCount: 340,
    postsCount: 128,
    isVerified: true,
    createdAt: new Date().toISOString(),
  } as any;

  const defaultMockPosts: IPost[] = [
    {
      id: 'p1',
      author: defaultMockProfile as any,
      type: 'IMAGE' as any,
      media: [{ url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', type: 'IMAGE' as any, aspectRatio: '1:1' as any }],
      caption: 'Sunset captured along the southern coast 🌊 #sunset #travel #boundup',
      likesCount: 1240,
      commentsCount: 56,
      isLiked: true,
      createdAt: new Date().toISOString(),
    } as any,
    {
      id: 'p2',
      author: defaultMockProfile as any,
      type: 'IMAGE' as any,
      media: [{ url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', type: 'IMAGE' as any, aspectRatio: '1:1' as any }],
      caption: 'Late night UI engineering setup 💻 #webdev #design #tech',
      likesCount: 980,
      commentsCount: 34,
      isLiked: false,
      createdAt: new Date().toISOString(),
    } as any,
    {
      id: 'p3',
      author: defaultMockProfile as any,
      type: 'IMAGE' as any,
      media: [{ url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', type: 'IMAGE' as any, aspectRatio: '1:1' as any }],
      caption: 'Weekend culinary adventures 🍣 #foodie #art',
      likesCount: 1540,
      commentsCount: 89,
      isLiked: true,
      createdAt: new Date().toISOString(),
    } as any,
  ];

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const targetUsername = username || currentUser?.username || 'palani';
      const profileRes = await apiFetch(`/users/${targetUsername}`);
      if (profileRes.success) {
        const p = profileRes.data.profile;
        setProfile(p);
        setIsFollowing(profileRes.data.isFollowing);
        setIsFollowPending(profileRes.data.isFollowPending);
        setIsSelf(profileRes.data.isSelf);

        const postsRes = await apiFetch(`/posts/user/${p.id || p._id}`);
        if (postsRes.success && postsRes.data.posts.length > 0) {
          setPosts(postsRes.data.posts);
        } else {
          setPosts(defaultMockPosts);
        }
      } else {
        setProfile(defaultMockProfile);
        setPosts(defaultMockPosts);
      }
    } catch (_) {
      setProfile(defaultMockProfile);
      setPosts(defaultMockPosts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username, currentUser]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    const targetId = profile.id || (profile as any)._id;

    try {
      if (isFollowing || isFollowPending) {
        await apiFetch(`/users/${targetId}/follow`, { method: 'DELETE' });
        setIsFollowing(false);
        setIsFollowPending(false);
        setProfile((prev) => (prev ? { ...prev, followersCount: Math.max(0, prev.followersCount - 1) } : null));
      } else {
        const res = await apiFetch(`/users/${targetId}/follow`, { method: 'POST' });
        if (res.data.status === 'ACCEPTED') {
          setIsFollowing(true);
          setProfile((prev) => (prev ? { ...prev, followersCount: prev.followersCount + 1 } : null));
        } else {
          setIsFollowPending(true);
        }
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleOpenEdit = () => {
    if (!profile) return;
    setFullNameInput(profile.fullName);
    setBioInput(profile.bio || '');
    setWebsiteInput(profile.website || '');
    setCategoryInput(profile.category || 'Software Engineer');
    setAvatarUrlInput(profile.avatarUrl || '');
    setIsPrivateInput(profile.isPrivate || false);
    if (profile.socialLinks && profile.socialLinks.length > 0) {
      setSocialLinksInput(profile.socialLinks);
    }
    setIsEditing(true);
  };

  const handleAddSocialLink = () => {
    setSocialLinksInput([...socialLinksInput, { label: 'Social', url: 'https://' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinksInput(socialLinksInput.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async () => {
    try {
      const res = await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: fullNameInput,
          bio: bioInput,
          website: websiteInput,
          category: categoryInput,
          avatarUrl: avatarUrlInput,
          isPrivate: isPrivateInput,
          socialLinks: socialLinksInput,
        }),
      });

      if (res.success) {
        updateUser(res.data.user);
        setProfile(res.data.user);
        setIsEditing(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleStartChat = async () => {
    if (!profile) return;
    try {
      const res = await apiFetch('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ recipientId: profile.id || (profile as any)._id }),
      });
      if (res.success) {
        navigate(`/messages/${res.data.conversation.id || res.data.conversation._id}`);
      }
    } catch (_) {}
  };

  // STORY HIGHLIGHT CREATION HANDLER
  const handleSaveNewHighlight = () => {
    if (!newHighlightTitle.trim()) {
      alert('Please enter a title for your story highlight.');
      return;
    }
    if (selectedStoryIds.length === 0) {
      alert('Please select at least one story from your archive to include in this highlight.');
      return;
    }

    const chosenStories = archivedStories.filter((s) => selectedStoryIds.includes(s.id));
    const coverUrl = chosenStories[0]?.mediaUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300';

    const newHighlightObj: IStoryHighlight = {
      id: `h_${Date.now()}`,
      title: newHighlightTitle,
      coverUrl: coverUrl,
      stories: chosenStories,
    };

    setHighlights((prev) => [...prev, newHighlightObj]);
    setShowCreateHighlightModal(false);
    setNewHighlightTitle('');
    setSelectedStoryIds([]);
  };

  const toggleStorySelection = (storyId: string) => {
    if (selectedStoryIds.includes(storyId)) {
      setSelectedStoryIds(selectedStoryIds.filter((id) => id !== storyId));
    } else {
      setSelectedStoryIds([...selectedStoryIds, storyId]);
    }
  };

  // FILTER POSTS ACCORDING TO ACTIVE TAB
  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'videos') {
      return post.type === 'VIDEO' || (post.media[0]?.type as any) === 'VIDEO';
    }
    if (activeTab === 'saved') {
      return post.isSaved;
    }
    if (activeTab === 'pinned') {
      return post.isPinned;
    }
    return true; // 'grid' or 'tagged' default
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 flex flex-col gap-4">
        <div className="w-full h-40 bg-white border border-brand-border rounded-24px animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <EmptyState
        title="User not found"
        description="The requested profile does not exist or has been removed."
        actionText="Back to Home"
        onAction={() => navigate('/home')}
      />
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 select-none flex flex-col gap-4 bg-white min-h-screen">
      {/* 1. INSTAGRAM TOP NAVIGATION BAR (MATCHING WIREFRAME LEFT PHONE) */}
      <header className="flex items-center justify-between py-2 border-b border-[#E5E7EB] bg-white sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-1.5 text-[#111111] hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1.5 cursor-pointer">
          <Lock className="w-4 h-4 text-[#111111]" />
          <span className="font-extrabold text-base text-[#111111]">{profile.username || 'bigeat'}</span>
          <ChevronDown className="w-4 h-4 text-[#111111]" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateHighlightModal(true)}
            className="text-[#111111] hover:opacity-75 transition-opacity"
            title="Create Post / Story"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <button onClick={() => setShowProfileMenu(true)} className="text-[#111111] hover:opacity-75 transition-opacity" title="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 2. INSTAGRAM AVATAR WITH BLUE PLUS & 3-STAT NUMERICAL COUNTERS */}
      <div className="flex items-center justify-between px-2 pt-2">
        {/* AVATAR WITH BLUE PLUS STORY ADD BADGE (MATCHING WIREFRAME LEFT PHONE) */}
        <div className="relative cursor-pointer group" onClick={() => setShowCreateHighlightModal(true)}>
          <div className="w-20 h-20 sm:w-24 sm:h-24 p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-full shadow-md">
            <Avatar
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
              alt={profile.fullName}
              size="xl"
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
          {/* BLUE PLUS BADGE OVERLAY */}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0095F6] text-white rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        {/* 3 NUMERICAL STAT COUNTERS */}
        <div className="flex items-center justify-around flex-1 ml-4 sm:ml-8">
          <div className="flex flex-col items-center cursor-pointer">
            <span className="font-extrabold text-base sm:text-lg text-[#111111]">{posts.length || 346}</span>
            <span className="text-xs text-[#111111] font-normal">Posts</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <span className="font-extrabold text-base sm:text-lg text-[#111111]">17 k</span>
            <span className="text-xs text-[#111111] font-normal">Followers</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <span className="font-extrabold text-base sm:text-lg text-[#111111]">151</span>
            <span className="text-xs text-[#111111] font-normal">Following</span>
          </div>
        </div>
      </div>

      {/* 3. BIO INFORMATION SECTION */}
      <div className="flex flex-col gap-1.5 px-2 pt-1">
        <h1 className="font-bold text-xs text-[#111111]">
          {profile.fullName || 'Dilara'} | Sell premium offers without being salesy
        </h1>

        <div className="text-xs text-[#111111] font-normal space-y-0.5 leading-relaxed">
          <p>💰 Experts, coaches, consultants - sell $5K-20K offers without being salesy or burnout</p>
          <p>💯 We work till you hit ROI</p>
          <p>⚡ Double your close rate in 15 mins</p>
        </div>

        {/* CLICKABLE LINK */}
        <a
          href="https://bit.ly/thesalesmultiplier"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-[#00376B] hover:underline flex items-center gap-1 mt-0.5"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          bit.ly/thesalesmultiplier
        </a>

        {/* MUTUAL FOLLOWERS */}
        <div className="flex items-center gap-2 mt-2 pt-1 text-xs text-[#666666]">
          <div className="flex -space-x-1.5 overflow-hidden">
            <img className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Mutual 1" />
            <img className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Mutual 2" />
            <img className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Mutual 3" />
          </div>
          <span>Followed by <strong className="text-[#111111]">theharryneedham</strong>, <strong className="text-[#111111]">thesenuka</strong> and <strong className="text-[#111111]">26 others</strong></span>
        </div>
      </div>

      {/* 4. ACTION BUTTONS ROW */}
      <div className="grid grid-cols-12 gap-2 px-2 pt-2">
        <button
          onClick={handleFollowToggle}
          className="col-span-4 py-2 bg-[#EFEFEF] hover:bg-[#DBDBDB] text-[#111111] rounded-12px text-xs font-extrabold flex items-center justify-center gap-1 transition-colors"
        >
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleStartChat}
          className="col-span-4 py-2 bg-[#EFEFEF] hover:bg-[#DBDBDB] text-[#111111] rounded-12px text-xs font-extrabold text-center transition-colors"
        >
          Message
        </button>

        <button
          onClick={() => alert('Sending email...')}
          className="col-span-3 py-2 bg-[#EFEFEF] hover:bg-[#DBDBDB] text-[#111111] rounded-12px text-xs font-extrabold text-center transition-colors"
        >
          Email
        </button>

        <button
          onClick={() => alert('Suggested accounts')}
          className="col-span-1 py-2 bg-[#EFEFEF] hover:bg-[#DBDBDB] text-[#111111] rounded-12px flex items-center justify-center transition-colors"
        >
          <UserPlus className="w-4 h-4" />
        </button>
      </div>

      {/* 5. STORY HIGHLIGHTS ROW */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar px-2 py-3 border-b border-[#E5E7EB]">
        {[
          { title: 'Free guide', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300' },
          { title: 'Testimonials', cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300' },
          { title: 'Start here', cover: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300' },
          { title: 'Work with us', cover: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300' },
        ].map((h) => (
          <div key={h.title} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
            <div className="w-16 h-16 rounded-full p-[2px] border-2 border-[#1572A1] shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center bg-teal-50">
              <img src={h.cover} alt={h.title} className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-[11px] text-[#111111] font-normal truncate max-w-[70px]">{h.title}</span>
          </div>
        ))}

        <div
          onClick={() => setShowCreateHighlightModal(true)}
          className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#111111]">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[11px] text-[#111111] font-normal">New</span>
        </div>
      </div>

      {/* 6. CONTENT TABS (GRID ▦, REELS 🎬, TAGGED 👤) */}
      <div className="flex items-center justify-around border-b border-[#E5E7EB]">
        {[
          { id: 'grid', label: 'Posts', icon: Grid },
          { id: 'videos', label: 'Reels', icon: Film },
          { id: 'tagged', label: 'Tagged', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === (tab.id as any);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 flex items-center justify-center transition-colors relative ${
                isActive ? 'text-[#111111]' : 'text-[#8E8E8E]'
              }`}
            >
              <Icon className="w-6 h-6" />
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 7. 3-COLUMN SQUARE MEDIA GRID */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-0.5">
          {filteredPosts.map((post) => (
            <div key={post.id} className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer group">
              <img
                src={post.media[0]?.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'}
                alt={post.caption || 'Post image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {post.type === 'VIDEO' && (
                <Film className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow-md" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Grid className="w-8 h-8" />}
          title={`No ${activeTab} posts yet`}
          description={`When content is published under ${activeTab}, it will show up here.`}
        />
      )}

      {/* 8. INSTAGRAM SETTINGS & ACTIVITY DRAWER MODAL */}
      {showProfileMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center select-none" onClick={() => setShowProfileMenu(false)}>
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-[#E5E7EB]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HANDLE DRAG BAR */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* INSTAGRAM DRAWER MENU ITEMS */}
            <div className="p-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-[#111111] hover:bg-gray-100 rounded-16px transition-colors text-left"
              >
                <Settings className="w-5 h-5 text-[#111111]" />
                <span>Settings and privacy</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert('Opening Your Activity analytics...');
                }}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-[#111111] hover:bg-gray-100 rounded-16px transition-colors text-left"
              >
                <Activity className="w-5 h-5 text-[#111111]" />
                <span>Your activity</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert('Opening Archive...');
                }}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-[#111111] hover:bg-gray-100 rounded-16px transition-colors text-left"
              >
                <Archive className="w-5 h-5 text-[#111111]" />
                <span>Archive</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert('Generating your Instagram QR Code...');
                }}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-[#111111] hover:bg-gray-100 rounded-16px transition-colors text-left"
              >
                <QrCode className="w-5 h-5 text-[#111111]" />
                <span>QR code</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveTab('saved' as any);
                }}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-[#111111] hover:bg-gray-100 rounded-16px transition-colors text-left"
              >
                <Bookmark className="w-5 h-5 text-[#111111]" />
                <span>Saved</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert('Close Friends list opened.');
                }}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-[#111111] hover:bg-gray-100 rounded-16px transition-colors text-left"
              >
                <Star className="w-5 h-5 text-emerald-500" />
                <span>Close Friends</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert('Favorites updated.');
                }}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-[#111111] hover:bg-gray-100 rounded-16px transition-colors text-left"
              >
                <Heart className="w-5 h-5 text-[#FF5A1F]" />
                <span>Favorites</span>
              </button>

              <div className="my-2 border-t border-[#E5E7EB]" />

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  alert('Meta Accounts Center');
                }}
                className="flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-16px transition-colors text-left"
              >
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Accounts Center</span>
              </button>

              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full mt-2 py-3 bg-gray-100 hover:bg-gray-200 text-[#111111] font-bold rounded-16px text-xs text-center transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN STORY HIGHLIGHT VIEWER MODAL */}
      {activeViewerHighlight && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
          <div className="relative w-full max-w-sm h-[85vh] bg-slate-950 rounded-24px overflow-hidden flex flex-col justify-between shadow-2xl border border-white/20">
            {/* PROGRESS BARS TOP */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {activeViewerHighlight.stories.map((s, idx) => (
                <div key={s.id || idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      idx < storyViewerIndex
                        ? 'w-full'
                        : idx === storyViewerIndex
                        ? 'w-full animate-pulse'
                        : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* HEADER USER INFO */}
            <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Avatar src={profile.avatarUrl} alt={profile.fullName} size="sm" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs">@{profile.username}</span>
                  <span className="text-[10px] text-gray-300">{activeViewerHighlight.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsViewerMuted(!isViewerMuted)} className="p-1.5 bg-black/50 rounded-full">
                  {isViewerMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <button
                  onClick={() => setActiveViewerHighlight(null)}
                  className="p-1.5 bg-black/50 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* STORY MEDIA CONTENT */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {(activeViewerHighlight.stories[storyViewerIndex]?.mediaType as any) === 'VIDEO' ? (
                <video
                  src={activeViewerHighlight.stories[storyViewerIndex].mediaUrl}
                  autoPlay
                  loop
                  muted={isViewerMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeViewerHighlight.stories[storyViewerIndex]?.mediaUrl}
                  alt="Highlight story media"
                  className="w-full h-full object-cover"
                />
              )}

              {/* CAPTION OVERLAY */}
              {activeViewerHighlight.stories[storyViewerIndex]?.caption && (
                <div className="absolute bottom-6 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-16px text-center border border-white/10 z-20">
                  <p className="text-xs font-bold text-white leading-relaxed">
                    {activeViewerHighlight.stories[storyViewerIndex].caption}
                  </p>
                </div>
              )}

              {/* NAV LEFT / RIGHT CONTROLS */}
              {storyViewerIndex > 0 && (
                <button
                  onClick={() => setStoryViewerIndex(storyViewerIndex - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 z-30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {storyViewerIndex < activeViewerHighlight.stories.length - 1 && (
                <button
                  onClick={() => setStoryViewerIndex(storyViewerIndex + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 z-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW STORY HIGHLIGHT MODAL (ARCHIVE STORY PICKER) */}
      {showCreateHighlightModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-24px max-w-lg w-full p-6 shadow-glass flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-primary" />
                <h3 className="text-lg font-extrabold text-brand-text font-heading">New Story Highlight</h3>
              </div>
              <button onClick={() => setShowCreateHighlightModal(false)} className="text-brand-muted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-extrabold text-brand-text mb-1 block">Highlight Name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Travels 🌴, Tech Projects 🚀"
                  value={newHighlightTitle}
                  onChange={(e) => setNewHighlightTitle(e.target.value)}
                  className="w-full h-10 border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-brand-text mb-1 block">
                  Select Stories from Archive ({selectedStoryIds.length} selected)
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 border border-brand-border rounded-16px">
                  {archivedStories.map((story) => {
                    const isSelected = selectedStoryIds.includes(story.id);
                    return (
                      <div
                        key={story.id}
                        onClick={() => toggleStorySelection(story.id)}
                        className={`relative h-28 rounded-12px overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected ? 'border-brand-primary ring-2 ring-brand-primary/30 scale-95' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={story.mediaUrl} alt="Archived story" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-1.5 flex flex-col justify-between">
                          <div className="flex justify-end">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                isSelected ? 'bg-brand-primary text-white' : 'bg-black/40 text-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                          <span className="text-[10px] text-white font-bold truncate flex items-center gap-1">
                            <Eye className="w-3 h-3 text-amber-300" /> {story.viewsCount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
              <Button variant="ghost" onClick={() => setShowCreateHighlightModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveNewHighlight}>
                Add Highlight to Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-24px max-w-lg w-full p-6 shadow-glass flex flex-col gap-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-lg font-extrabold text-brand-text font-heading">Edit Profile Options</h3>
              <span className="text-xs text-brand-primary font-bold">@boundup</span>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-extrabold text-brand-text mb-1 block">Avatar Picture URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrlInput}
                  onChange={(e) => setAvatarUrlInput(e.target.value)}
                  className="w-full h-10 border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-brand-text mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full h-10 border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-brand-text mb-1 block">Bio Description</label>
                <textarea
                  placeholder="Bio (max 150 chars)"
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full border border-brand-border rounded-12px p-3 text-xs focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-brand-text mb-1 block">Category</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full h-10 border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary bg-white"
                  >
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Designer">Designer</option>
                    <option value="Gamer">Gamer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-brand-text mb-1 block">Pronouns</label>
                  <input
                    type="text"
                    placeholder="e.g. He/Him, They/Them"
                    value={pronounsInput}
                    onChange={(e) => setPronounsInput(e.target.value)}
                    className="w-full h-10 border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-brand-text mb-1 block">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Chennai, TN / San Francisco"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full h-10 border border-brand-border rounded-12px px-3 text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* SOCIAL LINKS TREE EDITOR */}
              <div className="p-3 bg-gray-50 rounded-16px border border-brand-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-brand-text">Social Links Tree</span>
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="text-[10px] font-bold text-brand-primary hover:underline"
                  >
                    + Add Link
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {socialLinksInput.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. GitHub)"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...socialLinksInput];
                          updated[idx].label = e.target.value;
                          setSocialLinksInput(updated);
                        }}
                        className="w-1/3 h-8 border border-brand-border rounded-8px px-2 text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="URL (https://...)"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...socialLinksInput];
                          updated[idx].url = e.target.value;
                          setSocialLinksInput(updated);
                        }}
                        className="flex-1 h-8 border border-brand-border rounded-8px px-2 text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(idx)}
                        className="text-red-500 text-xs font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACCOUNT PRIVACY TOGGLE */}
              <div className="flex items-center justify-between p-3 bg-brand-primary/5 rounded-16px border border-brand-primary/20">
                <div>
                  <p className="text-xs font-extrabold text-brand-text">Private Account</p>
                  <p className="text-[10px] text-brand-muted">Require follow approval before people can view posts</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivateInput}
                  onChange={(e) => setIsPrivateInput(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE PROFILE / QR CODE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-24px max-w-sm w-full p-6 shadow-glass flex flex-col items-center text-center gap-4">
            <h3 className="text-base font-extrabold text-brand-text font-heading">Share @{profile.username} Profile</h3>
            <div className="p-4 bg-gradient-to-br from-brand-primary to-purple-600 rounded-24px shadow-md text-white flex flex-col items-center">
              <div className="w-36 h-36 bg-white p-2 rounded-16px flex items-center justify-center shadow-inner mb-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://boundup.app/profile/${profile.username}`}
                  alt="Profile QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-extrabold tracking-wider">BOUNDUP CREATOR PASS</span>
            </div>
            <p className="text-xs text-brand-muted">Scan QR code or copy direct profile URL to invite friends.</p>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(`https://boundup.app/profile/${profile.username}`);
                  alert('Profile URL copied to clipboard!');
                }}
              >
                Copy Link
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => setShowShareModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
