import { AnimatePresence, motion } from 'framer-motion';
import type { Supplier } from '../../types';

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export const SupplierTable = ({ suppliers, onEdit, onDelete }: SupplierTableProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-800">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Nombre</th>
            <th className="px-5 py-3 font-medium">Correo</th>
            <th className="px-5 py-3 font-medium">Teléfono</th>
            <th className="px-5 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          <AnimatePresence initial={false}>
            {suppliers.map((supplier) => (
              <motion.tr
                key={supplier.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950/40 hover:bg-slate-900/60"
              >
                <td className="px-5 py-3 font-medium text-slate-100">{supplier.name}</td>
                <td className="px-5 py-3 text-slate-400">{supplier.email || '—'}</td>
                <td className="px-5 py-3 text-slate-400">{supplier.phone || '—'}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(supplier)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(supplier)}
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
