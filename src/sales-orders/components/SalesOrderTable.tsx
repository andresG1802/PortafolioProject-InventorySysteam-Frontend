import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import type { Customer, SalesOrder, SalesOrderStatus, Warehouse } from '../../types';
import { formatCurrency, formatDate } from '../../helpers';

interface SalesOrderTableProps {
  orders: SalesOrder[];
  customers: Customer[];
  warehouses: Warehouse[];
  onViewDetail: (order: SalesOrder) => void;
}

const statusBadge: Record<SalesOrderStatus, string> = {
  DRAFT: 'bg-slate-500/10 text-slate-300',
  CONFIRMED: 'bg-indigo-500/10 text-indigo-400',
  DELIVERED: 'bg-emerald-500/10 text-emerald-400',
  CANCELLED: 'bg-rose-500/10 text-rose-400',
};

const statusLabel: Record<SalesOrderStatus, string> = {
  DRAFT: 'Borrador',
  CONFIRMED: 'Confirmada',
  DELIVERED: 'Entregada',
  CANCELLED: 'Cancelada',
};

export const orderTotal = (items: { quantity: number; unitPrice: number }[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

export const SalesOrderTable = ({ orders, customers, warehouses, onViewDetail }: SalesOrderTableProps) => {
  const customerName = (id: string) => customers.find((customer) => customer.id === id)?.name ?? id;
  const warehouseName = (id: string) => warehouses.find((warehouse) => warehouse.id === id)?.name ?? id;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Orden</th>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Almacén</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <AnimatePresence initial={false}>
              {orders.map((order) => (
                <motion.tr
                  key={order.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-950/40 hover:bg-slate-900/60"
                >
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}</td>
                  <td className="px-5 py-3 text-slate-100">{customerName(order.customerId)}</td>
                  <td className="px-5 py-3 text-slate-400">{warehouseName(order.warehouseId)}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('rounded-full px-2.5 py-1 text-xs font-medium', statusBadge[order.status])}>
                      {statusLabel[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-300">{formatCurrency(orderTotal(order.items))}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onViewDetail(order)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10"
                    >
                      Ver detalle
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
