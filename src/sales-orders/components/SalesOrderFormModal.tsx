import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Modal, Button, Input, Select } from '../../components/ui';
import { formatCurrency } from '../../helpers';
import type { CreateSalesOrderPayload, Customer, Product, SalesOrder, Warehouse } from '../../types';

interface ItemFormValues {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface SalesOrderFormValues {
  customerId: string;
  warehouseId: string;
  notes: string;
  items: ItemFormValues[];
}

interface SalesOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSalesOrderPayload) => void;
  isSaving: boolean;
  order?: SalesOrder | null;
  customers: Customer[];
  warehouses: Warehouse[];
  products: Product[];
}

const emptyItem: ItemFormValues = { productId: '', quantity: 1, unitPrice: 0 };

export const SalesOrderFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  order,
  customers,
  warehouses,
  products,
}: SalesOrderFormModalProps) => {
  const isEditing = Boolean(order);
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<SalesOrderFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');

  useEffect(() => {
    if (isOpen) {
      reset({
        customerId: order?.customerId ?? '',
        warehouseId: order?.warehouseId ?? '',
        notes: order?.notes ?? '',
        items: order?.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })) ?? [emptyItem],
      });
    }
  }, [isOpen, order, reset]);

  const total = (items ?? []).reduce((sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0), 0);

  const submit = (values: SalesOrderFormValues) => {
    onSubmit({
      customerId: values.customerId,
      warehouseId: values.warehouseId,
      notes: values.notes || undefined,
      items: values.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar orden de venta' : 'Nueva orden de venta'}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Cliente" error={errors.customerId?.message} {...register('customerId', { required: 'Requerido' })}>
            <option value="">Selecciona cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
          <Select label="Almacén" error={errors.warehouseId?.message} {...register('warehouseId', { required: 'Requerido' })}>
            <option value="">Selecciona almacén</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Líneas</span>
            <Button type="button" variant="ghost" onClick={() => append(emptyItem)}>
              + Línea
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_80px_100px_auto] items-end gap-2">
              <Select {...register(`items.${index}.productId` as const, { required: true })}>
                <option value="">Producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Select>
              <Input
                type="number"
                min={1}
                placeholder="Cant."
                {...register(`items.${index}.quantity` as const, { required: true, valueAsNumber: true, min: 1 })}
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="Precio u."
                {...register(`items.${index}.unitPrice` as const, { required: true, valueAsNumber: true, min: 0 })}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="rounded-md px-2.5 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5">
          <span className="text-sm text-slate-400">Total</span>
          <span className="text-base font-semibold text-slate-100">{formatCurrency(total)}</span>
        </div>

        <Input label="Notas (opcional)" {...register('notes')} />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEditing ? 'Guardar cambios' : 'Crear orden'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
