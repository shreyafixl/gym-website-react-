import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protected Route Component
 * Ensures only authenticated users with specific roles can access routes
 */
const ProtectedRoute = ({ children, allowedRoles = null, requiredRole = null }) => {
  const { user, isLoggedIn } = useAuth();

  console.log('🔐 ProtectedRoute check:', {
    isLoggedIn,
    userRole: user?.role,
    allowedRoles,
    requiredRole,
  });

  // Check if user is logged in
  if (!isLoggedIn) {
    console.log('❌ ProtectedRoute: User not logged in, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (support both allowedRoles array and requiredRole string)
  const roleToCheck = requiredRole || (allowedRoles && allowedRoles[0]);
  
  if (roleToCheck && user?.role !== roleToCheck) {
    console.log('❌ ProtectedRoute: User role mismatch, redirecting to /unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;
