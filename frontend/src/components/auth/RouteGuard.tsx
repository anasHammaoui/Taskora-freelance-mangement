import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store/store';

export const RequireAuth: React.FC<{ requiredRole?: string }> = ({ requiredRole }) => {
  const user = useAppSelector((s: RootState) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export const GuestOnly: React.FC = () => {
  const user = useAppSelector((s: RootState) => s.auth.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
