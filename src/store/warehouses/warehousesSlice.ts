import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { warehousesApi, getApiErrorMessage } from '../../api';
import type { Warehouse, CreateWarehousePayload, UpdateWarehousePayload } from '../../types';

interface WarehousesState {
  items: Warehouse[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'failed';
}

const initialState: WarehousesState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchWarehouses = createAsyncThunk('warehouses/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await warehousesApi.getAll();
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const createWarehouse = createAsyncThunk(
  'warehouses/create',
  async (payload: CreateWarehousePayload, { rejectWithValue }) => {
    try {
      return await warehousesApi.create(payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const updateWarehouse = createAsyncThunk(
  'warehouses/update',
  async ({ id, payload }: { id: string; payload: UpdateWarehousePayload }, { rejectWithValue }) => {
    try {
      return await warehousesApi.update(id, payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteWarehouse = createAsyncThunk('warehouses/delete', async (id: string, { rejectWithValue }) => {
  try {
    await warehousesApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const warehousesSlice = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {
    clearWarehousesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createWarehouse.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items.unshift(action.payload);
      })
      .addCase(createWarehouse.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateWarehouse.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        const index = state.items.findIndex((warehouse) => warehouse.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateWarehouse.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteWarehouse.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items = state.items.filter((warehouse) => warehouse.id !== action.payload);
      })
      .addCase(deleteWarehouse.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearWarehousesError } = warehousesSlice.actions;
export default warehousesSlice.reducer;
