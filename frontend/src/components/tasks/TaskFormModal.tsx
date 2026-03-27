import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Resolver } from 'react-hook-form';
import type { TaskResponse, ProjectResponse } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['A_FAIRE', 'TERMINEE']),
  projectId: z.coerce.number().min(1, 'Select a project'),
});

export type TaskFormData = z.infer<typeof schema>;

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: TaskResponse | null;
  defaultStatus?: 'A_FAIRE' | 'TERMINEE';
  projects: ProjectResponse[];
  onSave: (data: TaskFormData) => Promise<void>;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onClose,
  editing,
  defaultStatus = 'A_FAIRE',
  projects,
  onSave,
}) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    resolver: zodResolver(schema) as Resolver<TaskFormData>,
    defaultValues: { status: defaultStatus },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          title: editing.title,
          description: editing.description || '',
          dueDate: editing.dueDate || '',
          status: editing.status,
          projectId: editing.projectId,
        });
      } else {
        reset({ status: defaultStatus });
      }
    }
  }, [open, editing, defaultStatus, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Task' : 'New Task'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={isSubmitting} onClick={handleSubmit(onSave as any)}>
            {editing ? 'Save' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSave as any)}>
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
  );
};

export default TaskFormModal;
