import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protected Super Admin Route
 * Ensures only authenticated super admin users can access the route
 */
const ProtectedSuperAdminRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'superadmin' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedSuperAdminRoute;
