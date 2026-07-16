import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getApiErrorMessage, salesOrdersApi } from '../../api';
import type { CreateSalesOrderPayload, SalesOrder, UpdateSalesOrderPayload } from '../../types';

interface SalesOrdersState {
  items: SalesOrder[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'failed';
}

const initialState: SalesOrdersState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchSalesOrders = createAsyncThunk('salesOrders/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await salesOrdersApi.getAll();
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const createSalesOrder = createAsyncThunk(
  'salesOrders/create',
  async (payload: CreateSalesOrderPayload, { rejectWithValue }) => {
    try {
      return await salesOrdersApi.create(payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const updateSalesOrder = createAsyncThunk(
  'salesOrders/update',
  async ({ id, payload }: { id: string; payload: UpdateSalesOrderPayload }, { rejectWithValue }) => {
    try {
      return await salesOrdersApi.update(id, payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteSalesOrder = createAsyncThunk('salesOrders/delete', async (id: string, { rejectWithValue }) => {
  try {
    await salesOrdersApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const confirmSalesOrder = createAsyncThunk('salesOrders/confirm', async (id: string, { rejectWithValue }) => {
  try {
    return await salesOrdersApi.confirm(id);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const deliverSalesOrder = createAsyncThunk('salesOrders/deliver', async (id: string, { rejectWithValue }) => {
  try {
    return await salesOrdersApi.deliver(id);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const cancelSalesOrder = createAsyncThunk('salesOrders/cancel', async (id: string, { rejectWithValue }) => {
  try {
    return await salesOrdersApi.cancel(id);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const upsert = (state: SalesOrdersState, order: SalesOrder) => {
  state.mutationStatus = 'idle';
  const index = state.items.findIndex((item) => item.id === order.id);
  if (index !== -1) state.items[index] = order;
};

const salesOrdersSlice = createSlice({
  name: 'salesOrders',
  initialState,
  reducers: {
    clearSalesOrdersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items.unshift(action.payload);
      })
      .addCase(updateSalesOrder.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(confirmSalesOrder.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(deliverSalesOrder.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(cancelSalesOrder.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(deleteSalesOrder.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items = state.items.filter((order) => order.id !== action.payload);
      })
      .addMatcher(
        isAnyOf(
          createSalesOrder.pending,
          updateSalesOrder.pending,
          deleteSalesOrder.pending,
          confirmSalesOrder.pending,
          deliverSalesOrder.pending,
          cancelSalesOrder.pending,
        ),
        (state) => {
          state.mutationStatus = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          createSalesOrder.rejected,
          updateSalesOrder.rejected,
          deleteSalesOrder.rejected,
          confirmSalesOrder.rejected,
          deliverSalesOrder.rejected,
          cancelSalesOrder.rejected,
        ),
        (state, action) => {
          state.mutationStatus = 'failed';
          state.error = action.payload as string;
        },
      );
  },
});

export const { clearSalesOrdersError } = salesOrdersSlice.actions;
export default salesOrdersSlice.reducer;
