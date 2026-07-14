import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { EmptyState, PageTransition, Spinner, ConfirmDialog } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteUser, fetchUsers, updateUser } from '../../store/users/usersSlice';
import { logout } from '../../store/auth/authSlice';
import { UserEditModal } from '../components/UserEditModal';
import type { UpdateUserPayload, User } from '../../types';

export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, status, mutationStatus } = useAppSelector((state) => state.users);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (payload: UpdateUserPayload) => {
    if (!editingUser) return;
    const result = await dispatch(updateUser({ id: editingUser.id, payload }));
    if (updateUser.fulfilled.match(result)) {
      toast.success('Usuario actualizado');
      setEditingUser(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    const result = await dispatch(deleteUser(deletingUser.id));
    if (deleteUser.fulfilled.match(result)) {
      toast.success('Usuario eliminado');
      const wasSelf = deletingUser.id === currentUserId;
      setDeletingUser(null);
      if (wasSelf) {
        dispatch(logout());
        navigate('/login', { replace: true });
      }
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-100">Usuarios</h1>
        <p className="text-sm text-slate-500">Cuentas con acceso al sistema</p>
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No hay usuarios registrados" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Correo</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <AnimatePresence initial={false}>
                {items.map((user) => (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-slate-950/40 hover:bg-slate-900/60"
                  >
                    <td className="px-5 py-3 font-medium text-slate-100">
                      {user.name}
                      {user.id === currentUserId && (
                        <span className="ml-2 rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
                          Tú
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-400">{user.email}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingUser(user)}
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
      )}

      <UserEditModal
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        onSubmit={handleSubmit}
        isSaving={mutationStatus === 'loading'}
        user={editingUser}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        title="Eliminar usuario"
        description={`¿Seguro que quieres eliminar a "${deletingUser?.name}"? Esta acción no se puede deshacer.`}
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleDelete}
        onClose={() => setDeletingUser(null)}
      />
    </PageTransition>
  );
};
