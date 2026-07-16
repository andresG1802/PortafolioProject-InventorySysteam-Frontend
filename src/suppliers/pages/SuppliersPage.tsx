import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, EmptyState, Input, PageTransition, Spinner, ConfirmDialog } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createSupplier, deleteSupplier, fetchSuppliers, updateSupplier } from '../../store/suppliers/suppliersSlice';
import { SupplierTable } from '../components/SupplierTable';
import { SupplierFormModal } from '../components/SupplierFormModal';
import type { CreateSupplierPayload, Supplier } from '../../types';

export const SuppliersPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, mutationStatus } = useAppSelector((state) => state.suppliers);
  const [search, setSearch] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const filteredSuppliers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((supplier) => supplier.name.toLowerCase().includes(term));
  }, [items, search]);

  const openCreateModal = () => {
    setEditingSupplier(null);
    setFormOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: CreateSupplierPayload) => {
    const result = editingSupplier
      ? await dispatch(updateSupplier({ id: editingSupplier.id, payload }))
      : await dispatch(createSupplier(payload));

    if (createSupplier.fulfilled.match(result) || updateSupplier.fulfilled.match(result)) {
      toast.success(editingSupplier ? 'Proveedor actualizado' : 'Proveedor creado');
      setFormOpen(false);
      setEditingSupplier(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDelete = async () => {
    if (!deletingSupplier) return;
    const result = await dispatch(deleteSupplier(deletingSupplier.id));
    if (deleteSupplier.fulfilled.match(result)) {
      toast.success('Proveedor eliminado');
      setDeletingSupplier(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Proveedores</h1>
          <p className="text-sm text-slate-500">Gestiona a quién le compras</p>
        </div>
        <Button onClick={openCreateModal}>+ Nuevo proveedor</Button>
      </div>

      <div className="mb-6 max-w-sm">
        <Input placeholder="Buscar por nombre..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <EmptyState
          title={search ? 'Sin resultados' : 'Aún no tienes proveedores'}
          description={search ? 'Prueba con otro término de búsqueda.' : 'Crea tu primer proveedor para empezar.'}
          action={!search && <Button onClick={openCreateModal}>+ Nuevo proveedor</Button>}
        />
      ) : (
        <SupplierTable suppliers={filteredSuppliers} onEdit={openEditModal} onDelete={setDeletingSupplier} />
      )}

      <SupplierFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isSaving={mutationStatus === 'loading'}
        supplier={editingSupplier}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingSupplier)}
        title="Eliminar proveedor"
        description={`¿Seguro que quieres eliminar "${deletingSupplier?.name}"? Esta acción no se puede deshacer.`}
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleDelete}
        onClose={() => setDeletingSupplier(null)}
      />
    </PageTransition>
  );
};
