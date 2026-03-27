import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClientResponse, Page } from '../../types';

interface ClientState {
  items: ClientResponse[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setClients: (state, action: PayloadAction<Page<ClientResponse>>) => {
      state.items = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
    },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    addClient: (state, action: PayloadAction<ClientResponse>) => {
      state.items.unshift(action.payload);
      state.totalElements += 1;
    },
    updateClientItem: (state, action: PayloadAction<ClientResponse>) => {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeClient: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
      state.totalElements -= 1;
    },
    clearError: (state) => { state.error = null; },
  },
});

export const { setLoading, setClients, setError, addClient, updateClientItem, removeClient, clearError } = clientSlice.actions;
export default clientSlice.reducer;

