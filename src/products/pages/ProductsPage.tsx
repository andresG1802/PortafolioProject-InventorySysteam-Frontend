import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, EmptyState, Input, PageTransition, Spinner, ConfirmDialog } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../../store/products/productsSlice';
import { fetchWarehouses } from '../../store/warehouses/warehousesSlice';
import { ProductTable } from '../components/ProductTable';
import { ProductFormModal } from '../components/ProductFormModal';
import { ProductStockModal } from '../components/ProductStockModal';
import type { CreateProductPayload, Product } from '../../types';

export const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, mutationStatus } = useAppSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchWarehouses());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (product) =>
        product.name.toLowerCase().includes(term) || product.category?.name.toLowerCase().includes(term),
    );
  }, [items, search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: CreateProductPayload) => {
    const result = editingProduct
      ? await dispatch(updateProduct({ id: editingProduct.id, payload }))
      : await dispatch(createProduct(payload));

    if (createProduct.fulfilled.match(result) || updateProduct.fulfilled.match(result)) {
      toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado');
      setFormOpen(false);
      setEditingProduct(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    const result = await dispatch(deleteProduct(deletingProduct.id));
    if (deleteProduct.fulfilled.match(result)) {
      toast.success('Producto eliminado');
      setDeletingProduct(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Productos</h1>
          <p className="text-sm text-slate-500">Gestiona el catálogo de tu inventario</p>
        </div>
        <Button onClick={openCreateModal}>+ Nuevo producto</Button>
      </div>

      <div className="mb-6 max-w-sm">
        <Input
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={search ? 'Sin resultados' : 'Aún no tienes productos'}
          description={search ? 'Prueba con otro término de búsqueda.' : 'Crea tu primer producto para empezar.'}
          action={!search && <Button onClick={openCreateModal}>+ Nuevo producto</Button>}
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={setDeletingProduct}
          onViewStock={setStockProduct}
        />
      )}

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isSaving={mutationStatus === 'loading'}
        product={editingProduct}
      />

      <ProductStockModal isOpen={Boolean(stockProduct)} onClose={() => setStockProduct(null)} product={stockProduct} />

      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        title="Eliminar producto"
        description={`¿Seguro que quieres eliminar "${deletingProduct?.name}"? Esta acción no se puede deshacer.`}
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleDelete}
        onClose={() => setDeletingProduct(null)}
      />
    </PageTransition>
  );
};
