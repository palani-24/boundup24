import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { MasonryGrid } from '../components/explore/MasonryGrid';
import { useAuthStore } from '../store/useAuthStore';
import { apiFetch } from '../services/api';
import { IUser, IPost } from '@boundup/shared';

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

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCloseFriendsModal, setShowCloseFriendsModal] = useState(false);

  const [fullNameInput, setFullNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [websiteInput, setWebsiteInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [coverVideoInput, setCoverVideoInput] = useState('');
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
    setCoverVideoInput(profile.coverVideoUrl || '');
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
          coverVideoUrl: coverVideoInput,
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

  const highlights = [
    { title: 'Adventures', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200' },
    { title: 'Workspace', cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200' },
    { title: 'Food', cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-3 select-none flex flex-col gap-6">
      {/* HEADER STATS CARD */}
      <div className="w-full bg-white border border-brand-border rounded-24px p-6 shadow-soft flex flex-col gap-6 relative overflow-hidden">
        {/* ANIMATED / IMAGE COVER BANNER */}
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
                <span className="font-extrabold text-base text-brand-text">{profile.postsCount || 0}</span>
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

        {/* STORY HIGHLIGHTS */}
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-2 border-t border-brand-border/40">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-brand-border flex items-center justify-center text-brand-muted hover:border-brand-primary hover:text-brand-primary transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-brand-muted">New</span>
          </div>

          {highlights.map((h) => (
            <div key={h.title} className="flex flex-col items-center gap-1 cursor-pointer group">
              <div className="w-14 h-14 rounded-full p-[2px] border-2 border-brand-primary">
                <img src={h.cover} alt={h.title} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[11px] font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
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
          className={`flex items-center gap-2 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'grid' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-black/5'
          }`}
        >
          <Grid className="w-4 h-4" /> Posts
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'videos' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-black/5'
          }`}
        >
          <Film className="w-4 h-4" /> Videos
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
              activeTab === 'saved' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-black/5'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved
          </button>
        )}

        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex items-center gap-2 px-4 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'tagged' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-black/5'
          }`}
        >
          <Tag className="w-4 h-4" /> Tagged
        </button>
      </div>

      {/* TAB CONTENT MASONRY / GRID */}
      {posts.length > 0 ? (
        <MasonryGrid posts={posts} />
      ) : (
        <EmptyState
          icon={<Grid className="w-8 h-8" />}
          title="No posts yet"
          description="When posts are published, they will show up here."
        />
      )}

      {/* ADVANCED EDIT PROFILE MODAL */}
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
