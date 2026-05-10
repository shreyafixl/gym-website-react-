import api from './api';

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
export const authService = {
  /**
   * Signup with email and password
   */
  signup: async (fullName, email, password, phone, gender, age) => {
    try {
      const response = await api.post('/auth/signup', {
        fullName,
        email,
        password,
        phone,
        gender,
        age,
      });
      
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        
        localStorage.setItem('gym-auth-token', token);
        localStorage.setItem('gym-auth-refresh-token', refreshToken);
        localStorage.setItem('gym-auth-user', JSON.stringify(user));
        
        return { success: true, data: { user, token } };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  },

  /**
   * Login with email and password
   * Automatically detects role based on email and uses correct endpoint
   */
  login: async (email, password) => {
    try {
      console.log('🔐 [authService] Login attempt:', { email, endpoint: 'detecting...' });
      
      // Determine endpoint based on email - check superadmin FIRST before admin
      let endpoint = '/auth/login'; // Default for members
      
      if (email.includes('superadmin')) {
        endpoint = '/superadmin/auth/login';
      } else if (email.includes('admin')) {
        endpoint = '/admin/auth/login';
      } else if (email.includes('trainer')) {
        endpoint = '/trainer/auth/login';
      }

      console.log('📡 [authService] Sending login request to:', endpoint);
      
      const response = await api.post(endpoint, {
        email,
        password,
      });
      
      console.log('✅ [authService] Login response received:', {
        success: response.data.success,
        hasData: !!response.data.data,
        dataKeys: response.data.data ? Object.keys(response.data.data) : [],
      });
      
      if (response.data.success && response.data.data) {
        const { admin, trainer, user, token, refreshToken } = response.data.data;
        const userData = admin || trainer || user;
        
        console.log('💾 [authService] Storing auth data:', {
          userRole: userData?.role,
          userEmail: userData?.email,
          tokenLength: token?.length,
          storageKey: 'gym-auth-token',
        });
        
        // Store token and user data in localStorage
        localStorage.setItem('gym-auth-token', token);
        if (refreshToken) {
          localStorage.setItem('gym-auth-refresh-token', refreshToken);
        }
        localStorage.setItem('gym-auth-user', JSON.stringify(userData));
        
        // Verify storage
        const verifyToken = localStorage.getItem('gym-auth-token');
        const verifyUser = localStorage.getItem('gym-auth-user');
        
        console.log('✨ [authService] Login successful! Token stored in localStorage');
        console.log('🔐 [authService] Storage verification:', {
          tokenStored: !!verifyToken,
          userStored: !!verifyUser,
          tokenMatch: token === verifyToken,
          tokenPrefix: token.substring(0, 20) + '...',
          userRole: userData?.role,
          userEmail: userData?.email,
        });
        
        return { success: true, data: { admin: userData, token } };
      }
      
      const errorMsg = response.data.message || 'Login failed';
      console.error('❌ [authService] Login failed:', errorMsg);
      return { success: false, error: errorMsg };
    } catch (error) {
      console.error('❌ [authService] Login error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        isNetworkError: !error.response,
        requestURL: error.config?.url,
        baseURL: error.config?.baseURL,
      });

      // Network error
      if (!error.response) {
        const errorMessage = error.code === 'ECONNABORTED' 
          ? 'Request timeout - Server not responding'
          : 'Network error - Cannot reach server at http://localhost:5000';
        console.error('❌ [authService] Network Error:', errorMessage);
        return { success: false, error: errorMessage };
      }

      // Server error
      const errorMessage = error.response?.data?.message || error.message || 'Invalid email or password.';
      console.error('❌ [authService] Login failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Get current authenticated user
   */
  getMe: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('gym-auth-user') || '{}');
      const token = localStorage.getItem('gym-auth-token');
      
      console.log('🔍 [authService] getMe called:', {
        hasToken: !!token,
        hasUser: !!user?.role,
        userRole: user?.role,
        storageKey: 'gym-auth-token',
      });
      
      let endpoint = '/auth/me';
      
      if (user.role === 'superadmin') {
        endpoint = '/superadmin/auth/me';
      } else if (user.role === 'admin') {
        endpoint = '/admin/auth/me';
      } else if (user.role === 'trainer') {
        endpoint = '/trainer/auth/me';
      }

      console.log('📡 [authService] Calling endpoint:', endpoint);
      
      const response = await api.get(endpoint);
      
      console.log('✅ [authService] getMe response:', {
        success: response.data.success,
        hasData: !!response.data.data,
        dataKeys: response.data.data ? Object.keys(response.data.data) : [],
      });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('❌ [authService] getMe error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        isNetworkError: !error.response,
        requestURL: error.config?.url,
      });

      // Network error
      if (!error.response) {
        console.error('❌ [authService] Network Error in getMe:', error.message);
        return { success: false, error: 'Network error - Cannot reach server' };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('gym-auth-user') || '{}');
      let endpoint = '/auth/logout';
      
      if (user.role === 'superadmin') {
        endpoint = '/superadmin/auth/logout';
      } else if (user.role === 'admin') {
        endpoint = '/admin/auth/logout';
      } else if (user.role === 'trainer') {
        endpoint = '/trainer/auth/logout';
      }

      await api.post(endpoint);
      localStorage.removeItem('gym-auth-token');
      localStorage.removeItem('gym-auth-refresh-token');
      localStorage.removeItem('gym-auth-user');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('gym-auth-token');
      localStorage.removeItem('gym-auth-refresh-token');
      localStorage.removeItem('gym-auth-user');
      return { success: true };
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('gym-auth-refresh-token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const user = JSON.parse(localStorage.getItem('gym-auth-user') || '{}');
      let endpoint = '/auth/refresh';
      
      if (user.role === 'superadmin') {
        endpoint = '/superadmin/auth/refresh';
      } else if (user.role === 'admin') {
        endpoint = '/admin/auth/refresh';
      } else if (user.role === 'trainer') {
        endpoint = '/trainer/auth/refresh';
      }

      const response = await api.post(endpoint, {
        refreshToken,
      });

      if (response.data.success) {
        const { token } = response.data.data;
        localStorage.setItem('gym-auth-token', token);
        return { success: true, data: { token } };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      localStorage.removeItem('gym-auth-token');
      localStorage.removeItem('gym-auth-refresh-token');
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed',
      };
    }
  },

  /**
   * Update password
   */
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const user = JSON.parse(localStorage.getItem('gym-auth-user') || '{}');
      let endpoint = '/auth/password';
      
      if (user.role === 'superadmin') {
        endpoint = '/superadmin/auth/password';
      } else if (user.role === 'admin') {
        endpoint = '/admin/auth/change-password';
      } else if (user.role === 'trainer') {
        endpoint = '/trainer/auth/password';
      }

      const response = await api.put(endpoint, {
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password update failed',
      };
    }
  },
};

export default authService;
