import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading, setInvoices, setError, addInvoice, updateInvoiceItem, removeInvoice } from '../../store/slices/invoiceSlice';
import { setProjects } from '../../store/slices/projectSlice';
import { invoicesApi } from '../../api/invoices';
import { projectsApi } from '../../api/projects';
import type { InvoiceResponse, InvoiceStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import InvoiceTable from '../../components/invoices/InvoiceTable';
import InvoiceFormModal, { type InvoiceFormData } from '../../components/invoices/InvoiceFormModal';

const STATUS_FILTERS: { value: InvoiceStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'EN_ATTENTE', label: 'Pending' },
  { value: 'PAYEE', label: 'Paid' },
  { value: 'ANNULEE', label: 'Cancelled' },
];

const InvoicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items: invoices, loading } = useAppSelector((s) => s.invoices);
  const { items: projects } = useAppSelector((s) => s.projects);

  const [filter, setFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!user?.userId) return;
    dispatch(setLoading(true));
    try {
      const [invoicesPage, projectsPage] = await Promise.all([
        invoicesApi.getByUser(user.userId),
        projectsApi.getByUser(user.userId),
      ]);
      dispatch(setInvoices(invoicesPage));
      dispatch(setProjects(projectsPage));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to load invoices'));
    }
  }, [dispatch, user?.userId]);

  useEffect(() => { load(); }, [load]);

  const onSave = async (data: InvoiceFormData) => {
    if (!user?.userId) return;
    try {
      const created = await invoicesApi.create({ ...data, userId: user.userId });
      dispatch(addInvoice(created));
      toast.success('Invoice created');
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      const updated = await invoicesApi.markPaid(id);
      dispatch(updateInvoiceItem(updated));
      toast.success('Marked as paid');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update invoice');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      const updated = await invoicesApi.cancel(id);
      dispatch(updateInvoiceItem(updated));
      toast.success('Invoice cancelled');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel invoice');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await invoicesApi.delete(deleteTarget.id);
      dispatch(removeInvoice(deleteTarget.id));
      toast.success('Deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete invoice');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = invoices.filter((inv) => filter === 'ALL' || inv.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Invoices</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{invoices.length} total invoices</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Invoice
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No invoices" description="Create your first invoice" action={<Button size="sm" onClick={() => setModalOpen(true)}>New Invoice</Button>} />
        ) : (
          <InvoiceTable invoices={filtered} onMarkPaid={handleMarkPaid} onCancel={handleCancel} onDeleteTarget={setDeleteTarget} />
        )}
      </div>

      <InvoiceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projects={projects}
        onSave={onSave}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete invoice "${deleteTarget?.invoiceNumber}"? This cannot be undone.`}
      />
    </div>
  );
};

export default InvoicesPage;
