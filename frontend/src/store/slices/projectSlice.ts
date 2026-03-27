import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProjectResponse, Page } from '../../types';

interface ProjectState {
  items: ProjectResponse[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setProjects: (state, action: PayloadAction<Page<ProjectResponse>>) => {
      state.items = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
    },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    addProject: (state, action: PayloadAction<ProjectResponse>) => {
      state.items.unshift(action.payload);
      state.totalElements += 1;
    },
    updateProjectItem: (state, action: PayloadAction<ProjectResponse>) => {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeProject: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.totalElements -= 1;
    },
    clearError: (state) => { state.error = null; },
  },
});

export const { setLoading, setProjects, setError, addProject, updateProjectItem, removeProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
