import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '../../components/ui';
import type { CreateCustomerPayload, Customer } from '../../types';

interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCustomerPayload) => void;
  isSaving: boolean;
  customer?: Customer | null;
}

export const CustomerFormModal = ({ isOpen, onClose, onSubmit, isSaving, customer }: CustomerFormModalProps) => {
  const isEditing = Boolean(customer);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset({
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
        address: customer?.address ?? '',
      });
    }
  }, [isOpen, customer, reset]);

  const submit = (values: CustomerFormValues) => {
    onSubmit({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar cliente' : 'Nuevo cliente'}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nombre"
          placeholder="Ej. John Doe"
          error={errors.name?.message}
          {...register('name', { required: 'El nombre es requerido' })}
        />
        <Input label="Correo (opcional)" type="email" {...register('email')} />
        <Input label="Teléfono (opcional)" {...register('phone')} />
        <Input label="Dirección (opcional)" {...register('address')} />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEditing ? 'Guardar cambios' : 'Crear cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
