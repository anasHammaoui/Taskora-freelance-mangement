import React from 'react';
import type { ProjectResponse } from '../../types';
import { ProjectStatusBadge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/format';

interface ProjectCardProps {
  project: ProjectResponse;
  onEdit: (p: ProjectResponse) => void;
  onDelete: (p: ProjectResponse) => void;
  onComplete: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project: p, onEdit, onDelete, onComplete }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{p.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.clientName}</p>
      </div>
      <ProjectStatusBadge status={p.status} />
    </div>

    {p.description && (
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{p.description}</p>
    )}

    <div className="grid grid-cols-2 gap-3 text-xs">
      <div>
        <p className="text-slate-400">Budget</p>
        <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
          {p.budget ? formatCurrency(p.budget) : '—'}
        </p>
      </div>
      <div>
        <p className="text-slate-400">End date</p>
        <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(p.endDate)}</p>
      </div>
    </div>

    <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
      {p.status === 'EN_COURS' && (
        <button
          onClick={() => onComplete(p.id)}
          className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Complete
        </button>
      )}
      <div className="ml-auto flex gap-1.5">
        <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={() => onDelete(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default ProjectCard;
