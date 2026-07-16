import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApiErrorMessage, stockMovementsApi } from '../../api';
import type {
  CreateStockMovementPayload,
  CreateStockTransferPayload,
  StockMovement,
  StockMovementFilter,
} from '../../types';

interface StockMovementsState {
  items: StockMovement[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'failed';
}

const initialState: StockMovementsState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchStockMovements = createAsyncThunk(
  'stockMovements/fetchAll',
  async (filter: StockMovementFilter, { rejectWithValue }) => {
    try {
      return await stockMovementsApi.getAll(filter);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const createStockMovement = createAsyncThunk(
  'stockMovements/create',
  async (payload: CreateStockMovementPayload, { rejectWithValue }) => {
    try {
      return await stockMovementsApi.create(payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const createStockTransfer = createAsyncThunk(
  'stockMovements/transfer',
  async (payload: CreateStockTransferPayload, { rejectWithValue }) => {
    try {
      return await stockMovementsApi.transfer(payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const stockMovementsSlice = createSlice({
  name: 'stockMovements',
  initialState,
  reducers: {
    clearStockMovementsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createStockMovement.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createStockMovement.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items.unshift(action.payload);
      })
      .addCase(createStockMovement.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createStockTransfer.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createStockTransfer.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items.unshift(...action.payload);
      })
      .addCase(createStockTransfer.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearStockMovementsError } = stockMovementsSlice.actions;
export default stockMovementsSlice.reducer;
