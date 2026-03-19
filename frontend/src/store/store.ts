import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientReducer from './slices/clientSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import invoiceReducer from './slices/invoiceSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
    projects: projectReducer,
    tasks: taskReducer,
    invoices: invoiceReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
