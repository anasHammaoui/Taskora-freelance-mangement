import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '../../types';

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setUser: (state, action: PayloadAction<AuthResponse>) => { state.user = action.payload; },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
  },
});

export const { setLoading, setUser, setError, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
