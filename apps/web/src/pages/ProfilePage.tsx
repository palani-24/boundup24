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

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const targetUsername = username || currentUser?.username;
      if (!targetUsername) return;

      const profileRes = await apiFetch(`/users/${targetUsername}`);
      if (profileRes.success) {
        const p = profileRes.data.profile;
        setProfile(p);
        setIsFollowing(profileRes.data.isFollowing);
        setIsFollowPending(profileRes.data.isFollowPending);
        setIsSelf(profileRes.data.isSelf);

        // Fetch posts
        const postsRes = await apiFetch(`/posts/user/${p.id || p._id}`);
        if (postsRes.success) {
          setPosts(postsRes.data.posts);
        }
      }
    } catch (_) {
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
    <div className="w-full max-w-3xl mx-auto py-4 px-3 select-none flex flex-col gap-6">
      {/* HEADER STATS CARD */}
      <div className="w-full bg-white border border-brand-border rounded-24px p-6 shadow-soft flex flex-col gap-6 relative overflow-hidden">
        {/* COVER BANNER */}
        <div className="h-28 -mx-6 -mt-6 bg-gradient-to-r from-brand-primary/20 via-purple-600/20 to-amber-500/20 border-b border-brand-border relative flex items-end justify-end p-3">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20">
            📍 {locationInput} • {pronounsInput}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-12">
          {/* Avatar */}
          <div className="relative">
            <Avatar src={profile.avatarUrl} alt={profile.fullName} size="xl" />
            {profile.isVerified && (
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
                ✓
              </span>
            )}
          </div>

          {/* User Bio & Details */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3 w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="font-heading font-extrabold text-2xl text-brand-text">@{profile.username}</h1>
              {profile.isPrivate && <Lock className="w-4 h-4 text-brand-muted" />}
            </div>

            {/* Stats count */}
            <div className="flex items-center gap-6 py-2 border-y border-brand-border/40 w-full justify-around md:justify-start">
              <div className="flex flex-col items-center md:items-start">
                <span className="font-extrabold text-base text-brand-text">{profile.postsCount || posts.length}</span>
                <span className="text-xs text-brand-muted font-medium">Posts</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="font-extrabold text-base text-brand-text">{profile.followersCount || 0}</span>
                <span className="text-xs text-brand-muted font-medium">Followers</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="font-extrabold text-base text-brand-text">{profile.followingCount || 0}</span>
                <span className="text-xs text-brand-muted font-medium">Following</span>
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex flex-col gap-1.5 mt-1 w-full">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-brand-text">{profile.fullName}</span>
                {profile.isVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-extrabold flex items-center gap-1 border border-blue-500/20">
                    ✓ Verified Creator
                  </span>
                )}
                <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                  {profile.category || 'Software Engineer'}
                </span>
              </div>
              {profile.bio && <p className="text-xs text-brand-muted leading-relaxed mt-0.5">{profile.bio}</p>}

              {/* SOCIAL LINKS TREE (LINKTREE STYLE) */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {(profile.socialLinks || socialLinksInput).map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-12px bg-brand-bg/80 border border-brand-border text-brand-text hover:border-brand-primary hover:text-brand-primary text-[11px] font-extrabold flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Globe className="w-3 h-3 text-brand-primary" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full mt-2">
              {isSelf ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={handleOpenEdit}>
                    <Edit className="w-4 h-4 mr-1.5" /> Edit Profile
                  </Button>
                  <Button variant="ghost" className="p-3" onClick={() => setShowShareModal(true)}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? 'outline' : 'primary'}
                    className="flex-1"
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-1.5" /> Following
                      </>
                    ) : isFollowPending ? (
                      'Requested'
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1.5" /> Follow
                      </>
                    )}
                  </Button>
                  {isFollowing ? (
                    <Button variant="outline" className="flex-1" onClick={handleStartChat}>
                      <MessageSquare className="w-4 h-4 mr-1.5" /> Message
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="flex-1 opacity-60 cursor-not-allowed border border-brand-border"
                      onClick={() => alert(`Follow @${profile.username} first to enable direct messaging.`)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1.5" /> Message (Follow first)
                    </Button>
                  )}
                  <Button variant="ghost" className="p-3" onClick={() => setShowShareModal(true)}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FULLY FUNCTIONAL STORY HIGHLIGHTS ROW */}
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-3 border-t border-brand-border/40">
          {/* ADD NEW HIGHLIGHT BUTTON (OPEN ARCHIVE STORY PICKER) */}
          {isSelf && (
            <div
              onClick={() => setShowCreateHighlightModal(true)}
              className="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0"
              title="Add Story Highlight from Archive"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-brand-primary/60 group-hover:border-brand-primary flex items-center justify-center text-brand-primary bg-brand-primary/5 transition-all transform group-hover:scale-105">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-bold text-brand-primary">New Highlight</span>
            </div>
          )}

          {/* RENDER STORY HIGHLIGHTS */}
          {highlights.map((h) => (
            <div
              key={h.id || h.title}
              onClick={() => {
                setActiveViewerHighlight(h);
                setStoryViewerIndex(0);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0"
            >
              <div className="w-14 h-14 rounded-full p-[2px] border-2 border-brand-primary group-hover:scale-105 transition-transform shadow-sm">
                <img src={h.coverUrl} alt={h.title} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[11px] font-bold text-brand-text group-hover:text-brand-primary transition-colors max-w-[70px] truncate text-center">
                {h.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT TABS */}
      <div className="flex items-center justify-around bg-white border border-brand-border rounded-24px p-2 shadow-soft">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'grid' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:bg-black/5'
          }`}
        >
          <Grid className="w-4 h-4" /> Posts
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'videos' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:bg-black/5'
          }`}
        >
          <Film className="w-4 h-4" /> Videos
        </button>

        <button
          onClick={() => setActiveTab('pinned')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'pinned' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:bg-black/5'
          }`}
        >
          <Pin className="w-4 h-4 text-amber-300" /> Pinned
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
              activeTab === 'saved' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:bg-black/5'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved
          </button>
        )}

        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'tagged' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:bg-black/5'
          }`}
        >
          <Tag className="w-4 h-4" /> Tagged
        </button>
      </div>

      {/* TAB CONTENT MASONRY / GRID */}
      {filteredPosts.length > 0 ? (
        <MasonryGrid posts={filteredPosts} />
      ) : (
        <EmptyState
          icon={<Grid className="w-8 h-8" />}
          title={`No ${activeTab} posts yet`}
          description={`When content is published under ${activeTab}, it will show up here.`}
        />
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
