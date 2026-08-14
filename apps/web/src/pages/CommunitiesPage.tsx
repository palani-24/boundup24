import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ICommunity } from '@boundup/shared';
import { Users, Plus, Search, Sparkles, Check, Radio } from 'lucide-react';

const CATEGORIES = ['All', 'Photography', 'Tech', 'Gaming', 'Art', 'Food', 'Travel', 'Sports'];

export const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', category: 'Tech' });

  useEffect(() => {
    fetchCommunities();
  }, [selectedCategory]);

  const fetchCommunities = async () => {
    try {
      const res = await api.get('/communities', {
        params: { category: selectedCategory, search: searchQuery },
      });
      if (res.data?.communities) {
        setCommunities(res.data.communities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinToggle = async (id: string) => {
    try {
      const res = await api.post(`/communities/${id}/join`);
      if (res.data?.success) {
        setCommunities((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  isJoined: res.data.isJoined,
                  membersCount: res.data.membersCount,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.name) return;

    try {
      const res = await api.post('/communities', newCommunity);
      if (res.data?.community) {
        setCommunities([res.data.community, ...communities]);
        setShowCreateModal(false);
        setNewCommunity({ name: '', description: '', category: 'Tech' });
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create community');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-orange-500" /> Communities & Niches
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Discover and join dedicated topic spaces with fellow creators
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-full bg-orange-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md hover:bg-orange-600 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Space
        </button>
      </div>

      {/* LIVE AUDIO HUDDLES BANNER */}
      <div className="mb-6 p-4 rounded-24px bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-primary text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-20px">
            <Radio className="w-6 h-6 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-[10px] font-extrabold uppercase tracking-wider">LIVE HUDDLE</span>
              <span className="text-xs font-bold text-purple-200">Tech Creators Lounge</span>
            </div>
            <p className="text-xs text-white font-semibold mt-0.5">Topic: Future of AI in Mobile & Web Engineering 🎙️</p>
          </div>
        </div>
        <button
          onClick={() => alert('Joining Live Audio Huddle... Microphone connected!')}
          className="px-4 py-2 bg-white text-purple-900 rounded-16px text-xs font-extrabold hover:bg-purple-50 transition-colors shadow-sm"
        >
          Join Stage
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-100 dark:border-slate-700 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {communities.map((comm) => (
          <div
            key={comm.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500">
                  {comm.category}
                </span>
                <span className="text-xs text-gray-400">{comm.membersCount} members</span>
              </div>

              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 mb-1">{comm.name}</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-4">
                {comm.description || 'No description provided.'}
              </p>
            </div>

            <button
              onClick={() => handleJoinToggle(comm.id)}
              className={`w-full py-2 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                comm.isJoined
                  ? 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
              }`}
            >
              {comm.isJoined ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Joined
                </>
              ) : (
                'Join Community'
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCommunity}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm border border-gray-100 dark:border-slate-700 shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" /> Create New Community
            </h3>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 block mb-1">Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Mobile Photographers"
                value={newCommunity.name}
                onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 block mb-1">Category</label>
              <select
                value={newCommunity.category}
                onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 dark:text-gray-100"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-slate-300 block mb-1">Description</label>
              <textarea
                placeholder="Briefly describe what this space is about..."
                value={newCommunity.description}
                onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 dark:text-gray-100 h-20 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-full bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 shadow-md"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
