import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ClientResponse } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
});

export type ClientFormData = z.infer<typeof schema>;

interface ClientFormModalProps {
  open: boolean;
  onClose: () => void;
  editing: ClientResponse | null;
  onSave: (data: ClientFormData) => Promise<void>;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ open, onClose, editing, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset(editing
        ? { name: editing.name, email: editing.email || '', phone: editing.phone || '', company: editing.company || '', address: editing.address || '' }
        : {}
      );
    }
  }, [open, editing, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Client' : 'New Client'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={isSubmitting} onClick={handleSubmit(onSave)}>
            {editing ? 'Save Changes' : 'Create Client'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSave)}>
        <Input label="Name *" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="client@example.com" error={errors.email?.message} {...register('email')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Phone" placeholder="+33 6 12 34 56 78" {...register('phone')} />
          <Input label="Company" placeholder="Acme Inc." {...register('company')} />
        </div>
        <Input label="Address" placeholder="123 Main St, Paris" {...register('address')} />
      </form>
    </Modal>
  );
};

export default ClientFormModal;
