import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApiErrorMessage, usersApi } from '../../api';
import type { UpdateUserPayload, User } from '../../types';

interface UsersState {
  items: User[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutationStatus: 'idle' | 'loading' | 'failed';
}

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await usersApi.getAll();
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, payload }: { id: string; payload: UpdateUserPayload }, { rejectWithValue }) => {
    try {
      return await usersApi.update(id, payload);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteUser = createAsyncThunk('users/delete', async (id: string, { rejectWithValue }) => {
  try {
    await usersApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        const index = state.items.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.mutationStatus = 'idle';
        state.items = state.items.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
