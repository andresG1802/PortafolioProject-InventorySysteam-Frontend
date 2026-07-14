import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '../../components/ui';
import type { UpdateUserPayload, User } from '../../types';

interface UserFormValues {
  name: string;
  email: string;
  password: string;
}

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateUserPayload) => void;
  isSaving: boolean;
  user: User | null;
}

export const UserEditModal = ({ isOpen, onClose, onSubmit, isSaving, user }: UserEditModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>();

  useEffect(() => {
    if (isOpen) {
      reset({ name: user?.name ?? '', email: user?.email ?? '', password: '' });
    }
  }, [isOpen, user, reset]);

  const submit = (values: UserFormValues) => {
    const payload: UpdateUserPayload = { name: values.name, email: values.email };
    if (values.password) payload.password = values.password;
    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar usuario">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nombre"
          error={errors.name?.message}
          {...register('name', { required: 'El nombre es requerido' })}
        />
        <Input
          label="Correo electrónico"
          type="email"
          error={errors.email?.message}
          {...register('email', { required: 'El correo es requerido' })}
        />
        <Input
          label="Nueva contraseña (opcional)"
          type="password"
          placeholder="Dejar en blanco para no cambiarla"
          error={errors.password?.message}
          {...register('password', {
            minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
          })}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};
