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

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiFetch(`/search?q=${encodeURIComponent(query)}`);
        if (res.success) {
          setResults(res.data);
        }
      } catch (_) {
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

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
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search BoundUp (users, hashtags, posts)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 bg-white border border-brand-border rounded-16px pl-12 pr-10 text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-primary shadow-soft transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* SEARCH RESULTS DROPDOWN */}
        {results && (
          <div className="absolute top-14 left-0 right-0 bg-white border border-brand-border rounded-24px shadow-glass z-40 p-4 max-h-96 overflow-y-auto">
            {isSearching ? (
              <p className="text-xs text-brand-muted text-center py-2">Searching...</p>
            ) : (
              <div className="flex flex-col gap-4">
                {/* USERS */}
                {results.users.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-brand-muted uppercase mb-2">Users</h4>
                    <div className="flex flex-col gap-2">
                      {results.users.map((u) => (
                        <NavLink
                          key={u._id || u.id}
                          to={`/profile/${u.username}`}
                          className="flex items-center gap-3 p-2 rounded-12px hover:bg-brand-primary/5 transition-colors"
                        >
                          <Avatar src={u.avatarUrl} alt={u.fullName} size="sm" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-brand-text">@{u.username}</span>
                            <span className="text-[11px] text-brand-muted">{u.fullName}</span>
                          </div>
                        </NavLink>
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
