import { useEffect, useState } from 'react';
import { Modal, Spinner } from '../../components/ui';
import { useAppSelector } from '../../store/hooks';
import { productsApi, getApiErrorMessage } from '../../api';
import type { Product, ProductStock } from '../../types';

interface ProductStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const ProductStockModal = ({ isOpen, onClose, product }: ProductStockModalProps) => {
  const warehouses = useAppSelector((state) => state.warehouses.items);
  const [stock, setStock] = useState<ProductStock | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !product) return;
    setLoading(true);
    setError(null);
    productsApi
      .getStock(product.id)
      .then(setStock)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isOpen, product]);

  const warehouseName = (warehouseId: string) =>
    warehouses.find((warehouse) => warehouse.id === warehouseId)?.name ?? warehouseId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Stock de ${product?.name ?? ''}`}>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-sm text-rose-400">{error}</p>
      ) : stock ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Stock total</div>
            <div className="text-2xl font-semibold text-slate-100">{stock.total} u.</div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Por almacén</div>
            {stock.byWarehouse.length === 0 ? (
              <p className="text-sm text-slate-500">Sin movimientos registrados.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {stock.byWarehouse.map((entry) => (
                  <li
                    key={entry.warehouseId}
                    className="flex items-center justify-between rounded-lg border border-slate-800 px-3.5 py-2 text-sm"
                  >
                    <span className="text-slate-300">{warehouseName(entry.warehouseId)}</span>
                    <span className="font-medium text-slate-100">{entry.quantity} u.</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
