import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { Button, Input } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearAuthError, registerThunk } from '../../store/auth/authSlice';
import type { RegisterPayload } from '../../types';

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>();

  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);

  const onSubmit = async (data: RegisterPayload) => {
    const result = await dispatch(registerThunk(data));
    if (registerThunk.fulfilled.match(result)) {
      navigate('/products', { replace: true });
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <AuthLayout>
      <h1 className="mb-1 text-2xl font-semibold text-slate-50">Crea tu cuenta</h1>
      <p className="mb-6 text-sm text-slate-400">Empieza a administrar tu inventario</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nombre"
          placeholder="Tu nombre"
          error={errors.name?.message}
          {...register('name', { required: 'El nombre es requerido' })}
        />
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'El correo es requerido',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de correo inválido' },
          })}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          error={errors.password?.message}
          {...register('password', {
            required: 'La contraseña es requerida',
            minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
          })}
        />
        <Button type="submit" isLoading={status === 'loading'} className="mt-2 w-full">
          Crear cuenta
        </Button>
      </form>
      {error && <p className="mt-4 text-center text-sm text-rose-400">{error}</p>}
      <p className="mt-6 text-center text-sm text-slate-400">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
};
