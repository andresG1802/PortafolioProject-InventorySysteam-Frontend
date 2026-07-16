import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice';
import usersReducer from './users/usersSlice';
import uiReducer from './ui/uiSlice';
import categoriesReducer from './categories/categoriesSlice';
import suppliersReducer from './suppliers/suppliersSlice';
import warehousesReducer from './warehouses/warehousesSlice';
import customersReducer from './customers/customersSlice';
import stockMovementsReducer from './stockMovements/stockMovementsSlice';
import purchaseOrdersReducer from './purchaseOrders/purchaseOrdersSlice';
import salesOrdersReducer from './salesOrders/salesOrdersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    users: usersReducer,
    ui: uiReducer,
    categories: categoriesReducer,
    suppliers: suppliersReducer,
    warehouses: warehousesReducer,
    customers: customersReducer,
    stockMovements: stockMovementsReducer,
    purchaseOrders: purchaseOrdersReducer,
    salesOrders: salesOrdersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
