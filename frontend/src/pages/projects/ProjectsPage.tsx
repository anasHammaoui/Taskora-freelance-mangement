import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchProjects, createProject, updateProject, deleteProject, markProjectComplete,
} from '../../store/slices/projectSlice';
import { fetchClients } from '../../store/slices/clientSlice';
import type { ProjectResponse, ProjectStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { ProjectStatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../utils/format';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  budget: z.coerce.number().min(0).optional(),
  status: z.enum(['EN_COURS', 'TERMINE']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  clientId: z.coerce.number().min(1, 'Select a client'),
});

type FormData = z.infer<typeof schema>;

const ProjectsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items: projects, loading } = useAppSelector((s) => s.projects);
  const { items: clients } = useAppSelector((s) => s.clients);

  const [filter, setFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { status: 'EN_COURS' },
  });

  const load = useCallback(() => {
    if (user?.userId) {
      dispatch(fetchProjects({ userId: user.userId }));
      dispatch(fetchClients({ userId: user.userId }));
    }
  }, [dispatch, user?.userId]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); reset({ status: 'EN_COURS', title: '', description: '', budget: 0, startDate: '', endDate: '' }); setModalOpen(true); };
  const openEdit = (p: ProjectResponse) => {
    setEditing(p);
    reset({
      title: p.title,
      description: p.description || '',
      budget: p.budget || 0,
      status: p.status,
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      clientId: p.clientId,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    if (!user?.userId) return;
    const payload = { ...data, userId: user.userId };
    if (editing) {
      const res = await dispatch(updateProject({ id: editing.id, data: payload }));
      if (updateProject.fulfilled.match(res)) { toast.success('Project updated'); setModalOpen(false); }
      else toast.error('Failed to update');
    } else {
      const res = await dispatch(createProject(payload));
      if (createProject.fulfilled.match(res)) { toast.success('Project created'); setModalOpen(false); }
      else toast.error('Failed to create');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await dispatch(deleteProject(deleteTarget.id));
    setDeleting(false);
    if (deleteProject.fulfilled.match(res)) { toast.success('Project deleted'); setDeleteTarget(null); }
    else toast.error('Failed to delete');
  };

  const handleComplete = async (id: number) => {
    const res = await dispatch(markProjectComplete(id));
    if (markProjectComplete.fulfilled.match(res)) toast.success('Marked as complete');
    else toast.error('Failed to update');
  };

  const filtered = projects.filter((p) => filter === 'ALL' || p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{projects.length} total projects</p>
        </div>
        <Button onClick={openCreate}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'EN_COURS', 'TERMINE'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            {s === 'ALL' ? 'All' : s === 'EN_COURS' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No projects found" description="Create your first project or change the filter" action={<Button onClick={openCreate} size="sm">New Project</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{p.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.clientName}</p>
                </div>
                <ProjectStatusBadge status={p.status} />
              </div>
              {p.description && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{p.description}</p>}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400">Budget</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{p.budget ? formatCurrency(p.budget) : '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400">End date</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(p.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                {p.status === 'EN_COURS' && (
                  <button onClick={() => handleComplete(p.id)} className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Complete
                  </button>
                )}
                <div className="ml-auto flex gap-1.5">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Project' : 'New Project'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={isSubmitting} onClick={handleSubmit(onSubmit as any)}>{editing ? 'Save Changes' : 'Create Project'}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit as any)}>
          <Input label="Title *" placeholder="Project name" error={errors.title?.message} {...register('title')} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Client *</label>
              <select {...register('clientId')} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.clientId && <p className="text-xs text-red-500 mt-1">{errors.clientId.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status *</label>
              <select {...register('status')} className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="EN_COURS">In Progress</option>
                <option value="TERMINE">Completed</option>
              </select>
            </div>
          </div>
          <Input label="Budget (€)" type="number" placeholder="5000" {...register('budget')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start date" type="date" {...register('startDate')} />
            <Input label="End date" type="date" {...register('endDate')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea {...register('description')} rows={3} placeholder="Project description..." className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ProjectsPage;
