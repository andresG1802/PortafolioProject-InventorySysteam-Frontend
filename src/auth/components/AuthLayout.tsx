import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur"
    >
      {children}
    </motion.div>
  </div>
);
