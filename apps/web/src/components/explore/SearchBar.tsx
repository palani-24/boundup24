import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, User, Hash } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Avatar } from '../ui/Avatar';

interface SearchBarProps {
  onSelectCategory?: (cat: string) => void;
}

export const CATEGORIES = [
  'All',
  'Photography',
  'Travel',
  'Food',
  'Art',
  'Technology',
  'Sports',
  'Fashion',
  'Music',
  'Fitness',
  'Design',
  'Nature',
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCategory }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [results, setResults] = useState<{ users: any[]; posts: any[]; hashtags: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const mockUsers = [
    { id: 'u1', username: 'k2d', fullName: 'Karthik K', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', isVerified: true },
    { id: 'u2', username: 'bigeat', fullName: 'Big Eat Foodie', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300', isVerified: true },
    { id: 'u3', username: 'cyber_sam', fullName: 'Samantha Cyber', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300', isVerified: true },
    { id: 'u4', username: 'elena_vance', fullName: 'Elena Vance', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', isVerified: true },
    { id: 'u5', username: 'chef_dilara', fullName: 'Dilara Gourmet', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300', isVerified: false },
  ];

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiFetch(`/search?q=${encodeURIComponent(query)}`);
        if (res.success && (res.data.users.length > 0 || res.data.hashtags.length > 0)) {
          setResults(res.data);
        } else {
          // Fallback matching mock accounts
          const matched = mockUsers.filter(
            (u) =>
              u.username.toLowerCase().includes(query.toLowerCase()) ||
              u.fullName.toLowerCase().includes(query.toLowerCase())
          );
          setResults({ users: matched, posts: [], hashtags: [{ name: query.replace('#', ''), postCount: 142 }] });
        }
      } catch (_) {
        const matched = mockUsers.filter(
          (u) =>
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.fullName.toLowerCase().includes(query.toLowerCase())
        );
        setResults({ users: matched, posts: [], hashtags: [] });
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (onSelectCategory) onSelectCategory(cat);
  };

  return (
    <div className="w-full flex flex-col gap-4 my-2 select-none">
      {/* SEARCH INPUT BAR */}
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search BoundUp accounts (@k2d, @cyber_sam, @bigeat)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 bg-white border border-[#E5E7EB] rounded-16px pl-12 pr-10 text-sm text-[#111111] placeholder:text-[#666666] focus:outline-none focus:border-[#FF5A1F] shadow-sm transition-colors font-medium"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#111111] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* SEARCH RESULTS DROPDOWN */}
        {results && (
          <div className="absolute top-14 left-0 right-0 bg-white border border-[#E5E7EB] rounded-24px shadow-xl z-50 p-4 max-h-96 overflow-y-auto">
            {isSearching ? (
              <p className="text-xs text-[#666666] text-center py-2">Searching...</p>
            ) : (
              <div className="flex flex-col gap-4">
                {/* USERS */}
                {results.users.length > 0 && (
                  <div>
                    <h4 className="text-xs font-extrabold text-[#666666] uppercase tracking-wider mb-2">Real Accounts</h4>
                    <div className="flex flex-col gap-2">
                      {results.users.map((u) => (
                        <div
                          key={u._id || u.id || u.username}
                          className="flex items-center justify-between p-2 rounded-16px hover:bg-orange-50 transition-colors"
                        >
                          <NavLink to={`/profile/${u.username}`} className="flex items-center gap-3 flex-1">
                            <Avatar src={u.avatarUrl} alt={u.fullName} size="md" />
                            <div className="flex flex-col">
                              <span className="text-xs font-extrabold text-[#111111] hover:underline">@{u.username}</span>
                              <span className="text-[11px] text-[#666666] font-medium">{u.fullName}</span>
                            </div>
                          </NavLink>

                          <div className="flex items-center gap-2">
                            <NavLink
                              to="/messages"
                              className="px-3 py-1.5 bg-[#FF5A1F] text-white rounded-full text-xs font-extrabold hover:bg-[#e04d16] transition-colors"
                            >
                              Message
                            </NavLink>
                            <NavLink
                              to={`/profile/${u.username}`}
                              className="px-3 py-1.5 border border-[#E5E7EB] text-[#111111] rounded-full text-xs font-extrabold hover:bg-gray-100 transition-colors"
                            >
                              View
                            </NavLink>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* HASHTAGS */}
                {results.hashtags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-brand-muted uppercase mb-2">Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.hashtags.map((h) => (
                        <NavLink
                          key={h._id || h.name}
                          to={`/hashtag/${h.name}`}
                          className="flex items-center gap-1 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-semibold hover:bg-brand-primary/20"
                        >
                          <Hash className="w-3 h-3" />
                          <span>{h.name}</span>
                          <span className="text-[10px] opacity-75">({h.postCount})</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}

                {results.users.length === 0 && results.hashtags.length === 0 && (
                  <p className="text-xs text-brand-muted text-center py-4">No matching results found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CATEGORY PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-brand-primary text-white shadow-soft scale-105'
                : 'bg-white border border-brand-border text-brand-text hover:bg-brand-primary/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
