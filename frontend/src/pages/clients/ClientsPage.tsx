import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchClients, createClient, updateClient, deleteClient,
} from '../../store/slices/clientSlice';
import type { ClientResponse } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const Skeleton = () => (
  <div className="animate-pulse space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />
    ))}
  </div>
);

const ClientsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items: clients, loading } = useAppSelector((s) => s.clients);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClientResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const load = useCallback(() => {
    if (user?.userId) dispatch(fetchClients({ userId: user.userId, search: search || undefined }));
  }, [dispatch, user?.userId, search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true); };
  const openEdit = (c: ClientResponse) => {
    setEditing(c);
    reset({ name: c.name, email: c.email || '', phone: c.phone || '', company: c.company || '', address: c.address || '' });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    if (!user?.userId) return;
    const payload = { ...data, userId: user.userId };
    if (editing) {
      const res = await dispatch(updateClient({ id: editing.id, data: payload }));
      if (updateClient.fulfilled.match(res)) { toast.success('Client updated'); setModalOpen(false); }
      else toast.error('Failed to update client');
    } else {
      const res = await dispatch(createClient(payload));
      if (createClient.fulfilled.match(res)) { toast.success('Client created'); setModalOpen(false); }
      else toast.error('Failed to create client');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await dispatch(deleteClient(deleteTarget.id));
    setDeleting(false);
    if (deleteClient.fulfilled.match(res)) { toast.success('Client deleted'); setDeleteTarget(null); }
    else toast.error('Failed to delete client');
  };

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Clients</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{clients.length} total clients</p>
        </div>
        <Button onClick={openCreate}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6"><Skeleton /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No clients yet"
            description="Create your first client to get started"
            action={<Button onClick={openCreate} size="sm">Add Client</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Company</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Email</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden xl:table-cell">Created</th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-semibold">
                          {c.name[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">{c.company || '—'}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{c.email || '—'}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{c.phone || '—'}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden xl:table-cell">{formatDate(c.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Client' : 'New Client'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={isSubmitting} onClick={handleSubmit(onSubmit)}>{editing ? 'Save Changes' : 'Create Client'}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name *" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" placeholder="client@example.com" error={errors.email?.message} {...register('email')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" placeholder="+33 6 12 34 56 78" {...register('phone')} />
            <Input label="Company" placeholder="Acme Inc." {...register('company')} />
          </div>
          <Input label="Address" placeholder="123 Main St, Paris" {...register('address')} />
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ClientsPage;
