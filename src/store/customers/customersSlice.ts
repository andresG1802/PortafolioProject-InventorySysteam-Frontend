import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { customersApi, getApiErrorMessage } from '../../api';
import type { Customer, CreateCustomerPayload, UpdateCustomerPayload } from '../../types';

interface CustomersState {
  items: Customer[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'failed';
}

const initialState: CustomersState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await customersApi.getAll();
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (payload: CreateCustomerPayload, { rejectWithValue }) => {
    try {
      return await customersApi.create(payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, payload }: { id: string; payload: UpdateCustomerPayload }, { rejectWithValue }) => {
    try {
      return await customersApi.update(id, payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteCustomer = createAsyncThunk('customers/delete', async (id: string, { rejectWithValue }) => {
  try {
    await customersApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createCustomer.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        const index = state.items.findIndex((customer) => customer.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items = state.items.filter((customer) => customer.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearCustomersError } = customersSlice.actions;
export default customersSlice.reducer;
