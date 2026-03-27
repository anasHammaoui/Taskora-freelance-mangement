import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Resolver } from 'react-hook-form';
import type { ProjectResponse, ClientResponse } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  budget: z.coerce.number().min(0).optional(),
  status: z.enum(['EN_COURS', 'TERMINE']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  clientId: z.coerce.number().min(1, 'Select a client'),
});

export type ProjectFormData = z.infer<typeof schema>;

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: ProjectResponse | null;
  clients: ClientResponse[];
  onSave: (data: ProjectFormData) => Promise<void>;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ open, onClose, editing, clients, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectFormData>({
    resolver: zodResolver(schema) as Resolver<ProjectFormData>,
    defaultValues: { status: 'EN_COURS' },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          title: editing.title,
          description: editing.description || '',
          budget: editing.budget || 0,
          status: editing.status,
          startDate: editing.startDate || '',
          endDate: editing.endDate || '',
          clientId: editing.clientId,
        });
      } else {
        reset({ status: 'EN_COURS', title: '', description: '', budget: 0, startDate: '', endDate: '' });
      }
    }
  }, [open, editing, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Project' : 'New Project'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={isSubmitting} onClick={handleSubmit(onSave as any)}>
            {editing ? 'Save Changes' : 'Create Project'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSave as any)}>
        <Input label="Title *" placeholder="Project name" error={errors.title?.message} {...register('title')} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Client *</label>
            <select
              {...register('clientId')}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select client</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.clientId && <p className="text-xs text-red-500 mt-1">{errors.clientId.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status *</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
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
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Project description..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;
