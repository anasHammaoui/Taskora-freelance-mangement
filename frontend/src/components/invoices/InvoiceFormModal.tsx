import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Resolver } from 'react-hook-form';
import type { ProjectResponse } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { formatCurrency } from '../../utils/format';

const lineSchema = z.object({
  description: z.string().min(1, 'Required'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  unitPrice: z.coerce.number().min(0, 'Must be positive'),
});

const schema = z.object({
  projectId: z.coerce.number().min(1, 'Select a project'),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  lines: z.array(lineSchema).min(1, 'At least one line'),
});

export type InvoiceFormData = z.infer<typeof schema>;

interface InvoiceFormModalProps {
  open: boolean;
  onClose: () => void;
  projects: ProjectResponse[];
  onSave: (data: InvoiceFormData) => Promise<void>;
}

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ open, onClose, projects, onSave }) => {
  const { register, handleSubmit, reset, watch, control, formState: { errors, isSubmitting } } = useForm<InvoiceFormData>({
    resolver: zodResolver(schema) as Resolver<InvoiceFormData>,
    defaultValues: { taxRate: 20, lines: [{ description: '', quantity: 1, unitPrice: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const watchLines = watch('lines');
  const watchTax = watch('taxRate') || 20;

  const totalHT = watchLines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);
  const totalTVA = totalHT * (watchTax / 100);
  const totalTTC = totalHT + totalTVA;

  const handleClose = () => {
    reset({ taxRate: 20, lines: [{ description: '', quantity: 1, unitPrice: 0 }] });
    onClose();
  };

  const handleSave = async (data: InvoiceFormData) => {
    await onSave(data);
    reset({ taxRate: 20, lines: [{ description: '', quantity: 1, unitPrice: 0 }] });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Invoice"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button loading={isSubmitting} onClick={handleSubmit(handleSave as any)}>Create Invoice</Button>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(handleSave as any)}>
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
          <Input label="Tax Rate (%)" type="number" defaultValue={20} {...register('taxRate')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Issue Date" type="date" {...register('issueDate')} />
          <Input label="Due Date" type="date" {...register('dueDate')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Invoice Lines</label>
          <div className="space-y-2">
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-5">
                  <input
                    {...register(`lines.${idx}.description`)}
                    placeholder="Description"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.lines?.[idx]?.description && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.lines[idx]?.description?.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <input
                    {...register(`lines.${idx}.quantity`)}
                    type="number"
                    placeholder="Qty"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    {...register(`lines.${idx}.unitPrice`)}
                    type="number"
                    step="0.01"
                    placeholder="Unit price"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center pt-1.5">
                  <span className="text-xs text-slate-500">
                    {formatCurrency((Number(watchLines[idx]?.quantity) || 0) * (Number(watchLines[idx]?.unitPrice) || 0))}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                    disabled={fields.length === 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
            className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add line
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-1.5">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Total HT</span><span>{formatCurrency(totalHT)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>TVA ({watchTax}%)</span><span>{formatCurrency(totalTVA)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-200 dark:border-slate-700">
            <span>Total TTC</span><span>{formatCurrency(totalTTC)}</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default InvoiceFormModal;
