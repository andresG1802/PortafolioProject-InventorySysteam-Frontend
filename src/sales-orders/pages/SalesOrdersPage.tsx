import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, EmptyState, PageTransition, Spinner, ConfirmDialog } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  cancelSalesOrder,
  confirmSalesOrder,
  createSalesOrder,
  deleteSalesOrder,
  deliverSalesOrder,
  fetchSalesOrders,
  updateSalesOrder,
} from '../../store/salesOrders/salesOrdersSlice';
import { fetchCustomers } from '../../store/customers/customersSlice';
import { fetchWarehouses } from '../../store/warehouses/warehousesSlice';
import { fetchProducts } from '../../store/products/productsSlice';
import { SalesOrderTable } from '../components/SalesOrderTable';
import { SalesOrderFormModal } from '../components/SalesOrderFormModal';
import { SalesOrderDetailModal } from '../components/SalesOrderDetailModal';
import type { CreateSalesOrderPayload, SalesOrder } from '../../types';

export const SalesOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, mutationStatus } = useAppSelector((state) => state.salesOrders);
  const customers = useAppSelector((state) => state.customers.items);
  const warehouses = useAppSelector((state) => state.warehouses.items);
  const products = useAppSelector((state) => state.products.items);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [detailOrder, setDetailOrder] = useState<SalesOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<SalesOrder | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<SalesOrder | null>(null);

  useEffect(() => {
    dispatch(fetchSalesOrders());
    dispatch(fetchCustomers());
    dispatch(fetchWarehouses());
    dispatch(fetchProducts());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingOrder(null);
    setFormOpen(true);
  };

  const openEditModal = (order: SalesOrder) => {
    setDetailOrder(null);
    setEditingOrder(order);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: CreateSalesOrderPayload) => {
    const result = editingOrder
      ? await dispatch(updateSalesOrder({ id: editingOrder.id, payload }))
      : await dispatch(createSalesOrder(payload));

    if (createSalesOrder.fulfilled.match(result) || updateSalesOrder.fulfilled.match(result)) {
      toast.success(editingOrder ? 'Orden actualizada' : 'Orden creada');
      setFormOpen(false);
      setEditingOrder(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleConfirm = async (order: SalesOrder) => {
    const result = await dispatch(confirmSalesOrder(order.id));
    if (confirmSalesOrder.fulfilled.match(result)) {
      toast.success('Orden confirmada: stock descontado');
      setDetailOrder(result.payload);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDeliver = async (order: SalesOrder) => {
    const result = await dispatch(deliverSalesOrder(order.id));
    if (deliverSalesOrder.fulfilled.match(result)) {
      toast.success('Orden entregada');
      setDetailOrder(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDelete = async () => {
    if (!deletingOrder) return;
    const result = await dispatch(deleteSalesOrder(deletingOrder.id));
    if (deleteSalesOrder.fulfilled.match(result)) {
      toast.success('Orden eliminada');
      setDeletingOrder(null);
      setDetailOrder(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleCancel = async () => {
    if (!cancellingOrder) return;
    const result = await dispatch(cancelSalesOrder(cancellingOrder.id));
    if (cancelSalesOrder.fulfilled.match(result)) {
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
          <h1 className="text-2xl font-semibold text-slate-100">Órdenes de venta</h1>
          <p className="text-sm text-slate-500">Vende desde tu inventario a tus clientes</p>
        </div>
        <Button onClick={openCreateModal}>+ Nueva orden</Button>
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Aún no tienes órdenes de venta"
          description="Crea tu primera orden para vender inventario."
          action={<Button onClick={openCreateModal}>+ Nueva orden</Button>}
        />
      ) : (
        <SalesOrderTable orders={items} customers={customers} warehouses={warehouses} onViewDetail={setDetailOrder} />
      )}

      <SalesOrderFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isSaving={mutationStatus === 'loading'}
        order={editingOrder}
        customers={customers}
        warehouses={warehouses}
        products={products}
      />

      <SalesOrderDetailModal
        isOpen={Boolean(detailOrder)}
        onClose={() => setDetailOrder(null)}
        order={detailOrder}
        customers={customers}
        warehouses={warehouses}
        products={products}
        isMutating={mutationStatus === 'loading'}
        onEdit={openEditModal}
        onDelete={setDeletingOrder}
        onConfirm={handleConfirm}
        onDeliver={handleDeliver}
        onCancel={setCancellingOrder}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingOrder)}
        title="Eliminar orden de venta"
        description="¿Seguro que quieres eliminar esta orden? Esta acción no se puede deshacer."
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleDelete}
        onClose={() => setDeletingOrder(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(cancellingOrder)}
        title="Cancelar orden de venta"
        description="¿Seguro que quieres cancelar esta orden? Si estaba confirmada, el stock se revertirá."
        confirmLabel="Cancelar orden"
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleCancel}
        onClose={() => setCancellingOrder(null)}
      />
    </PageTransition>
  );
};
