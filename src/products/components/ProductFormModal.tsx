import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input, Select } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories } from '../../store/categories/categoriesSlice';
import { fetchSuppliers } from '../../store/suppliers/suppliersSlice';
import type { CreateProductPayload, Product } from '../../types';

interface ProductFormValues {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  supplierId: string;
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
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.items);
  const suppliers = useAppSelector((state) => state.suppliers.items);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>();

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
      dispatch(fetchSuppliers());
      reset({
        name: product?.name ?? '',
        price: product?.price ?? 0,
        description: product?.description ?? '',
        categoryId: product?.categoryId ?? '',
        supplierId: product?.supplierId ?? '',
      });
    }
  }, [isOpen, product, reset, dispatch]);

  const submit = (values: ProductFormValues) => {
    onSubmit({
      name: values.name,
      price: Number(values.price),
      description: values.description || undefined,
      categoryId: values.categoryId || undefined,
      supplierId: values.supplierId || undefined,
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
        <div className="grid grid-cols-2 gap-4">
          <Select label="Categoría (opcional)" {...register('categoryId')}>
            <option value="">Sin categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select label="Proveedor (opcional)" {...register('supplierId')}>
            <option value="">Sin proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </Select>
        </div>
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
