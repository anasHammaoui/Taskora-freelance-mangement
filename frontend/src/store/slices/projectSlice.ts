import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsApi } from '../../api/projects';
import type { ProjectResponse, CreateProjectRequest, Page, ProjectStatus } from '../../types';

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

export const fetchProjects = createAsyncThunk<
  Page<ProjectResponse>,
  { userId: number; status?: ProjectStatus; page?: number; size?: number }
>('projects/fetchAll', async ({ userId, status, page = 0, size = 50 }, { rejectWithValue }) => {
  try {
    return await projectsApi.getByUser(userId, { status, page, size });
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load projects');
  }
});

export const createProject = createAsyncThunk<ProjectResponse, CreateProjectRequest>(
  'projects/create',
  async (data, { rejectWithValue }) => {
    try {
      return await projectsApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk<ProjectResponse, { id: number; data: CreateProjectRequest }>(
  'projects/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await projectsApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update project');
    }
  }
);

export const markProjectComplete = createAsyncThunk<ProjectResponse, number>(
  'projects/markComplete',
  async (id, { rejectWithValue }) => {
    try {
      return await projectsApi.markComplete(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk<number, number>(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      await projectsApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.totalElements += 1;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(markProjectComplete.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.totalElements -= 1;
      });
  },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer;
