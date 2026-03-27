import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InvoiceResponse, Page } from '../../types';

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

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setInvoices: (state, action: PayloadAction<Page<InvoiceResponse>>) => {
      state.items = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    setSelected: (state, action: PayloadAction<InvoiceResponse>) => { state.selected = action.payload; },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    addInvoice: (state, action: PayloadAction<InvoiceResponse>) => {
      state.items.unshift(action.payload);
      state.totalElements += 1;
    },
    updateInvoiceItem: (state, action: PayloadAction<InvoiceResponse>) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      if (state.selected?.id === action.payload.id) state.selected = action.payload;
    },
    removeInvoice: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.totalElements -= 1;
    },
    clearError: (state) => { state.error = null; },
    clearSelected: (state) => { state.selected = null; },
  },
});

export const {
  setLoading, setInvoices, setSelected, setError,
  addInvoice, updateInvoiceItem, removeInvoice,
  clearError, clearSelected,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
