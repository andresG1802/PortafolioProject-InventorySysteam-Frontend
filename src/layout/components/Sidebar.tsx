import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const sections = [
  {
    label: 'Catálogo',
    links: [
      { to: '/products', label: 'Productos', icon: '📦' },
      { to: '/categories', label: 'Categorías', icon: '🏷️' },
      { to: '/suppliers', label: 'Proveedores', icon: '🚚' },
    ],
  },
  {
    label: 'Inventario',
    links: [
      { to: '/warehouses', label: 'Almacenes', icon: '🏬' },
      { to: '/stock-movements', label: 'Movimientos', icon: '🔄' },
    ],
  },
  {
    label: 'Compras',
    links: [{ to: '/purchase-orders', label: 'Órdenes de compra', icon: '🛒' }],
  },
  {
    label: 'Ventas',
    links: [
      { to: '/sales-orders', label: 'Órdenes de venta', icon: '💰' },
      { to: '/customers', label: 'Clientes', icon: '🧑‍🤝‍🧑' },
    ],
  },
  {
    label: 'Administración',
    links: [{ to: '/users', label: 'Usuarios', icon: '👤' }],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export const Sidebar = ({ isOpen, onNavigate }: SidebarProps) => (
  <aside
    className={clsx(
      'fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto border-r border-slate-800 bg-slate-900/80 backdrop-blur transition-transform lg:static lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    )}
  >
    <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
      <span className="text-xl">🗂️</span>
      <span className="text-lg font-semibold text-slate-100">Inventario</span>
    </div>
    <nav className="flex flex-col gap-4 p-4">
      {sections.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <span className="px-4 text-xs font-semibold uppercase tracking-wide text-slate-600">{section.label}</span>
          {section.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                clsx(
                  'relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-indigo-500/10"
                      transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                    />
                  )}
                  <span className="relative">{link.icon}</span>
                  <span className="relative">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  </aside>
);
