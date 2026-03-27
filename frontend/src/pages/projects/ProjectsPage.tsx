import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProjects, createProject, updateProject, deleteProject, markProjectComplete } from '../../store/slices/projectSlice';
import { fetchClients } from '../../store/slices/clientSlice';
import type { ProjectResponse, ProjectStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectFormModal, { type ProjectFormData } from '../../components/projects/ProjectFormModal';

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

  const load = useCallback(() => {
    if (user?.userId) {
      dispatch(fetchProjects({ userId: user.userId }));
      dispatch(fetchClients({ userId: user.userId }));
    }
  }, [dispatch, user?.userId]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: ProjectResponse) => { setEditing(p); setModalOpen(true); };

  const onSave = async (data: ProjectFormData) => {
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
            <ProjectCard key={p.id} project={p} onEdit={openEdit} onDelete={setDeleteTarget} onComplete={handleComplete} />
          ))}
        </div>
      )}

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        clients={clients}
        onSave={onSave}
      />

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
