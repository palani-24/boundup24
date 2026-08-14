import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, FileText, Flag, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { apiFetch } from '../services/api';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/users'),
        apiFetch('/admin/reports'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data.users);
      if (reportsRes.success) setReports(reportsRes.data.reports);
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    try {
      await apiFetch(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchAdminData();
    } catch (_) {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-3 select-none flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-brand-primary" />
        <h1 className="text-2xl font-extrabold font-heading text-brand-text">Admin Moderation Dashboard</h1>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-border rounded-24px p-4 shadow-soft flex flex-col">
          <div className="flex items-center gap-2 text-brand-muted text-xs font-semibold">
            <Users className="w-4 h-4 text-brand-primary" /> Total Users
          </div>
          <span className="text-2xl font-extrabold text-brand-text mt-1">{stats?.totalUsers || 0}</span>
        </div>

        <div className="bg-white border border-brand-border rounded-24px p-4 shadow-soft flex flex-col">
          <div className="flex items-center gap-2 text-brand-muted text-xs font-semibold">
            <FileText className="w-4 h-4 text-brand-primary" /> Total Posts
          </div>
          <span className="text-2xl font-extrabold text-brand-text mt-1">{stats?.totalPosts || 0}</span>
        </div>

        <div className="bg-white border border-brand-border rounded-24px p-4 shadow-soft flex flex-col">
          <div className="flex items-center gap-2 text-brand-muted text-xs font-semibold">
            <Flag className="w-4 h-4 text-amber-500" /> Pending Reports
          </div>
          <span className="text-2xl font-extrabold text-brand-text mt-1">{stats?.totalReports || 0}</span>
        </div>

        <div className="bg-white border border-brand-border rounded-24px p-4 shadow-soft flex flex-col">
          <div className="flex items-center gap-2 text-brand-muted text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-500" /> Suspended
          </div>
          <span className="text-2xl font-extrabold text-brand-text mt-1">{stats?.suspendedUsers || 0}</span>
        </div>
      </div>

      {/* MODERATION TABS */}
      <div className="flex items-center gap-2 bg-white border border-brand-border rounded-24px p-2 shadow-soft">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'users' ? 'bg-brand-primary text-white' : 'text-brand-muted'
          }`}
        >
          User Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 rounded-16px text-xs font-bold transition-colors ${
            activeTab === 'reports' ? 'bg-brand-primary text-white' : 'text-brand-muted'
          }`}
        >
          Reports Queue ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('ai_flagged' as any)}
          className={`flex-1 py-2 rounded-16px text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
            (activeTab as string) === 'ai_flagged' ? 'bg-purple-600 text-white' : 'text-purple-600 bg-purple-50'
          }`}
        >
          <span>🤖 AI Flagged Queue</span>
        </button>
      </div>

      {/* USER LIST TABLE */}
      {activeTab === 'users' && (
        <div className="bg-white border border-brand-border rounded-24px overflow-hidden shadow-soft p-4">
          <div className="flex flex-col gap-3">
            {users.map((u) => (
              <div
                key={u._id || u.id}
                className="flex items-center justify-between p-3 border-b border-brand-border/40 last:border-0"
              >
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-brand-text">
                    {u.fullName} (@{u.username})
                  </span>
                  <span className="text-brand-muted">{u.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.status === 'SUSPENDED' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {u.status}
                  </span>

                  <Button
                    variant={u.status === 'SUSPENDED' ? 'primary' : 'danger'}
                    size="sm"
                    onClick={() => toggleStatus(u._id || u.id, u.status)}
                  >
                    {u.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS LIST */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-brand-border rounded-24px overflow-hidden shadow-soft p-4">
          {reports.length > 0 ? (
            <div className="flex flex-col gap-3">
              {reports.map((r) => (
                <div key={r._id || r.id} className="p-3 border-b border-brand-border/40 last:border-0 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-text">
                      Reported by @{r.reporter?.username}
                    </span>
                    <span className="text-brand-muted">{r.targetType}</span>
                  </div>
                  <p className="text-brand-muted mt-1">Reason: {r.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-brand-muted text-center py-4">No reports to review.</p>
          )}
        </div>
      )}
    </div>
  );
};
