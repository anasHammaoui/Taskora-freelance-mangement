import React from 'react';
import type { ClientResponse } from '../../types';
import { formatDate } from '../../utils/format';

interface ClientTableProps {
  clients: ClientResponse[];
  onEdit: (c: ClientResponse) => void;
  onDelete: (c: ClientResponse) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onEdit, onDelete }) => (
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
        {clients.map((c) => (
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
                <button
                  onClick={() => onEdit(c)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(c)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ClientTable;
