import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchTasksByUser, createTask, updateTask, deleteTask, markTaskDone,
} from '../../store/slices/taskSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import type { TaskResponse } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import type { Resolver } from 'react-hook-form';
import { formatDate } from '../../utils/format';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['A_FAIRE', 'TERMINEE']),
  projectId: z.coerce.number().min(1, 'Select a project'),
});

type FormData = z.infer<typeof schema>;

const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items: tasks, loading } = useAppSelector((s) => s.tasks);
  const { items: projects } = useAppSelector((s) => s.projects);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaskResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { status: 'A_FAIRE' },
  });

  const load = useCallback(() => {
    if (user?.userId) {
      dispatch(fetchTasksByUser({ userId: user.userId, size: 200 }));
      dispatch(fetchProjects({ userId: user.userId }));
    }
  }, [dispatch, user?.userId]);

  useEffect(() => { load(); }, [load]);

  const openCreate = (status: 'A_FAIRE' | 'TERMINEE' = 'A_FAIRE') => {
    setEditing(null);
    reset({ status });
    setModalOpen(true);
  };
  const openEdit = (t: TaskResponse) => {
    setEditing(t);
    reset({ title: t.title, description: t.description || '', dueDate: t.dueDate || '', status: t.status, projectId: t.projectId });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    if (!user?.userId) return;
    const payload = { ...data, userId: user.userId };
    if (editing) {
      const res = await dispatch(updateTask({ id: editing.id, data: payload }));
      if (updateTask.fulfilled.match(res)) { toast.success('Task updated'); setModalOpen(false); }
      else toast.error('Failed to update task');
    } else {
      const res = await dispatch(createTask(payload));
      if (createTask.fulfilled.match(res)) { toast.success('Task created'); setModalOpen(false); }
      else toast.error('Failed to create task');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await dispatch(deleteTask(deleteTarget.id));
    setDeleting(false);
    if (deleteTask.fulfilled.match(res)) { toast.success('Task deleted'); setDeleteTarget(null); }
    else toast.error('Failed to delete');
  };

  const handleMarkDone = async (id: number) => {
    const res = await dispatch(markTaskDone(id));
    if (markTaskDone.fulfilled.match(res)) toast.success('Task completed!');
    else toast.error('Failed to update');
  };

  const todo = tasks.filter((t) => t.status === 'A_FAIRE');
  const done = tasks.filter((t) => t.status === 'TERMINEE');

  const TaskCard: React.FC<{ task: TaskResponse }> = ({ task }) => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 space-y-3 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">{task.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => openEdit(task)} className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={() => setDeleteTarget(task)} className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
      {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{task.description}</p>}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full truncate max-w-[120px]">{task.projectTitle}</span>
        {task.dueDate && (
          <span className="text-xs text-slate-400">{formatDate(task.dueDate)}</span>
        )}
      </div>
      {task.status === 'A_FAIRE' && (
        <button
          onClick={() => handleMarkDone(task.id)}
          className="w-full text-xs text-center text-green-600 hover:text-green-700 font-medium py-1 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          Mark as done
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{tasks.length} total tasks</p>
        </div>
        <Button onClick={() => openCreate()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Task
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-8 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl w-32" />
              {[...Array(3)].map((_, j) => <div key={j} className="h-28 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To do column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">To Do</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{todo.length}</span>
              </div>
              <button onClick={() => openCreate('A_FAIRE')} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            {todo.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
                <p className="text-sm text-slate-400">No tasks to do</p>
                <button onClick={() => openCreate('A_FAIRE')} className="text-sm text-indigo-600 mt-2 hover:underline">Add task</button>
              </div>
            ) : (
              todo.map((t) => <TaskCard key={t.id} task={t} />)
            )}
          </div>

          {/* Done column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Done</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{done.length}</span>
              </div>
              {/* spacer to match To Do header height */}
              <div className="w-7 h-7" />
            </div>
            {done.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
                <p className="text-sm text-slate-400">No completed tasks yet</p>
              </div>
            ) : (
              done.map((t) => <TaskCard key={t.id} task={t} />)
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Task' : 'New Task'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={isSubmitting} onClick={handleSubmit(onSubmit as any)}>{editing ? 'Save' : 'Create Task'}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit as any)}>
          <Input label="Title *" placeholder="Task title" error={errors.title?.message} {...register('title')} />
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
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="A_FAIRE">To Do</option>
                <option value="TERMINEE">Done</option>
              </select>
            </div>
          </div>
          <Input label="Due date" type="date" {...register('dueDate')} />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Task description..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
};

export default TasksPage;
