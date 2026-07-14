import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApiErrorMessage, productsApi } from '../../api';
import type { CreateProductPayload, Product, UpdateProductPayload } from '../../types';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'failed';
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await productsApi.getAll();
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const createProduct = createAsyncThunk(
  'products/create',
  async (payload: CreateProductPayload, { rejectWithValue }) => {
    try {
      return await productsApi.create(payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, payload }: { id: string; payload: UpdateProductPayload }, { rejectWithValue }) => {
    try {
      return await productsApi.update(id, payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await productsApi.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateProduct.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        const index = state.items.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items = state.items.filter((product) => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearProductsError } = productsSlice.actions;
export default productsSlice.reducer;
