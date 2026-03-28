import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading, setSelected, setError, updateInvoiceItem } from '../../store/slices/invoiceSlice';
import { invoicesApi } from '../../api/invoices';
import { InvoiceStatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/format';
import { downloadInvoicePdf } from '../../utils/downloadInvoicePdf';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected: invoice, loading } = useAppSelector((s) => s.invoices);

  useEffect(() => {
    if (!id) return;
    dispatch(setLoading(true));
    invoicesApi.getById(Number(id))
      .then((data) => dispatch(setSelected(data)))
      .catch((err) => dispatch(setError(err.response?.data?.message || 'Failed to load invoice')))
      .finally(() => dispatch(setLoading(false)));
  }, [id, dispatch]);

  const handleMarkPaid = async () => {
    if (!invoice) return;
    try {
      const updated = await invoicesApi.markPaid(invoice.id);
      dispatch(updateInvoiceItem(updated));
      toast.success('Invoice marked as paid');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update invoice');
    }
  };

  const handleCancel = async () => {
    if (!invoice) return;
    try {
      const updated = await invoicesApi.cancel(invoice.id);
      dispatch(updateInvoiceItem(updated));
      toast.success('Invoice cancelled');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel invoice');
    }
  };

  if (loading || !invoice) {
    return (
      <div className="space-y-4">
        <div className="h-8 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl w-48" />
        <div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  const statusBadge = () => <InvoiceStatusBadge status={invoice.status} />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/invoices')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Invoices
        </button>
        <div className="flex items-center gap-2">
          {invoice.status === 'EN_ATTENTE' && (
            <>
              <Button variant="secondary" size="sm" onClick={handleMarkPaid}>Mark as Paid</Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
            </>
          )}
          {invoice.status === 'PAYEE' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadInvoicePdf(invoice)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Invoice card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 space-y-8">
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">Taskora</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Invoice</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{invoice.invoiceNumber}</p>
            {statusBadge()}
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Issued</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Due</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Project</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{invoice.projectTitle}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Freelancer</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{invoice.userFullName}</p>
          </div>
        </div>

        {/* Lines table */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left py-2.5 text-xs text-slate-500 font-medium uppercase tracking-wider">Description</th>
                  <th className="text-right py-2.5 text-xs text-slate-500 font-medium uppercase tracking-wider">Qty</th>
                  <th className="text-right py-2.5 text-xs text-slate-500 font-medium uppercase tracking-wider">Unit Price</th>
                  <th className="text-right py-2.5 text-xs text-slate-500 font-medium uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {invoice.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="py-3 text-slate-800 dark:text-slate-200">{line.description}</td>
                    <td className="py-3 text-right text-slate-500 dark:text-slate-400">{line.quantity}</td>
                    <td className="py-3 text-right text-slate-500 dark:text-slate-400">{formatCurrency(line.unitPrice)}</td>
                    <td className="py-3 text-right font-medium text-slate-900 dark:text-slate-100">{formatCurrency(line.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>Subtotal HT</span><span>{formatCurrency(invoice.totalHT)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>TVA ({invoice.taxRate ? `${invoice.taxRate}%` : '20%'})</span><span>{formatCurrency(invoice.totalTVA)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Total TTC</span><span>{formatCurrency(invoice.totalTTC)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
