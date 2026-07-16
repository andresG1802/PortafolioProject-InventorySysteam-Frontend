import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, EmptyState, PageTransition, Select, Spinner } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createStockMovement, createStockTransfer, fetchStockMovements } from '../../store/stockMovements/stockMovementsSlice';
import { fetchProducts } from '../../store/products/productsSlice';
import { fetchWarehouses } from '../../store/warehouses/warehousesSlice';
import { StockMovementTable } from '../components/StockMovementTable';
import { CreateMovementModal } from '../components/CreateMovementModal';
import { TransferModal } from '../components/TransferModal';
import type { CreateStockMovementPayload, CreateStockTransferPayload } from '../../types';

export const StockMovementsPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, mutationStatus } = useAppSelector((state) => state.stockMovements);
  const products = useAppSelector((state) => state.products.items);
  const warehouses = useAppSelector((state) => state.warehouses.items);
  const [productFilter, setProductFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [isMovementModalOpen, setMovementModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchWarehouses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStockMovements({ productId: productFilter || undefined, warehouseId: warehouseFilter || undefined }));
  }, [dispatch, productFilter, warehouseFilter]);

  const handleCreateMovement = async (payload: CreateStockMovementPayload) => {
    const result = await dispatch(createStockMovement(payload));
    if (createStockMovement.fulfilled.match(result)) {
      toast.success('Movimiento registrado');
      setMovementModalOpen(false);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleTransfer = async (payload: CreateStockTransferPayload) => {
    const result = await dispatch(createStockTransfer(payload));
    if (createStockTransfer.fulfilled.match(result)) {
      toast.success('Transferencia realizada');
      setTransferModalOpen(false);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Movimientos de stock</h1>
          <p className="text-sm text-slate-500">Kardex: historial auditable de entradas, salidas y ajustes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setTransferModalOpen(true)}>
            Transferir
          </Button>
          <Button onClick={() => setMovementModalOpen(true)}>+ Movimiento</Button>
        </div>
      </div>

      <div className="mb-6 grid max-w-xl grid-cols-2 gap-4">
        <Select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}>
          <option value="">Todos los productos</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
        <Select value={warehouseFilter} onChange={(event) => setWarehouseFilter(event.target.value)}>
          <option value="">Todos los almacenes</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </Select>
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="Sin movimientos registrados" description="Registra el primer movimiento de stock." />
      ) : (
        <StockMovementTable movements={items} products={products} warehouses={warehouses} />
      )}

      <CreateMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setMovementModalOpen(false)}
        onSubmit={handleCreateMovement}
        isSaving={mutationStatus === 'loading'}
        products={products}
        warehouses={warehouses}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onSubmit={handleTransfer}
        isSaving={mutationStatus === 'loading'}
        products={products}
        warehouses={warehouses}
      />
    </PageTransition>
  );
};
