import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchClients, createClient, updateClient, deleteClient } from '../../store/slices/clientSlice';
import type { ClientResponse } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import ClientFormModal, { type ClientFormData } from '../../components/clients/ClientFormModal';
import ClientTable from '../../components/clients/ClientTable';

const ClientsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items: clients, loading } = useAppSelector((s) => s.clients);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClientResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    if (user?.userId) dispatch(fetchClients({ userId: user.userId, search: search || undefined }));
  }, [dispatch, user?.userId, search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c: ClientResponse) => { setEditing(c); setModalOpen(true); };

  const onSave = async (data: ClientFormData) => {
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

      <div className="relative max-w-sm">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No clients yet"
            description="Create your first client to get started"
            action={<Button onClick={openCreate} size="sm">Add Client</Button>}
          />
        ) : (
          <ClientTable clients={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />
        )}
      </div>

      <ClientFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSave={onSave}
      />

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
