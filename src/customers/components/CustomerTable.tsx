import { AnimatePresence, motion } from 'framer-motion';
import type { Customer } from '../../types';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerTable = ({ customers, onEdit, onDelete }: CustomerTableProps) => (
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
            {customers.map((customer) => (
              <motion.tr
                key={customer.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950/40 hover:bg-slate-900/60"
              >
                <td className="px-5 py-3 font-medium text-slate-100">{customer.name}</td>
                <td className="px-5 py-3 text-slate-400">{customer.email || '—'}</td>
                <td className="px-5 py-3 text-slate-400">{customer.phone || '—'}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(customer)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(customer)}
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
