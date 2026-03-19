import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientsApi } from '../../api/clients';
import type { ClientResponse, CreateClientRequest, Page } from '../../types';

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

export const fetchClients = createAsyncThunk<Page<ClientResponse>, { userId: number; search?: string; page?: number; size?: number }>(
  'clients/fetchAll',
  async ({ userId, page = 0, size = 50 }, { rejectWithValue }) => {
    try {
      return await clientsApi.getByUser(userId, { page, size });
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load clients');
    }
  }
);

export const createClient = createAsyncThunk<ClientResponse, CreateClientRequest>(
  'clients/create',
  async (data, { rejectWithValue }) => {
    try {
      return await clientsApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create client');
    }
  }
);

export const updateClient = createAsyncThunk<ClientResponse, { id: number; data: CreateClientRequest }>(
  'clients/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await clientsApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update client');
    }
  }
);

export const deleteClient = createAsyncThunk<number, number>(
  'clients/delete',
  async (id, { rejectWithValue }) => {
    try {
      await clientsApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete client');
    }
  }
);

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchClients.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createClient.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.totalElements += 1;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
        state.totalElements -= 1;
      });
  },
});

export const { clearError } = clientSlice.actions;
export default clientSlice.reducer;
