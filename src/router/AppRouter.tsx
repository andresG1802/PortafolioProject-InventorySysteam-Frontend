import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../auth/pages/LoginPage';
import { RegisterPage } from '../auth/pages/RegisterPage';
import { DashboardLayout } from '../layout/pages/DashboardLayout';
import { ProductsPage } from '../products/pages/ProductsPage';
import { UsersPage } from '../users/pages/UsersPage';
import { CategoriesPage } from '../categories/pages/CategoriesPage';
import { SuppliersPage } from '../suppliers/pages/SuppliersPage';
import { WarehousesPage } from '../warehouses/pages/WarehousesPage';
import { CustomersPage } from '../customers/pages/CustomersPage';
import { StockMovementsPage } from '../stock-movements/pages/StockMovementsPage';
import { PurchaseOrdersPage } from '../purchase-orders/pages/PurchaseOrdersPage';
import { SalesOrdersPage } from '../sales-orders/pages/SalesOrdersPage';
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
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
        <Route path="/stock-movements" element={<StockMovementsPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/sales-orders" element={<SalesOrdersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>
    </Route>

    <Route path="/" element={<Navigate to="/products" replace />} />
    <Route path="*" element={<Navigate to="/products" replace />} />
  </Routes>
);
