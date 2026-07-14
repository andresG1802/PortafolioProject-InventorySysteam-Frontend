import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '../../components/ui';
import type { CreateProductPayload, Product } from '../../types';

interface ProductFormValues {
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProductPayload) => void;
  isSaving: boolean;
  product?: Product | null;
}

export const ProductFormModal = ({ isOpen, onClose, onSubmit, isSaving, product }: ProductFormModalProps) => {
  const isEditing = Boolean(product);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset({
        name: product?.name ?? '',
        price: product?.price ?? 0,
        stock: product?.stock ?? 0,
        description: product?.description ?? '',
        category: product?.category ?? '',
      });
    }
  }, [isOpen, product, reset]);

  const submit = (values: ProductFormValues) => {
    onSubmit({
      name: values.name,
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description || undefined,
      category: values.category || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar producto' : 'Nuevo producto'}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nombre"
          placeholder="Ej. Teclado mecánico"
          error={errors.name?.message}
          {...register('name', { required: 'El nombre es requerido' })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio"
            type="number"
            step="0.01"
            min={0}
            error={errors.price?.message}
            {...register('price', {
              required: 'Requerido',
              min: { value: 0, message: 'Debe ser positivo' },
            })}
          />
          <Input
            label="Stock"
            type="number"
            min={0}
            error={errors.stock?.message}
            {...register('stock', {
              required: 'Requerido',
              min: { value: 0, message: 'Debe ser positivo' },
            })}
          />
        </div>
        <Input label="Categoría (opcional)" placeholder="Ej. Electrónica" {...register('category')} />
        <Input label="Descripción (opcional)" placeholder="Detalles del producto" {...register('description')} />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
