import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/auth';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../../types';

interface AuthState {
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
}

const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<AuthResponse, LoginRequest>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterRequest>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
