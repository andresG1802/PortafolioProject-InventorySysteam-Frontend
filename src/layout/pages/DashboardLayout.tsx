import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeSidebar } from '../../store/ui/uiSlice';

export const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar isOpen={isSidebarOpen} onNavigate={() => dispatch(closeSidebar())} />

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeSidebar())}
            className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
