import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading, setTasks, setError, addTask, updateTaskItem, removeTask } from '../../store/slices/taskSlice';
import { setProjects } from '../../store/slices/projectSlice';
import { tasksApi } from '../../api/tasks';
import { projectsApi } from '../../api/projects';
import type { TaskResponse } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/Modal';
import TaskFormModal, { type TaskFormData } from '../../components/tasks/TaskFormModal';
import TaskColumn from '../../components/tasks/TaskColumn';

const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items: tasks, loading } = useAppSelector((s) => s.tasks);
  const { items: projects } = useAppSelector((s) => s.projects);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskResponse | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<'A_FAIRE' | 'TERMINEE'>('A_FAIRE');
  const [deleteTarget, setDeleteTarget] = useState<TaskResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!user?.userId) return;
    dispatch(setLoading(true));
    try {
      const [tasksPage, projectsPage] = await Promise.all([
        tasksApi.getByUser(user.userId, { size: 200 }),
        projectsApi.getByUser(user.userId),
      ]);
      dispatch(setTasks(tasksPage));
      dispatch(setProjects(projectsPage));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to load tasks'));
    }
  }, [dispatch, user?.userId]);

  useEffect(() => { load(); }, [load]);

  const openCreate = (status: 'A_FAIRE' | 'TERMINEE' = 'A_FAIRE') => {
    setEditing(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task: TaskResponse) => {
    setEditing(task);
    setModalOpen(true);
  };

  const onSave = async (data: TaskFormData) => {
    if (!user?.userId) return;
    const payload = { ...data, userId: user.userId };
    try {
      if (editing) {
        const updated = await tasksApi.update(editing.id, payload);
        dispatch(updateTaskItem(updated));
        toast.success('Task updated');
      } else {
        const created = await tasksApi.create(payload);
        dispatch(addTask(created));
        toast.success('Task created');
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await tasksApi.delete(deleteTarget.id);
      dispatch(removeTask(deleteTarget.id));
      toast.success('Task deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkDone = async (id: number) => {
    try {
      const updated = await tasksApi.markDone(id);
      dispatch(updateTaskItem(updated));
      toast.success('Task completed!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const todo = tasks.filter((t) => t.status === 'A_FAIRE');
  const done = tasks.filter((t) => t.status === 'TERMINEE');

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
          <TaskColumn
            title="To Do"
            colorClass="bg-amber-400"
            tasks={todo}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onMarkDone={handleMarkDone}
            onAdd={() => openCreate('A_FAIRE')}
            emptyMessage="No tasks to do"
          />
          <TaskColumn
            title="Done"
            colorClass="bg-green-400"
            tasks={done}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onMarkDone={handleMarkDone}
            emptyMessage="No completed tasks yet"
          />
        </div>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        defaultStatus={defaultStatus}
        projects={projects}
        onSave={onSave}
      />

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
