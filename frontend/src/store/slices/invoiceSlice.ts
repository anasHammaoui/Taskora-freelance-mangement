import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoicesApi } from '../../api/invoices';
import type { InvoiceResponse, CreateInvoiceRequest, Page, InvoiceStatus } from '../../types';

interface InvoiceState {
  items: InvoiceResponse[];
  selected: InvoiceResponse | null;
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  items: [],
  selected: null,
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk<
  Page<InvoiceResponse>,
  { userId: number; status?: InvoiceStatus; page?: number; size?: number }
>('invoices/fetchAll', async ({ userId, status, page = 0, size = 50 }, { rejectWithValue }) => {
  try {
    return await invoicesApi.getByUser(userId, { status, page, size });
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load invoices');
  }
});

export const fetchInvoiceById = createAsyncThunk<InvoiceResponse, number>(
  'invoices/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await invoicesApi.getById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load invoice');
    }
  }
);

export const createInvoice = createAsyncThunk<InvoiceResponse, CreateInvoiceRequest>(
  'invoices/create',
  async (data, { rejectWithValue }) => {
    try {
      return await invoicesApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create invoice');
    }
  }
);

export const markInvoicePaid = createAsyncThunk<InvoiceResponse, number>(
  'invoices/markPaid',
  async (id, { rejectWithValue }) => {
    try {
      return await invoicesApi.markPaid(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update invoice');
    }
  }
);

export const cancelInvoice = createAsyncThunk<InvoiceResponse, number>(
  'invoices/cancel',
  async (id, { rejectWithValue }) => {
    try {
      return await invoicesApi.cancel(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel invoice');
    }
  }
);

export const deleteInvoice = createAsyncThunk<number, number>(
  'invoices/delete',
  async (id, { rejectWithValue }) => {
    try {
      await invoicesApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete invoice');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSelected: (state) => { state.selected = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchInvoices.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchInvoiceById.pending, (state) => { state.loading = true; })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
      .addCase(fetchInvoiceById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.totalElements += 1;
      })
      .addCase(markInvoicePaid.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(cancelInvoice.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.totalElements -= 1;
      });
  },
});

export const { clearError, clearSelected } = invoiceSlice.actions;
export default invoiceSlice.reducer;
