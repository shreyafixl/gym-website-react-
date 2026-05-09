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
      console.log('🔐 Login attempt:', { email, endpoint: 'detecting...' });
      
      // Determine endpoint based on email
      let endpoint = '/auth/login'; // Default for members
      
      if (email.includes('superadmin')) {
        endpoint = '/superadmin/auth/login';
      } else if (email.includes('admin')) {
        endpoint = '/admin/auth/login';
      } else if (email.includes('trainer')) {
        endpoint = '/trainer/auth/login';
      }

      console.log('📡 Sending login request to:', endpoint);
      
      const response = await api.post(endpoint, {
        email,
        password,
      });
      
      console.log('✅ Login response received:', {
        success: response.data.success,
        hasData: !!response.data.data,
        dataKeys: response.data.data ? Object.keys(response.data.data) : [],
      });
      
      if (response.data.success && response.data.data) {
        const { admin, trainer, user, token, refreshToken } = response.data.data;
        const userData = admin || trainer || user;
        
        console.log('💾 Storing auth data:', {
          userRole: userData?.role,
          userEmail: userData?.email,
          tokenLength: token?.length,
        });
        
        localStorage.setItem('gym-auth-token', token);
        localStorage.setItem('gym-auth-refresh-token', refreshToken);
        localStorage.setItem('gym-auth-user', JSON.stringify(userData));
        
        console.log('✨ Login successful!');
        return { success: true, data: { admin: userData, token } };
      }
      
      const errorMsg = response.data.message || 'Login failed';
      console.error('❌ Login failed:', errorMsg);
      return { success: false, error: errorMsg };
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Get current authenticated user
   */
  getMe: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('gym-auth-user') || '{}');
      let endpoint = '/auth/me';
      
      if (user.role === 'superadmin') {
        endpoint = '/superadmin/auth/me';
      } else if (user.role === 'admin') {
        endpoint = '/admin/auth/me';
      } else if (user.role === 'trainer') {
        endpoint = '/trainer/auth/me';
      }

      const response = await api.get(endpoint);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
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
