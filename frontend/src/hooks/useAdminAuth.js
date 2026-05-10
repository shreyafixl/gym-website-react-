import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import adminService from '../services/adminService';

/**
 * Custom hook for admin authentication
 * Handles login state, JWT tokens, and authentication flow
 */
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('gym-admin-token');
        const adminData = localStorage.getItem('gym-admin-user');

        if (token && adminData) {
          const parsedAdmin = JSON.parse(adminData);
          setAdmin(parsedAdmin);
          setIsAuthenticated(true);
          console.log('✅ [Admin Auth] Found existing session:', { admin: parsedAdmin.name, role: parsedAdmin.role });
        } else {
          console.log('⚠️ [Admin Auth] No existing session found');
          setIsAuthenticated(false);
          setAdmin(null);
        }
      } catch (error) {
        console.error('❌ [Admin Auth] Error checking auth status:', error);
        setIsAuthenticated(false);
        setAdmin(null);
        setError('Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 [Admin Auth] Attempting login...');
      const result = await adminService.auth.login(email, password);

      if (result.success) {
        setAdmin(result.data.admin);
        setIsAuthenticated(true);
        setError(null);

        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });

        console.log('✅ [Admin Auth] Login successful:', { admin: result.data.admin.name });
        return { success: true };
      } else {
        setError(result.error);
        setIsAuthenticated(false);
        setAdmin(null);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setAdmin(null);
      console.error('❌ [Admin Auth] Login error:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location]);

  // Logout function
  const logout = useCallback(() => {
    try {
      adminService.auth.logout();
      setAdmin(null);
      setIsAuthenticated(false);
      setError(null);
      navigate('/admin/login');
      console.log('✅ [Admin Auth] Logged out successfully');
    } catch (error) {
      console.error('❌ [Admin Auth] Logout error:', error);
    }
  }, [navigate]);

  // Refresh admin data
  const refreshAdminData = useCallback(() => {
    try {
      const adminData = localStorage.getItem('gym-admin-user');
      if (adminData) {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
        console.log('✅ [Admin Auth] Admin data refreshed:', { admin: parsedAdmin.name });
      }
    } catch (error) {
      console.error('❌ [Admin Auth] Error refreshing admin data:', error);
    }
  }, []);

  // Check if current admin has specific permissions
  const hasPermission = useCallback((permission) => {
    if (!admin) return false;
    
    // For now, all admins have all permissions
    // This can be extended based on role-based permissions from the backend
    return true;
  }, [admin]);

  // Check if current admin has specific role
  const hasRole = useCallback((role) => {
    if (!admin) return false;
    return admin.role?.toLowerCase() === role.toLowerCase();
  }, [admin]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isAuthenticated,
    isLoading,
    admin,
    error,

    // Actions
    login,
    logout,
    refreshAdminData,
    clearError,

    // Utilities
    hasPermission,
    hasRole,
  };
};

export default useAdminAuth;
