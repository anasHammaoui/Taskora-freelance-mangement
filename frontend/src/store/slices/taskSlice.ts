import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TaskResponse, Page } from '../../types';

interface TaskState {
  items: TaskResponse[];
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  totalElements: 0,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setTasks: (state, action: PayloadAction<Page<TaskResponse>>) => {
      state.items = action.payload.content;
      state.totalElements = action.payload.totalElements;
    },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    addTask: (state, action: PayloadAction<TaskResponse>) => {
      state.items.unshift(action.payload);
      state.totalElements += 1;
    },
    updateTaskItem: (state, action: PayloadAction<TaskResponse>) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      state.totalElements -= 1;
    },
    clearError: (state) => { state.error = null; },
  },
});

export const { setLoading, setTasks, setError, addTask, updateTaskItem, removeTask, clearError } = taskSlice.actions;
export default taskSlice.reducer;
