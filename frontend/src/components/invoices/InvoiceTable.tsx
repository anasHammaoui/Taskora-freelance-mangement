import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { InvoiceResponse } from '../../types';
import { InvoiceStatusBadge } from '../ui/Badge';
import { downloadInvoicePdf } from '../../utils/downloadInvoicePdf';
import { formatCurrency, formatDate } from '../../utils/format';

interface InvoiceTableProps {
  invoices: InvoiceResponse[];
  onMarkPaid: (id: number) => void;
  onCancel: (id: number) => void;
  onDeleteTarget: (inv: InvoiceResponse) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onMarkPaid, onCancel, onDeleteTarget }) => {
  const navigate = useNavigate();

  return (
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
          {invoices.map((inv) => (
            <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <button
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
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
                      <button onClick={() => onMarkPaid(inv.id)} className="px-2.5 py-1 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                        Mark paid
                      </button>
                      <button onClick={() => onCancel(inv.id)} className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
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
                  <button onClick={() => onDeleteTarget(inv)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
