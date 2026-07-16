import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '../../components/ui';
import type { CreateWarehousePayload, Warehouse } from '../../types';

interface WarehouseFormValues {
  name: string;
  location: string;
}

interface WarehouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateWarehousePayload) => void;
  isSaving: boolean;
  warehouse?: Warehouse | null;
}

export const WarehouseFormModal = ({ isOpen, onClose, onSubmit, isSaving, warehouse }: WarehouseFormModalProps) => {
  const isEditing = Boolean(warehouse);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset({ name: warehouse?.name ?? '', location: warehouse?.location ?? '' });
    }
  }, [isOpen, warehouse, reset]);

  const submit = (values: WarehouseFormValues) => {
    onSubmit({ name: values.name, location: values.location || undefined });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar almacén' : 'Nuevo almacén'}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nombre"
          placeholder="Ej. Almacén Principal"
          error={errors.name?.message}
          {...register('name', { required: 'El nombre es requerido' })}
        />
        <Input label="Ubicación (opcional)" placeholder="Ej. Ciudad, dirección" {...register('location')} />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEditing ? 'Guardar cambios' : 'Crear almacén'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
