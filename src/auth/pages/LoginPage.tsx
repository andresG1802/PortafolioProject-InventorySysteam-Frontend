import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { Button, Input } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearAuthError, loginThunk } from '../../store/auth/authSlice';
import type { LoginPayload } from '../../types';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  useEffect(() => () => { dispatch(clearAuthError()); }, [dispatch]);

  const onSubmit = async (data: LoginPayload) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      navigate('/products', { replace: true });
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <AuthLayout>
      <h1 className="mb-1 text-2xl font-semibold text-slate-50">Bienvenido de nuevo</h1>
      <p className="mb-6 text-sm text-slate-400">Inicia sesión para gestionar tu inventario</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          error={errors.email?.message}
          {...register('email', { required: 'El correo es requerido' })}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'La contraseña es requerida' })}
        />
        <Button type="submit" isLoading={status === 'loading'} className="mt-2 w-full">
          Iniciar sesión
        </Button>
      </form>
      {error && <p className="mt-4 text-center text-sm text-rose-400">{error}</p>}
      <p className="mt-6 text-center text-sm text-slate-400">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
};
