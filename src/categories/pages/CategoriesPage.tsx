import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, EmptyState, Input, PageTransition, Spinner, ConfirmDialog } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../../store/categories/categoriesSlice';
import { CategoryTable } from '../components/CategoryTable';
import { CategoryFormModal } from '../components/CategoryFormModal';
import type { Category, CreateCategoryPayload } from '../../types';

export const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, mutationStatus } = useAppSelector((state) => state.categories);
  const [search, setSearch] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((category) => category.name.toLowerCase().includes(term));
  }, [items, search]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: CreateCategoryPayload) => {
    const result = editingCategory
      ? await dispatch(updateCategory({ id: editingCategory.id, payload }))
      : await dispatch(createCategory(payload));

    if (createCategory.fulfilled.match(result) || updateCategory.fulfilled.match(result)) {
      toast.success(editingCategory ? 'Categoría actualizada' : 'Categoría creada');
      setFormOpen(false);
      setEditingCategory(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    const result = await dispatch(deleteCategory(deletingCategory.id));
    if (deleteCategory.fulfilled.match(result)) {
      toast.success('Categoría eliminada');
      setDeletingCategory(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Categorías</h1>
          <p className="text-sm text-slate-500">Organiza tu catálogo de productos</p>
        </div>
        <Button onClick={openCreateModal}>+ Nueva categoría</Button>
      </div>

      <div className="mb-6 max-w-sm">
        <Input placeholder="Buscar por nombre..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title={search ? 'Sin resultados' : 'Aún no tienes categorías'}
          description={search ? 'Prueba con otro término de búsqueda.' : 'Crea tu primera categoría para empezar.'}
          action={!search && <Button onClick={openCreateModal}>+ Nueva categoría</Button>}
        />
      ) : (
        <CategoryTable categories={filteredCategories} onEdit={openEditModal} onDelete={setDeletingCategory} />
      )}

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isSaving={mutationStatus === 'loading'}
        category={editingCategory}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingCategory)}
        title="Eliminar categoría"
        description={`¿Seguro que quieres eliminar "${deletingCategory?.name}"? Esta acción no se puede deshacer.`}
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleDelete}
        onClose={() => setDeletingCategory(null)}
      />
    </PageTransition>
  );
};
