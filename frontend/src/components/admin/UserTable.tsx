import React from 'react';
import type { UserResponse } from '../../types';
import { UserStatusBadge } from '../ui/Badge';
import { formatDate } from '../../utils/format';

interface UserTableProps {
  users: UserResponse[];
  onBan: (id: number) => void;
  onActivate: (id: number) => void;
  onDeleteTarget: (u: UserResponse) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onBan, onActivate, onDeleteTarget }) => (
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
        {users.map((u) => {
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
                      onClick={() => onBan(u.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-colors"
                    >
                      Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(u.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-200 dark:border-green-800 transition-colors"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTarget(u)}
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
);

export default UserTable;
