import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '../../components/ui';
import type { CreateSupplierPayload, Supplier } from '../../types';

interface SupplierFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSupplierPayload) => void;
  isSaving: boolean;
  supplier?: Supplier | null;
}

export const SupplierFormModal = ({ isOpen, onClose, onSubmit, isSaving, supplier }: SupplierFormModalProps) => {
  const isEditing = Boolean(supplier);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset({
        name: supplier?.name ?? '',
        email: supplier?.email ?? '',
        phone: supplier?.phone ?? '',
        address: supplier?.address ?? '',
      });
    }
  }, [isOpen, supplier, reset]);

  const submit = (values: SupplierFormValues) => {
    onSubmit({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar proveedor' : 'Nuevo proveedor'}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nombre"
          placeholder="Ej. Acme Supplies"
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
            {isEditing ? 'Guardar cambios' : 'Crear proveedor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
