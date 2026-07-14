import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import type { Product } from '../../types';
import { formatCurrency } from '../../helpers';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const stockBadge = (stock: number) => {
  if (stock === 0) return 'bg-rose-500/10 text-rose-400';
  if (stock <= 5) return 'bg-amber-500/10 text-amber-400';
  return 'bg-emerald-500/10 text-emerald-400';
};

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-800">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Nombre</th>
            <th className="px-5 py-3 font-medium">Categoría</th>
            <th className="px-5 py-3 font-medium">Precio</th>
            <th className="px-5 py-3 font-medium">Stock</th>
            <th className="px-5 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          <AnimatePresence initial={false}>
            {products.map((product) => (
              <motion.tr
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950/40 hover:bg-slate-900/60"
              >
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-100">{product.name}</div>
                  {product.description && (
                    <div className="max-w-xs truncate text-xs text-slate-500">{product.description}</div>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-400">{product.category || '—'}</td>
                <td className="px-5 py-3 text-slate-300">{formatCurrency(product.price)}</td>
                <td className="px-5 py-3">
                  <span className={clsx('rounded-full px-2.5 py-1 text-xs font-medium', stockBadge(product.stock))}>
                    {product.stock} u.
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  </div>
);
