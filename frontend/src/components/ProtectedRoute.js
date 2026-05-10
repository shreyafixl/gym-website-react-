import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protected Route Component
 * Ensures only authenticated users with specific roles can access routes
 */
const ProtectedRoute = ({ children, allowedRoles = null, requiredRole = null }) => {
  const { user, isLoggedIn, loading } = useAuth();

  console.log('🔐 [ProtectedRoute] Checking access:', {
    isLoggedIn,
    loading,
    userRole: user?.role,
    userId: user?.id || user?._id,
    userEmail: user?.email,
    allowedRoles,
    requiredRole,
    timestamp: new Date().toISOString(),
  });

  // Wait for auth loading to complete before making decisions
  if (loading) {
    console.log('⏳ [ProtectedRoute] Auth loading, showing loading state');
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-primary, #0f0f0f)',
        color: 'var(--text-primary, #fff)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!isLoggedIn) {
    console.log('❌ [ProtectedRoute] User not logged in, redirecting to /login');
    console.log('📦 [ProtectedRoute] Current state:', {
      user,
      isLoggedIn,
      loading,
      hasToken: !!localStorage.getItem('gym-auth-token'),
      hasSavedUser: !!localStorage.getItem('gym-auth-user'),
    });
    return <Navigate to="/login" replace />;
  }

  // Normalize role for comparison (handle both 'superadmin' and 'SUPER_ADMIN')
  const normalizeRole = (role) => {
    if (!role) return null;
    return role.toLowerCase().replace(/_/g, '');
  };

  const userRoleNormalized = normalizeRole(user?.role);
  
  // Check if user has required role (support both allowedRoles array and requiredRole string)
  const roleToCheck = requiredRole || (allowedRoles && allowedRoles[0]);
  const roleToCheckNormalized = normalizeRole(roleToCheck);
  
  console.log('🔐 [ProtectedRoute] Role comparison:', {
    userRole: user?.role,
    userRoleNormalized,
    expectedRole: roleToCheck,
    expectedRoleNormalized: roleToCheckNormalized,
    match: userRoleNormalized === roleToCheckNormalized,
  });
  
  if (roleToCheck && userRoleNormalized !== roleToCheckNormalized) {
    console.log('❌ [ProtectedRoute] User role mismatch, redirecting to /unauthorized', {
      userRole: user?.role,
      userRoleNormalized,
      expectedRole: roleToCheck,
      expectedRoleNormalized: roleToCheckNormalized,
    });
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ [ProtectedRoute] Access granted');
  return children;
};

export default ProtectedRoute;
