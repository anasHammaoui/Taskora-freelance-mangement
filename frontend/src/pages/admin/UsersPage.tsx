import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFreelancers, banUser, activateUser, deleteUser } from '../../store/slices/userSlice';
import type { UserResponse, UserStatus } from '../../types';
import { ConfirmModal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import UserTable from '../../components/admin/UserTable';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{users.length} freelancers</p>
        </div>
      </div>

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

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No users found" description="No freelancers match your search or filter" />
        ) : (
          <UserTable users={filtered} onBan={handleBan} onActivate={handleActivate} onDeleteTarget={setDeleteTarget} />
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
