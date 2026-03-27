import React from 'react';
import type { TaskResponse } from '../../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  colorClass: string;
  tasks: TaskResponse[];
  onEdit: (task: TaskResponse) => void;
  onDelete: (task: TaskResponse) => void;
  onMarkDone: (id: number) => void;
  onAdd?: () => void;
  emptyMessage: string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  colorClass,
  tasks,
  onEdit,
  onDelete,
  onMarkDone,
  onAdd,
  emptyMessage,
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</span>
        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>

    {tasks.length === 0 ? (
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
        <p className="text-sm text-slate-400">{emptyMessage}</p>
        {onAdd && (
          <button onClick={onAdd} className="text-sm text-indigo-600 mt-2 hover:underline">
            Add task
          </button>
        )}
      </div>
    ) : (
      tasks.map((t) => (
        <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onMarkDone={onMarkDone} />
      ))
    )}
  </div>
);

export default TaskColumn;
