import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedAdminRoute: React.FC = () => {
  const isAdminAuthenticated = useAuthStore((state) => state.isAdminAuthenticated);

  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
