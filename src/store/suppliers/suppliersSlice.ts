import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { suppliersApi, getApiErrorMessage } from '../../api';
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../../types';

interface SuppliersState {
  items: Supplier[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'failed';
}

const initialState: SuppliersState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchSuppliers = createAsyncThunk('suppliers/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await suppliersApi.getAll();
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const createSupplier = createAsyncThunk(
  'suppliers/create',
  async (payload: CreateSupplierPayload, { rejectWithValue }) => {
    try {
      return await suppliersApi.create(payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const updateSupplier = createAsyncThunk(
  'suppliers/update',
  async ({ id, payload }: { id: string; payload: UpdateSupplierPayload }, { rejectWithValue }) => {
    try {
      return await suppliersApi.update(id, payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteSupplier = createAsyncThunk('suppliers/delete', async (id: string, { rejectWithValue }) => {
  try {
    await suppliersApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearSuppliersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createSupplier.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items.unshift(action.payload);
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateSupplier.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        const index = state.items.findIndex((supplier) => supplier.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteSupplier.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items = state.items.filter((supplier) => supplier.id !== action.payload);
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearSuppliersError } = suppliersSlice.actions;
export default suppliersSlice.reducer;
