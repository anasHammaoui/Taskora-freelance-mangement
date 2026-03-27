import React from 'react';
import type { TaskResponse } from '../../types';
import { formatDate } from '../../utils/format';

interface TaskCardProps {
  task: TaskResponse;
  onEdit: (task: TaskResponse) => void;
  onDelete: (task: TaskResponse) => void;
  onMarkDone: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onMarkDone }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group">
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">{task.title}</h3>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={() => onEdit(task)} className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button onClick={() => onDelete(task)} className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>

    {task.description && (
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{task.description}</p>
    )}

    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full truncate max-w-[120px]">
        {task.projectTitle}
      </span>
      {task.dueDate && (
        <span className="text-xs text-slate-400">{formatDate(task.dueDate)}</span>
      )}
    </div>

    {task.status === 'A_FAIRE' && (
      <button
        onClick={() => onMarkDone(task.id)}
        className="w-full text-xs text-center text-green-600 hover:text-green-700 font-medium py-1 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
      >
        Mark as done
      </button>
    )}
  </div>
);

export default TaskCard;
