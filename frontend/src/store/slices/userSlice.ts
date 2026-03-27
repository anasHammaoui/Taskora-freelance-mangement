import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserResponse, Page } from '../../types';

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

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setUsers: (state, action: PayloadAction<Page<UserResponse>>) => {
      state.items = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    updateUserItem: (state, action: PayloadAction<UserResponse>) => {
      const idx = state.items.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((u) => u.id !== action.payload);
      state.totalElements -= 1;
    },
    clearError: (state) => { state.error = null; },
  },
});

export const { setLoading, setUsers, setError, updateUserItem, removeUser, clearError } = userSlice.actions;
export default userSlice.reducer;
