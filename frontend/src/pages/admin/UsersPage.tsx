import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFreelancers, banUser, activateUser, deleteUser } from '../../store/slices/userSlice';
import type { UserResponse, UserStatus } from '../../types';
import { ConfirmModal } from '../../components/ui/Modal';
import { UserStatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';

const STATUS_FILTERS: { value: UserStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'BANNED', label: 'Banned' },
];

const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: users, loading } = useAppSelector((s) => s.users);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    dispatch(fetchFreelancers({
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      search: search || undefined,
    }));
  }, [dispatch, statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleBan = async (id: number) => {
    const res = await dispatch(banUser(id));
    if (banUser.fulfilled.match(res)) toast.success('User banned');
    else toast.error('Failed to ban user');
  };

  const handleActivate = async (id: number) => {
    const res = await dispatch(activateUser(id));
    if (activateUser.fulfilled.match(res)) toast.success('User activated');
    else toast.error('Failed to activate user');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await dispatch(deleteUser(deleteTarget.id));
    setDeleting(false);
    if (deleteUser.fulfilled.match(res)) { toast.success('User deleted'); setDeleteTarget(null); }
    else toast.error('Failed to delete user');
  };

  const filtered = users.filter((u) => {
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchSearch = !search || u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{users.length} freelancers</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No users found" description="No freelancers match your search or filter" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Role</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filtered.map((u) => {
                  const initials = u.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {initials}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{u.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">{u.email}</td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Freelancer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4"><UserStatusBadge status={u.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleBan(u.id)}
                              className="px-3 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors"
                            >
                              Ban
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(u.id)}
                              className="px-3 py-1 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-200 dark:border-green-800 transition-colors"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User"
        message={`Delete "${deleteTarget?.fullName}"? All their data will be permanently removed.`}
      />
    </div>
  );
};

export default AdminUsersPage;
