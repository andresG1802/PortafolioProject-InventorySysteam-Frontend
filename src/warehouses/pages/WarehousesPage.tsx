import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, EmptyState, Input, PageTransition, Spinner, ConfirmDialog } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createWarehouse, deleteWarehouse, fetchWarehouses, updateWarehouse } from '../../store/warehouses/warehousesSlice';
import { WarehouseTable } from '../components/WarehouseTable';
import { WarehouseFormModal } from '../components/WarehouseFormModal';
import type { CreateWarehousePayload, Warehouse } from '../../types';

export const WarehousesPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, mutationStatus } = useAppSelector((state) => state.warehouses);
  const [search, setSearch] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(null);

  useEffect(() => {
    dispatch(fetchWarehouses());
  }, [dispatch]);

  const filteredWarehouses = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((warehouse) => warehouse.name.toLowerCase().includes(term));
  }, [items, search]);

  const openCreateModal = () => {
    setEditingWarehouse(null);
    setFormOpen(true);
  };

  const openEditModal = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: CreateWarehousePayload) => {
    const result = editingWarehouse
      ? await dispatch(updateWarehouse({ id: editingWarehouse.id, payload }))
      : await dispatch(createWarehouse(payload));

    if (createWarehouse.fulfilled.match(result) || updateWarehouse.fulfilled.match(result)) {
      toast.success(editingWarehouse ? 'Almacén actualizado' : 'Almacén creado');
      setFormOpen(false);
      setEditingWarehouse(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDelete = async () => {
    if (!deletingWarehouse) return;
    const result = await dispatch(deleteWarehouse(deletingWarehouse.id));
    if (deleteWarehouse.fulfilled.match(result)) {
      toast.success('Almacén eliminado');
      setDeletingWarehouse(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Almacenes</h1>
          <p className="text-sm text-slate-500">Ubicaciones donde guardas tu inventario</p>
        </div>
        <Button onClick={openCreateModal}>+ Nuevo almacén</Button>
      </div>

      <div className="mb-6 max-w-sm">
        <Input placeholder="Buscar por nombre..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filteredWarehouses.length === 0 ? (
        <EmptyState
          title={search ? 'Sin resultados' : 'Aún no tienes almacenes'}
          description={search ? 'Prueba con otro término de búsqueda.' : 'Crea tu primer almacén para empezar.'}
          action={!search && <Button onClick={openCreateModal}>+ Nuevo almacén</Button>}
        />
      ) : (
        <WarehouseTable warehouses={filteredWarehouses} onEdit={openEditModal} onDelete={setDeletingWarehouse} />
      )}

      <WarehouseFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isSaving={mutationStatus === 'loading'}
        warehouse={editingWarehouse}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingWarehouse)}
        title="Eliminar almacén"
        description={`¿Seguro que quieres eliminar "${deletingWarehouse?.name}"? Esta acción no se puede deshacer.`}
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleDelete}
        onClose={() => setDeletingWarehouse(null)}
      />
    </PageTransition>
  );
};
