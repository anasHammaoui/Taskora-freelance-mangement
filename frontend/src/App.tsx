import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { RequireAuth, GuestOnly } from './components/auth/RouteGuard';
import { RouterProgress } from './components/RouterProgress';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const ClientsPage = lazy(() => import('./pages/clients/ClientsPage'));
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsPage'));
const TasksPage = lazy(() => import('./pages/tasks/TasksPage'));
const InvoicesPage = lazy(() => import('./pages/invoices/InvoicesPage'));
const InvoiceDetailPage = lazy(() => import('./pages/invoices/InvoiceDetailPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/UsersPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));

const Fallback = () => (
  <div className="flex h-full items-center justify-center">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <RouterProgress />
      <Routes>
        {/* Public routes */}
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Freelancer-only routes */}
            <Route element={<RequireAuth requiredRole="ROLE_FREELANCER" />}>
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
            </Route>

            {/* Admin only */}
            <Route element={<RequireAuth requiredRole="ROLE_ADMIN" />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
