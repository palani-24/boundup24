import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Bell, Check } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { apiFetch } from '../services/api';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch('/notifications');
        if (res.success) {
          setNotifications(res.data.notifications);
          await apiFetch('/notifications/read', { method: 'PATCH' });
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <Heart className="w-4 h-4 text-brand-primary fill-brand-primary" />;
      case 'COMMENT':
        return <MessageCircle className="w-4 h-4 text-blue-500 fill-blue-500/20" />;
      case 'FOLLOW':
      case 'FOLLOW_REQUEST':
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-brand-primary" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-3 select-none">
      <h1 className="text-xl font-extrabold font-heading text-brand-text mb-4">Notifications</h1>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="w-full h-16 bg-white border border-brand-border rounded-16px animate-pulse" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n._id || n.id}
              className={`flex items-center justify-between p-3 bg-white border border-brand-border rounded-16px shadow-soft transition-colors ${
                !n.isRead ? 'border-brand-primary/40 bg-brand-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar src={n.sender.avatarUrl} alt={n.sender.fullName} size="md" />
                <div className="flex flex-col text-xs">
                  <div className="flex items-center gap-1.5">
                    <NavLink to={`/profile/${n.sender.username}`} className="font-bold text-brand-text hover:underline">
                      {n.sender.username}
                    </NavLink>
                    <span className="text-brand-muted">
                      {n.type === 'LIKE' && 'liked your post.'}
                      {n.type === 'COMMENT' && `commented: "${n.text}"`}
                      {n.type === 'FOLLOW' && 'started following you.'}
                      {n.type === 'FOLLOW_REQUEST' && 'sent you a follow request.'}
                    </span>
                  </div>
                  <span className="text-[10px] text-brand-muted mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="p-2 bg-gray-50 rounded-full border border-brand-border/40">
                {getIcon(n.type)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title="No notifications yet"
          description="When people interact with your profile or posts, notifications will appear here."
        />
      )}
    </div>
  );
};
