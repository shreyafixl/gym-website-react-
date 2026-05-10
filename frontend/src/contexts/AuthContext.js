import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

// Demo accounts for testing (kept for backward compatibility)
const DEMO_USERS = [
  { id: 1, email: 'superadmin@gym.com', password: '12345678', role: 'superadmin', fullName: 'Aditya Sharma',  avatar: 'AS' },
  { id: 2, email: 'admin@gym.com',      password: '12345678', role: 'admin',      fullName: 'Rajesh Kumar',  avatar: 'RK' },
  { id: 3, email: 'trainer@gym.com',    password: '12345678', role: 'trainer',    fullName: 'Vikram Singh',  avatar: 'VS' },
];

// Role → redirect path
export const ROLE_ROUTES = {
  superadmin: '/dashboard/superadmin',
  admin:      '/dashboard/admin',
  trainer:    '/dashboard/trainer',
  member:     '/dashboard',
};

const AuthContext = createContext(null);

function loadUser() {
  try {
    const raw = localStorage.getItem('gym-auth-user');
    const user = raw ? JSON.parse(raw) : null;
    
    // Normalize role to lowercase for consistency
    if (user && user.role) {
      user.role = user.role.toLowerCase();
    }
    
    return user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [loading, setLoading] = useState(true); // Start as true to wait for auth verification

  // Check if user is authenticated on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('gym-auth-token');
        const savedUser = loadUser();
        
        console.log('🔍 [AuthContext] Auth verification on mount:', {
          hasToken: !!token,
          tokenLength: token?.length,
          hasSavedUser: !!savedUser,
          savedUserRole: savedUser?.role,
          savedUserEmail: savedUser?.email,
          storageKey: 'gym-auth-token',
        });
        
        if (token && savedUser) {
          console.log('🔍 [AuthContext] Verifying stored auth token...');
          // Verify token is still valid by fetching user data
          const response = await authService.getMe();
          
          console.log('✅ [AuthContext] Auth verification response:', {
            success: response.success,
            hasData: !!response.data,
            responseKeys: response.data ? Object.keys(response.data) : [],
          });
          
          if (response.success && response.data) {
            console.log('✅ [AuthContext] Token verified, user authenticated');
            // Handle different response structures for different roles
            const userData = response.data.admin || response.data.trainer || response.data.user || response.data;
            
            // Normalize role to lowercase for consistency
            const normalizedUser = {
              ...userData,
              role: userData.role ? userData.role.toLowerCase() : userData.role,
            };
            
            console.log('✅ [AuthContext] Verified user data:', {
              role: normalizedUser?.role,
              email: normalizedUser?.email,
              id: normalizedUser?.id || normalizedUser?._id,
            });
            
            localStorage.setItem('gym-auth-user', JSON.stringify(normalizedUser));
            setUser(normalizedUser);
          } else {
            console.log('⚠️  [AuthContext] Token verification failed, clearing auth');
            // Token invalid, clear auth data
            localStorage.removeItem('gym-auth-token');
            localStorage.removeItem('gym-auth-refresh-token');
            localStorage.removeItem('gym-auth-user');
            setUser(null);
          }
        } else {
          console.log('ℹ️  [AuthContext] No stored auth data found, user not authenticated');
          if (token && !savedUser) {
            console.log('⚠️  [AuthContext] Token exists but no user data, clearing token');
            localStorage.removeItem('gym-auth-token');
            localStorage.removeItem('gym-auth-refresh-token');
          }
          setUser(null);
        }
      } catch (error) {
        console.error('❌ [AuthContext] Auth verification error:', error.message);
        // On error, clear auth data
        localStorage.removeItem('gym-auth-token');
        localStorage.removeItem('gym-auth-refresh-token');
        localStorage.removeItem('gym-auth-user');
        setUser(null);
      } finally {
        console.log('✅ [AuthContext] Auth verification complete, setting loading to false');
        setLoading(false); // Auth verification complete
      }
    };

    verifyAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    
    try {
      console.log('🔑 [AuthContext] login called for:', email);
      const response = await authService.login(email, password);
      
      console.log('📊 [AuthContext] received response:', {
        success: response.success,
        hasData: !!response.data,
        error: response.error,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });
      
      if (response.success && response.data) {
        const { admin: userData, token } = response.data;
        
        if (!userData) {
          console.error('❌ [AuthContext] No user data in response');
          setLoading(false);
          return { success: false, error: 'Login failed: No user data' };
        }
        
        // Verify token is actually stored
        const storedToken = localStorage.getItem('gym-auth-token');
        console.log('🔐 [AuthContext] Token storage verification:', {
          tokenReturned: !!token,
          tokenStored: !!storedToken,
          tokenMatch: token === storedToken,
          storageKey: 'gym-auth-token',
        });
        
        // Normalize role to lowercase for consistency
        const normalizedUser = {
          ...userData,
          role: userData.role ? userData.role.toLowerCase() : userData.role,
        };
        
        console.log('✅ [AuthContext] Login successful, user data received:', {
          role: normalizedUser?.role,
          email: normalizedUser?.email,
          id: normalizedUser?.id || normalizedUser?._id,
        });
        
        // Token is already stored by authService, just update state
        console.log('📦 [AuthContext] Token already stored by authService');
        console.log('👤 [AuthContext] Updating AuthContext state with user:', {
          role: normalizedUser?.role,
          email: normalizedUser?.email,
        });
        
        setUser(normalizedUser);
        setLoading(false);
        
        return { success: true, user: normalizedUser };
      }
      
      // If response.success is false, return error
      if (!response.success) {
        setLoading(false);
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ [AuthContext] login error:', error);
      // If API fails, fall back to demo accounts for backward compatibility
      const found = DEMO_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (found) {
        console.log('⚠️  [AuthContext] Using demo account fallback');
        const { password: _pw, ...safeUser } = found;
        localStorage.setItem('gym-auth-user', JSON.stringify(safeUser));
        setUser(safeUser);
        setLoading(false);
        return { success: true, user: safeUser };
      }
      
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Invalid email or password.';
      console.error('❌ [AuthContext] Login failed:', errorMessage);
      return { success: false, error: errorMessage };
    }
    
    // Fallback return
    setLoading(false);
    return { success: false, error: 'Login failed' };
  }, []);

  const signup = useCallback(async (fullName, email, password, phone = null, gender = 'other', age = 18) => {
    setLoading(true);
    
    try {
      const response = await authService.signup(fullName, email, password, phone, gender, age);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Save token and user data
        localStorage.setItem('gym-auth-token', token);
        localStorage.setItem('gym-auth-user', JSON.stringify(user));
        setUser(user);
        setLoading(false);
        
        return { success: true, user };
      }
      
      setLoading(false);
      const errorMessage = response.error || 'Signup failed. Please try again.';
      return { success: false, error: errorMessage };
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout API if token exists
      const token = localStorage.getItem('gym-auth-token');
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      // Ignore logout API errors
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('gym-auth-token');
      localStorage.removeItem('gym-auth-user');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
