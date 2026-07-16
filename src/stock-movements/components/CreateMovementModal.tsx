import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input, Select } from '../../components/ui';
import type { CreateStockMovementPayload, Product, Warehouse } from '../../types';

interface MovementFormValues {
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  productId: string;
  warehouseId: string;
  quantity: number;
  reason: string;
}

interface CreateMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateStockMovementPayload) => void;
  isSaving: boolean;
  products: Product[];
  warehouses: Warehouse[];
}

export const CreateMovementModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  products,
  warehouses,
}: CreateMovementModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovementFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset({ type: 'IN', productId: '', warehouseId: '', quantity: 1, reason: '' });
    }
  }, [isOpen, reset]);

  const submit = (values: MovementFormValues) => {
    onSubmit({
      type: values.type,
      productId: values.productId,
      warehouseId: values.warehouseId,
      quantity: Number(values.quantity),
      reason: values.reason || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo movimiento de stock">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Select label="Tipo" {...register('type', { required: true })}>
          <option value="IN">Entrada</option>
          <option value="OUT">Salida</option>
          <option value="ADJUSTMENT">Ajuste (cantidad puede ser negativa)</option>
        </Select>
        <Select label="Producto" error={errors.productId?.message} {...register('productId', { required: 'Selecciona un producto' })}>
          <option value="">Selecciona un producto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
        <Select
          label="Almacén"
          error={errors.warehouseId?.message}
          {...register('warehouseId', { required: 'Selecciona un almacén' })}
        >
          <option value="">Selecciona un almacén</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </Select>
        <Input
          label="Cantidad"
          type="number"
          error={errors.quantity?.message}
          {...register('quantity', { required: 'Requerido', valueAsNumber: true })}
        />
        <Input label="Motivo (opcional)" placeholder="Ej. Inventario inicial" {...register('reason')} />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Registrar movimiento
          </Button>
        </div>
      </form>
    </Modal>
  );
};
