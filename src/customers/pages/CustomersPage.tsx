import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, EmptyState, Input, PageTransition, Spinner, ConfirmDialog } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createCustomer, deleteCustomer, fetchCustomers, updateCustomer } from '../../store/customers/customersSlice';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerFormModal } from '../components/CustomerFormModal';
import type { CreateCustomerPayload, Customer } from '../../types';

export const CustomersPage = () => {
  const dispatch = useAppDispatch();
  const { items, status, mutationStatus } = useAppSelector((state) => state.customers);
  const [search, setSearch] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((customer) => customer.name.toLowerCase().includes(term));
  }, [items, search]);

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: CreateCustomerPayload) => {
    const result = editingCustomer
      ? await dispatch(updateCustomer({ id: editingCustomer.id, payload }))
      : await dispatch(createCustomer(payload));

    if (createCustomer.fulfilled.match(result) || updateCustomer.fulfilled.match(result)) {
      toast.success(editingCustomer ? 'Cliente actualizado' : 'Cliente creado');
      setFormOpen(false);
      setEditingCustomer(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDelete = async () => {
    if (!deletingCustomer) return;
    const result = await dispatch(deleteCustomer(deletingCustomer.id));
    if (deleteCustomer.fulfilled.match(result)) {
      toast.success('Cliente eliminado');
      setDeletingCustomer(null);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <PageTransition>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Clientes</h1>
          <p className="text-sm text-slate-500">Gestiona a quién le vendes</p>
        </div>
        <Button onClick={openCreateModal}>+ Nuevo cliente</Button>
      </div>

      <div className="mb-6 max-w-sm">
        <Input placeholder="Buscar por nombre..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          title={search ? 'Sin resultados' : 'Aún no tienes clientes'}
          description={search ? 'Prueba con otro término de búsqueda.' : 'Crea tu primer cliente para empezar.'}
          action={!search && <Button onClick={openCreateModal}>+ Nuevo cliente</Button>}
        />
      ) : (
        <CustomerTable customers={filteredCustomers} onEdit={openEditModal} onDelete={setDeletingCustomer} />
      )}

      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isSaving={mutationStatus === 'loading'}
        customer={editingCustomer}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingCustomer)}
        title="Eliminar cliente"
        description={`¿Seguro que quieres eliminar "${deletingCustomer?.name}"? Esta acción no se puede deshacer.`}
        isLoading={mutationStatus === 'loading'}
        onConfirm={handleDelete}
        onClose={() => setDeletingCustomer(null)}
      />
    </PageTransition>
  );
};
