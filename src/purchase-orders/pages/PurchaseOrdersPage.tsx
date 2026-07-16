import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, EmptyState, PageTransition, Spinner, ConfirmDialog } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  cancelPurchaseOrder,
  confirmPurchaseOrder,
  createPurchaseOrder,
  deletePurchaseOrder,
  fetchPurchaseOrders,
  receivePurchaseOrder,
  updatePurchaseOrder,
} from '../../store/purchaseOrders/purchaseOrdersSlice';
import { fetchSuppliers } from '../../store/suppliers/suppliersSlice';
import { fetchWarehouses } from '../../store/warehouses/warehousesSlice';
import { fetchProducts } from '../../store/products/productsSlice';
import { PurchaseOrderTable } from '../components/PurchaseOrderTable';
import { PurchaseOrderFormModal } from '../components/PurchaseOrderFormModal';
import { PurchaseOrderDetailModal } from '../components/PurchaseOrderDetailModal';
import type { CreatePurchaseOrderPayload, PurchaseOrder } from '../../types';

export const PurchaseOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, mutationStatus } = useAppSelector((state) => state.purchaseOrders);
  const suppliers = useAppSelector((state) => state.suppliers.items);
  const warehouses = useAppSelector((state) => state.warehouses.items);
  const products = useAppSelector((state) => state.products.items);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [detailOrder, setDetailOrder] = useState<PurchaseOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<PurchaseOrder | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
    dispatch(fetchSuppliers());
    dispatch(fetchWarehouses());
    dispatch(fetchProducts());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingOrder(null);
    setFormOpen(true);
  };

  const openEditModal = (order: PurchaseOrder) => {
    setDetailOrder(null);
    setEditingOrder(order);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: CreatePurchaseOrderPayload) => {
    const result = editingOrder
      ? await dispatch(updatePurchaseOrder({ id: editingOrder.id, payload }))
      : await dispatch(createPurchaseOrder(payload));

    if (createPurchaseOrder.fulfilled.match(result) || updatePurchaseOrder.fulfilled.match(result)) {
      toast.success(editingOrder ? 'Orden actualizada' : 'Orden creada');
      setFormOpen(false);
      setEditingOrder(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleConfirm = async (order: PurchaseOrder) => {
    const result = await dispatch(confirmPurchaseOrder(order.id));
    if (confirmPurchaseOrder.fulfilled.match(result)) {
      toast.success('Orden confirmada');
      setDetailOrder(result.payload);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleReceive = async (order: PurchaseOrder) => {
    const result = await dispatch(receivePurchaseOrder(order.id));
    if (receivePurchaseOrder.fulfilled.match(result)) {
      toast.success('Orden recibida: stock actualizado');
      setDetailOrder(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDelete = async () => {
    if (!deletingOrder) return;
    const result = await dispatch(deletePurchaseOrder(deletingOrder.id));
    if (deletePurchaseOrder.fulfilled.match(result)) {
      toast.success('Orden eliminada');
      setDeletingOrder(null);
      setDetailOrder(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleCancel = async () => {
    if (!cancellingOrder) return;
    const result = await dispatch(cancelPurchaseOrder(cancellingOrder.id));
    if (cancelPurchaseOrder.fulfilled.match(result)) {
      toast.success('Orden cancelada');
      setCancellingOrder(null);
      setDetailOrder(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Órdenes de compra</h1>
          <p className="text-sm text-slate-500">Reabastece tu inventario desde tus proveedores</p>
        </div>
        <Button onClick={openCreateModal}>+ Nueva orden</Button>
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Aún no tienes órdenes de compra"
          description="Crea tu primera orden para reabastecer inventario."
          action={<Button onClick={openCreateModal}>+ Nueva orden</Button>}
        />
      ) : (
        <PurchaseOrderTable orders={items} suppliers={suppliers} warehouses={warehouses} onViewDetail={setDetailOrder} />
      )}

      <PurchaseOrderFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isSaving={mutationStatus === 'loading'}
        order={editingOrder}
        suppliers={suppliers}
        warehouses={warehouses}
        products={products}
      />

      <PurchaseOrderDetailModal
        isOpen={Boolean(detailOrder)}
        onClose={() => setDetailOrder(null)}
        order={detailOrder}
        suppliers={suppliers}
        warehouses={warehouses}
        products={products}
        isMutating={mutationStatus === 'loading'}
        onEdit={openEditModal}
        onDelete={setDeletingOrder}
        onConfirm={handleConfirm}
        onReceive={handleReceive}
        onCancel={setCancellingOrder}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingOrder)}
        title="Eliminar orden de compra"
        description="¿Seguro que quieres eliminar esta orden? Esta acción no se puede deshacer."
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleDelete}
        onClose={() => setDeletingOrder(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(cancellingOrder)}
        title="Cancelar orden de compra"
        description="¿Seguro que quieres cancelar esta orden?"
        confirmLabel="Cancelar orden"
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleCancel}
        onClose={() => setCancellingOrder(null)}
      />
    </PageTransition>
  );
};
