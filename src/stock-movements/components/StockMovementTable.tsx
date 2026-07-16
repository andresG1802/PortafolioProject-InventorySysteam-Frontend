import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import type { Product, StockMovement, StockMovementType, Warehouse } from '../../types';
import { formatDate } from '../../helpers';

interface StockMovementTableProps {
  movements: StockMovement[];
  products: Product[];
  warehouses: Warehouse[];
}

const typeBadge: Record<StockMovementType, string> = {
  IN: 'bg-emerald-500/10 text-emerald-400',
  OUT: 'bg-rose-500/10 text-rose-400',
  ADJUSTMENT: 'bg-amber-500/10 text-amber-400',
  TRANSFER_IN: 'bg-indigo-500/10 text-indigo-400',
  TRANSFER_OUT: 'bg-indigo-500/10 text-indigo-400',
};

const typeLabel: Record<StockMovementType, string> = {
  IN: 'Entrada',
  OUT: 'Salida',
  ADJUSTMENT: 'Ajuste',
  TRANSFER_IN: 'Transf. entrada',
  TRANSFER_OUT: 'Transf. salida',
};

export const StockMovementTable = ({ movements, products, warehouses }: StockMovementTableProps) => {
  const productName = (id: string) => products.find((product) => product.id === id)?.name ?? id;
  const warehouseName = (id: string) => warehouses.find((warehouse) => warehouse.id === id)?.name ?? id;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium">Producto</th>
              <th className="px-5 py-3 font-medium">Almacén</th>
              <th className="px-5 py-3 font-medium">Tipo</th>
              <th className="px-5 py-3 font-medium">Cantidad</th>
              <th className="px-5 py-3 font-medium">Motivo / Referencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <AnimatePresence initial={false}>
              {movements.map((movement) => (
                <motion.tr
                  key={movement.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-950/40 hover:bg-slate-900/60"
                >
                  <td className="px-5 py-3 text-slate-400">{formatDate(movement.createdAt)}</td>
                  <td className="px-5 py-3 text-slate-100">{productName(movement.productId)}</td>
                  <td className="px-5 py-3 text-slate-400">{warehouseName(movement.warehouseId)}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('rounded-full px-2.5 py-1 text-xs font-medium', typeBadge[movement.type])}>
                      {typeLabel[movement.type]}
                    </span>
                  </td>
                  <td
                    className={clsx(
                      'px-5 py-3 font-medium',
                      movement.quantity >= 0 ? 'text-emerald-400' : 'text-rose-400',
                    )}
                  >
                    {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{movement.reason || movement.reference || '—'}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
