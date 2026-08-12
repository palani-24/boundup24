import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  BarChart3,
  Award,
  Sparkles,
  ArrowUpRight,
  Video,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const stats = [
    {
      title: 'Total Impressions',
      value: '42,850',
      change: '+18.4%',
      isPositive: true,
      icon: <Eye className="w-5 h-5 text-amber-500" />,
    },
    {
      title: 'Profile Visits',
      value: '3,920',
      change: '+12.1%',
      isPositive: true,
      icon: <Users className="w-5 h-5 text-orange-500" />,
    },
    {
      title: 'Total Engagement',
      value: '8,410',
      change: '+24.5%',
      isPositive: true,
      icon: <Heart className="w-5 h-5 text-red-500" />,
    },
    {
      title: 'Engagement Rate',
      value: '7.8%',
      change: '+2.1%',
      isPositive: true,
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    },
  ];

  const topPosts = [
    {
      id: '1',
      title: 'Golden hour reflections by the coastline 🌊',
      type: 'Photo',
      typeIcon: <ImageIcon className="w-3.5 h-3.5 text-amber-500" />,
      impressions: '14.2k',
      likes: '1,420',
      comments: '84',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '2',
      title: 'Cinematic reel snippet 🔥 Exploring vertical motion',
      type: 'Reel Video',
      typeIcon: <Video className="w-3.5 h-3.5 text-purple-500" />,
      impressions: '28.9k',
      likes: '2,890',
      comments: '156',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '3',
      title: 'Which theme accent feels most comfortable for long coding sessions?',
      type: 'Interactive Poll',
      typeIcon: <MessageSquare className="w-3.5 h-3.5 text-blue-500" />,
      impressions: '8.4k',
      likes: '540',
      comments: '32',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black font-heading tracking-tight">Creator Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Pro Insights
            </span>
          </div>
          <p className="text-xs text-brand-muted mt-1">Real-time performance metrics and audience reach for your BoundUp posts.</p>
        </div>

        {/* TIME RANGE SELECTOR */}
        <div className="flex p-1 bg-brand-border/40 rounded-xl border border-brand-border">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === range ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              Last {range}
            </button>
          ))}
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-brand-surface border border-brand-border shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-muted font-medium">{stat.title}</span>
              <div className="p-2 rounded-xl bg-brand-bg">{stat.icon}</div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xl font-extrabold font-heading">{stat.value}</span>
              <span className="text-xs font-bold text-emerald-500 flex items-center">
                {stat.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT PERFORMANCE BREAKDOWN */}
      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-primary" /> Top Performing Posts
          </h3>
          <span className="text-xs text-brand-muted">Sorted by Reach</span>
        </div>

        <div className="space-y-3">
          {topPosts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl bg-brand-bg/50 border border-brand-border/60 hover:border-brand-border transition-all">
              <img src={post.thumbnail} alt={post.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-muted">
                    {post.typeIcon} {post.type}
                  </span>
                </div>
                <p className="text-xs font-bold text-brand-text truncate">{post.title}</p>
              </div>
              <div className="text-right text-xs space-y-0.5">
                <div className="font-extrabold text-brand-primary">{post.impressions} views</div>
                <div className="text-[11px] text-brand-muted">{post.likes} likes • {post.comments} comments</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUDIENCE CREATOR BADGES */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-orange-500 text-white shadow-lg">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-orange-500 uppercase tracking-wider">Creator Level: Rising Star 🌟</h4>
          <p className="text-xs text-brand-muted mt-0.5">You are in the top 5% of creators on BoundUp this week! Keep sharing reels and stories.</p>
        </div>
      </div>

    </div>
  );
};
