import { Modal, Button } from '../../components/ui';
import { formatCurrency } from '../../helpers';
import { orderTotal } from './SalesOrderTable';
import type { Customer, Product, SalesOrder, Warehouse } from '../../types';

interface SalesOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SalesOrder | null;
  customers: Customer[];
  warehouses: Warehouse[];
  products: Product[];
  isMutating: boolean;
  onEdit: (order: SalesOrder) => void;
  onDelete: (order: SalesOrder) => void;
  onConfirm: (order: SalesOrder) => void;
  onDeliver: (order: SalesOrder) => void;
  onCancel: (order: SalesOrder) => void;
}

export const SalesOrderDetailModal = ({
  isOpen,
  onClose,
  order,
  customers,
  warehouses,
  products,
  isMutating,
  onEdit,
  onDelete,
  onConfirm,
  onDeliver,
  onCancel,
}: SalesOrderDetailModalProps) => {
  if (!order) return null;

  const customerName = customers.find((customer) => customer.id === order.customerId)?.name ?? order.customerId;
  const warehouseName = warehouses.find((warehouse) => warehouse.id === order.warehouseId)?.name ?? order.warehouseId;
  const productName = (id: string) => products.find((product) => product.id === id)?.name ?? id;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Orden #${order.id.slice(0, 8)}`}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Cliente</div>
            <div className="text-slate-100">{customerName}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Almacén</div>
            <div className="text-slate-100">{warehouseName}</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Producto</th>
                <th className="px-3 py-2 font-medium">Cant.</th>
                <th className="px-3 py-2 font-medium">Precio u.</th>
                <th className="px-3 py-2 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-slate-200">{productName(item.productId)}</td>
                  <td className="px-3 py-2 text-slate-400">{item.quantity}</td>
                  <td className="px-3 py-2 text-slate-400">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-3 py-2 text-slate-200">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5">
          <span className="text-sm text-slate-400">Total</span>
          <span className="text-base font-semibold text-slate-100">{formatCurrency(orderTotal(order.items))}</span>
        </div>

        {order.notes && <p className="text-sm text-slate-400">{order.notes}</p>}

        <div className="mt-2 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          {order.status === 'DRAFT' && (
            <>
              <Button type="button" variant="danger" isLoading={isMutating} onClick={() => onDelete(order)}>
                Eliminar
              </Button>
              <Button type="button" variant="secondary" onClick={() => onEdit(order)}>
                Editar
              </Button>
              <Button type="button" isLoading={isMutating} onClick={() => onConfirm(order)}>
                Confirmar
              </Button>
            </>
          )}
          {order.status === 'CONFIRMED' && (
            <>
              <Button type="button" variant="danger" isLoading={isMutating} onClick={() => onCancel(order)}>
                Cancelar
              </Button>
              <Button type="button" isLoading={isMutating} onClick={() => onDeliver(order)}>
                Entregar
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
