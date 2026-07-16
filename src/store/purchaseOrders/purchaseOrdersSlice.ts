import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getApiErrorMessage, purchaseOrdersApi } from '../../api';
import type { CreatePurchaseOrderPayload, PurchaseOrder, UpdatePurchaseOrderPayload } from '../../types';

interface PurchaseOrdersState {
  items: PurchaseOrder[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'failed';
}

const initialState: PurchaseOrdersState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchPurchaseOrders = createAsyncThunk('purchaseOrders/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await purchaseOrdersApi.getAll();
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const createPurchaseOrder = createAsyncThunk(
  'purchaseOrders/create',
  async (payload: CreatePurchaseOrderPayload, { rejectWithValue }) => {
    try {
      return await purchaseOrdersApi.create(payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const updatePurchaseOrder = createAsyncThunk(
  'purchaseOrders/update',
  async ({ id, payload }: { id: string; payload: UpdatePurchaseOrderPayload }, { rejectWithValue }) => {
    try {
      return await purchaseOrdersApi.update(id, payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deletePurchaseOrder = createAsyncThunk('purchaseOrders/delete', async (id: string, { rejectWithValue }) => {
  try {
    await purchaseOrdersApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const confirmPurchaseOrder = createAsyncThunk('purchaseOrders/confirm', async (id: string, { rejectWithValue }) => {
  try {
    return await purchaseOrdersApi.confirm(id);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const receivePurchaseOrder = createAsyncThunk('purchaseOrders/receive', async (id: string, { rejectWithValue }) => {
  try {
    return await purchaseOrdersApi.receive(id);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const cancelPurchaseOrder = createAsyncThunk('purchaseOrders/cancel', async (id: string, { rejectWithValue }) => {
  try {
    return await purchaseOrdersApi.cancel(id);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const upsert = (state: PurchaseOrdersState, order: PurchaseOrder) => {
  state.mutationStatus = 'idle';
  const index = state.items.findIndex((item) => item.id === order.id);
  if (index !== -1) state.items[index] = order;
};

const purchaseOrdersSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    clearPurchaseOrdersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items.unshift(action.payload);
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(confirmPurchaseOrder.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(receivePurchaseOrder.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(cancelPurchaseOrder.fulfilled, (state, action) => upsert(state, action.payload))
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items = state.items.filter((order) => order.id !== action.payload);
      })
      .addMatcher(
        isAnyOf(
          createPurchaseOrder.pending,
          updatePurchaseOrder.pending,
          deletePurchaseOrder.pending,
          confirmPurchaseOrder.pending,
          receivePurchaseOrder.pending,
          cancelPurchaseOrder.pending,
        ),
        (state) => {
          state.mutationStatus = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          createPurchaseOrder.rejected,
          updatePurchaseOrder.rejected,
          deletePurchaseOrder.rejected,
          confirmPurchaseOrder.rejected,
          receivePurchaseOrder.rejected,
          cancelPurchaseOrder.rejected,
        ),
        (state, action) => {
          state.mutationStatus = 'failed';
          state.error = action.payload as string;
        },
      );
  },
});

export const { clearPurchaseOrdersError } = purchaseOrdersSlice.actions;
export default purchaseOrdersSlice.reducer;
