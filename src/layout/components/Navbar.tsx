import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/auth/authSlice';
import { toggleSidebar } from '../../store/ui/uiSlice';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur lg:px-8">
      <button
        type="button"
        onClick={() => dispatch(toggleSidebar())}
        className="rounded-md p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
        aria-label="Abrir menú"
      >
        ☰
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">
          Hola, <span className="font-medium text-slate-200">{user?.name}</span>
        </span>
        <Button variant="ghost" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
};
