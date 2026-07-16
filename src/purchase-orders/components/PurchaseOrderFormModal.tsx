import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Modal, Button, Input, Select } from '../../components/ui';
import { formatCurrency } from '../../helpers';
import type { CreatePurchaseOrderPayload, Product, PurchaseOrder, Supplier, Warehouse } from '../../types';

interface ItemFormValues {
  productId: string;
  quantity: number;
  unitCost: number;
}

interface PurchaseOrderFormValues {
  supplierId: string;
  warehouseId: string;
  notes: string;
  items: ItemFormValues[];
}

interface PurchaseOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePurchaseOrderPayload) => void;
  isSaving: boolean;
  order?: PurchaseOrder | null;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  products: Product[];
}

const emptyItem: ItemFormValues = { productId: '', quantity: 1, unitCost: 0 };

export const PurchaseOrderFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  order,
  suppliers,
  warehouses,
  products,
}: PurchaseOrderFormModalProps) => {
  const isEditing = Boolean(order);
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<PurchaseOrderFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');

  useEffect(() => {
    if (isOpen) {
      reset({
        supplierId: order?.supplierId ?? '',
        warehouseId: order?.warehouseId ?? '',
        notes: order?.notes ?? '',
        items: order?.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitCost,
        })) ?? [emptyItem],
      });
    }
  }, [isOpen, order, reset]);

  const total = (items ?? []).reduce((sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.unitCost) || 0), 0);

  const submit = (values: PurchaseOrderFormValues) => {
    onSubmit({
      supplierId: values.supplierId,
      warehouseId: values.warehouseId,
      notes: values.notes || undefined,
      items: values.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      })),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar orden de compra' : 'Nueva orden de compra'}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Proveedor" error={errors.supplierId?.message} {...register('supplierId', { required: 'Requerido' })}>
            <option value="">Selecciona proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
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
                placeholder="Costo u."
                {...register(`items.${index}.unitCost` as const, { required: true, valueAsNumber: true, min: 0 })}
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
