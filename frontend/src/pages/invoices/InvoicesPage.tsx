import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { downloadInvoicePdf } from '../../utils/downloadInvoicePdf';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchInvoices, createInvoice, markInvoicePaid, cancelInvoice, deleteInvoice,
} from '../../store/slices/invoiceSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import type { Resolver } from 'react-hook-form';
import type { InvoiceResponse, InvoiceStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { InvoiceStatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../utils/format';

const lineSchema = z.object({
  description: z.string().min(1, 'Required'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  unitPrice: z.coerce.number().min(0, 'Must be positive'),
});

const schema = z.object({
  projectId: z.coerce.number().min(1, 'Select a project'),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  lines: z.array(lineSchema).min(1, 'At least one line'),
});
type FormData = z.infer<typeof schema>;

const STATUS_FILTERS: { value: InvoiceStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'EN_ATTENTE', label: 'Pending' },
  { value: 'PAYEE', label: 'Paid' },
  { value: 'ANNULEE', label: 'Cancelled' },
];



const InvoicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { items: invoices, loading } = useAppSelector((s) => s.invoices);
  const { items: projects } = useAppSelector((s) => s.projects);

  const [filter, setFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, watch, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      taxRate: 20,
      lines: [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const watchLines = watch('lines');
  const watchTax = watch('taxRate') || 20;

  const totalHT = watchLines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);
  const totalTVA = totalHT * (watchTax / 100);
  const totalTTC = totalHT + totalTVA;

  const load = useCallback(() => {
    if (user?.userId) {
      dispatch(fetchInvoices({ userId: user.userId }));
      dispatch(fetchProjects({ userId: user.userId }));
    }
  }, [dispatch, user?.userId]);

  useEffect(() => { load(); }, [load]);

  const onSubmit = async (data: FormData) => {
    if (!user?.userId) return;
    const payload = { ...data, userId: user.userId };
    const res = await dispatch(createInvoice(payload));
    if (createInvoice.fulfilled.match(res)) {
      toast.success('Invoice created');
      setModalOpen(false);
      reset();
    } else toast.error('Failed to create invoice');
  };

  const handleMarkPaid = async (id: number) => {
    const res = await dispatch(markInvoicePaid(id));
    if (markInvoicePaid.fulfilled.match(res)) toast.success('Marked as paid');
    else toast.error('Failed');
  };

  const handleCancel = async (id: number) => {
    const res = await dispatch(cancelInvoice(id));
    if (cancelInvoice.fulfilled.match(res)) toast.success('Invoice cancelled');
    else toast.error('Failed');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await dispatch(deleteInvoice(deleteTarget.id));
    setDeleting(false);
    if (deleteInvoice.fulfilled.match(res)) { toast.success('Deleted'); setDeleteTarget(null); }
    else toast.error('Failed to delete');
  };

  const filtered = invoices.filter((inv) => filter === 'ALL' || inv.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Invoices</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{invoices.length} total invoices</p>
        </div>
        <Button onClick={() => { reset({ taxRate: 20, lines: [{ description: '', quantity: 1, unitPrice: 0 }] }); setModalOpen(true); }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Invoice
        </Button>
      </div>

      {/* Filters */}
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No invoices" description="Create your first invoice" action={<Button size="sm" onClick={() => setModalOpen(true)}>New Invoice</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice #</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Project</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Issue Date</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Due Date</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Total TTC</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <button onClick={() => navigate(`/invoices/${inv.id}`)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">{inv.projectTitle}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{formatDate(inv.issueDate)}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{formatDate(inv.dueDate)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(inv.totalTTC)}</td>
                    <td className="px-6 py-4"><InvoiceStatusBadge status={inv.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status === 'EN_ATTENTE' && (
                          <>
                            <button onClick={() => handleMarkPaid(inv.id)} className="px-2.5 py-1 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                              Mark paid
                            </button>
                            <button onClick={() => handleCancel(inv.id)} className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                              Cancel
                            </button>
                          </>
                        )}
                        {inv.status === 'PAYEE' && (
                          <button
                            onClick={() => downloadInvoicePdf(inv)}
                            title="Download PDF"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        )}
                        <button onClick={() => navigate(`/invoices/${inv.id}`)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(inv)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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

      {/* Create Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Invoice"
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={isSubmitting} onClick={handleSubmit(onSubmit as any)}>Create Invoice</Button>
          </>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit as any)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project *</label>
              <select
                {...register('projectId')}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              {errors.projectId && <p className="text-xs text-red-500 mt-1">{errors.projectId.message}</p>}
            </div>
            <Input label="Tax Rate (%)" type="number" defaultValue={20} {...register('taxRate')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issue Date" type="date" {...register('issueDate')} />
            <Input label="Due Date" type="date" {...register('dueDate')} />
          </div>

          {/* Lines */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Invoice Lines</label>
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    <input
                      {...register(`lines.${idx}.description`)}
                      placeholder="Description"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.lines?.[idx]?.description && <p className="text-xs text-red-500 mt-0.5">{errors.lines[idx]?.description?.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <input
                      {...register(`lines.${idx}.quantity`)}
                      type="number"
                      placeholder="Qty"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      {...register(`lines.${idx}.unitPrice`)}
                      type="number"
                      step="0.01"
                      placeholder="Unit price"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-1.5">
                    <span className="text-xs text-slate-500">
                      {formatCurrency((Number(watchLines[idx]?.quantity) || 0) * (Number(watchLines[idx]?.unitPrice) || 0))}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-1">
                    <button type="button" onClick={() => remove(idx)} className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors" disabled={fields.length === 1}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
              className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add line
            </button>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-1.5">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Total HT</span><span>{formatCurrency(totalHT)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>TVA ({watchTax}%)</span><span>{formatCurrency(totalTVA)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-200 dark:border-slate-700">
              <span>Total TTC</span><span>{formatCurrency(totalTTC)}</span>
            </div>
          </div>
        </form>
      </Modal>

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
