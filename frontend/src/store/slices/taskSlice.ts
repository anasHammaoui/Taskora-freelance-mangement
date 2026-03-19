import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksApi } from '../../api/tasks';
import type { TaskResponse, CreateTaskRequest, Page, TaskStatus } from '../../types';

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

export const fetchTasksByUser = createAsyncThunk<
  Page<TaskResponse>,
  { userId: number; page?: number; size?: number }
>('tasks/fetchByUser', async ({ userId, page = 0, size = 100 }, { rejectWithValue }) => {
  try {
    return await tasksApi.getByUser(userId, { page, size });
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load tasks');
  }
});

export const fetchTasksByProject = createAsyncThunk<
  Page<TaskResponse>,
  { projectId: number; status?: TaskStatus; page?: number; size?: number }
>('tasks/fetchByProject', async ({ projectId, status, page = 0, size = 100 }, { rejectWithValue }) => {
  try {
    return await tasksApi.getByProject(projectId, { status, page, size });
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load tasks');
  }
});

export const createTask = createAsyncThunk<TaskResponse, CreateTaskRequest>(
  'tasks/create',
  async (data, { rejectWithValue }) => {
    try {
      return await tasksApi.create(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk<TaskResponse, { id: number; data: CreateTaskRequest }>(
  'tasks/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await tasksApi.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

export const markTaskDone = createAsyncThunk<TaskResponse, number>(
  'tasks/markDone',
  async (id, { rejectWithValue }) => {
    try {
      return await tasksApi.markDone(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk<number, number>(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await tasksApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasksByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchTasksByUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchTasksByProject.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.totalElements += 1;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(markTaskDone.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        state.totalElements -= 1;
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
