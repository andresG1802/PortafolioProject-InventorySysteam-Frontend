import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input, Select } from '../../components/ui';
import type { CreateStockTransferPayload, Product, Warehouse } from '../../types';

interface TransferFormValues {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  reason: string;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateStockTransferPayload) => void;
  isSaving: boolean;
  products: Product[];
  warehouses: Warehouse[];
}

export const TransferModal = ({ isOpen, onClose, onSubmit, isSaving, products, warehouses }: TransferModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TransferFormValues>();

  const fromWarehouseId = watch('fromWarehouseId');

  useEffect(() => {
    if (isOpen) {
      reset({ productId: '', fromWarehouseId: '', toWarehouseId: '', quantity: 1, reason: '' });
    }
  }, [isOpen, reset]);

  const submit = (values: TransferFormValues) => {
    onSubmit({
      productId: values.productId,
      fromWarehouseId: values.fromWarehouseId,
      toWarehouseId: values.toWarehouseId,
      quantity: Number(values.quantity),
      reason: values.reason || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transferir stock entre almacenes">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Select label="Producto" error={errors.productId?.message} {...register('productId', { required: 'Selecciona un producto' })}>
          <option value="">Selecciona un producto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Almacén origen"
            error={errors.fromWarehouseId?.message}
            {...register('fromWarehouseId', { required: 'Requerido' })}
          >
            <option value="">Origen</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </Select>
          <Select
            label="Almacén destino"
            error={errors.toWarehouseId?.message}
            {...register('toWarehouseId', {
              required: 'Requerido',
              validate: (value) => value !== fromWarehouseId || 'Debe ser distinto al origen',
            })}
          >
            <option value="">Destino</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </Select>
        </div>
        <Input
          label="Cantidad"
          type="number"
          min={1}
          error={errors.quantity?.message}
          {...register('quantity', { required: 'Requerido', valueAsNumber: true, min: { value: 1, message: 'Debe ser mayor a 0' } })}
        />
        <Input label="Motivo (opcional)" {...register('reason')} />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Transferir
          </Button>
        </div>
      </form>
    </Modal>
  );
};
