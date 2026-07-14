import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../auth/pages/LoginPage';
import { RegisterPage } from '../auth/pages/RegisterPage';
import { DashboardLayout } from '../layout/pages/DashboardLayout';
import { ProductsPage } from '../products/pages/ProductsPage';
import { UsersPage } from '../users/pages/UsersPage';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

export const AppRouter = () => (
  <Routes>
    <Route element={<PublicOnlyRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>
    </Route>

    <Route path="/" element={<Navigate to="/products" replace />} />
    <Route path="*" element={<Navigate to="/products" replace />} />
  </Routes>
);
