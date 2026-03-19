import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../../api/users';
import type { UserResponse, Page, UserStatus } from '../../types';

interface UserState {
  items: UserResponse[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchFreelancers = createAsyncThunk<
  Page<UserResponse>,
  { status?: UserStatus; search?: string; page?: number; size?: number }
>('users/fetchFreelancers', async (params, { rejectWithValue }) => {
  try {
    return await usersApi.getFreelancers({ ...params, size: params.size ?? 50 });
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load users');
  }
});

export const banUser = createAsyncThunk<UserResponse, number>(
  'users/ban',
  async (id, { rejectWithValue }) => {
    try {
      return await usersApi.ban(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to ban user');
    }
  }
);

export const activateUser = createAsyncThunk<UserResponse, number>(
  'users/activate',
  async (id, { rejectWithValue }) => {
    try {
      return await usersApi.activate(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to activate user');
    }
  }
);

export const deleteUser = createAsyncThunk<number, number>(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFreelancers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFreelancers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchFreelancers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(banUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload);
        state.totalElements -= 1;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
