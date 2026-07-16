import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '../../components/ui';
import type { Category, CreateCategoryPayload } from '../../types';

interface CategoryFormValues {
  name: string;
  description: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCategoryPayload) => void;
  isSaving: boolean;
  category?: Category | null;
}

export const CategoryFormModal = ({ isOpen, onClose, onSubmit, isSaving, category }: CategoryFormModalProps) => {
  const isEditing = Boolean(category);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset({ name: category?.name ?? '', description: category?.description ?? '' });
    }
  }, [isOpen, category, reset]);

  const submit = (values: CategoryFormValues) => {
    onSubmit({ name: values.name, description: values.description || undefined });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar categoría' : 'Nueva categoría'}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nombre"
          placeholder="Ej. Electrónica"
          error={errors.name?.message}
          {...register('name', { required: 'El nombre es requerido' })}
        />
        <Input label="Descripción (opcional)" placeholder="Detalles de la categoría" {...register('description')} />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEditing ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
