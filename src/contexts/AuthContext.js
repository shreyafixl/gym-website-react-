import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

// ── Demo accounts (kept for backward compatibility) ────────────────────────────────────────────
const DEMO_USERS = [
  { id: 1, email: 'superadmin@gym.com', password: '123456', role: 'superadmin', name: 'Aditya Sharma',  avatar: 'AS' },
  { id: 2, email: 'admin@gym.com',      password: '123456', role: 'admin',      name: 'Rajesh Kumar',  avatar: 'RK' },
  { id: 3, email: 'trainer@gym.com',    password: '123456', role: 'trainer',    name: 'Vikram Singh',  avatar: 'VS' },
  { id: 4, email: 'user@gym.com',       password: '123456', role: 'user',       name: 'Aryan Mehta',   avatar: 'AM' },
];

// Role → redirect path
export const ROLE_ROUTES = {
  superadmin: '/dashboard/superadmin',
  admin:      '/dashboard/admin',
  trainer:    '/dashboard/trainer',
  user:       '/dashboard',
};

const AuthContext = createContext(null);

function loadUser() {
  try {
    const raw = localStorage.getItem('gym-auth-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [loading, setLoading] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('gym-auth-token');
    const savedUser = loadUser();
    
    if (token && savedUser) {
      // Verify token is still valid by fetching user data
      authAPI.getMe()
        .then(response => {
          if (response.success && response.data.user) {
            const userData = response.data.user;
            localStorage.setItem('gym-auth-user', JSON.stringify(userData));
            setUser(userData);
          }
        })
        .catch(() => {
          // Token invalid, clear auth data
          localStorage.removeItem('gym-auth-token');
          localStorage.removeItem('gym-auth-user');
          setUser(null);
        });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    
    try {
      // Try real API login first
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Save token and user data
        localStorage.setItem('gym-auth-token', token);
        localStorage.setItem('gym-auth-user', JSON.stringify(userData));
        setUser(userData);
        setLoading(false);
        
        return { success: true, user: userData };
      }
    } catch (error) {
      // If API fails, fall back to demo accounts for backward compatibility
      const found = DEMO_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (found) {
        const { password: _pw, ...safeUser } = found;
        localStorage.setItem('gym-auth-user', JSON.stringify(safeUser));
        setUser(safeUser);
        setLoading(false);
        return { success: true, user: safeUser };
      }
      
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Invalid email or password.';
      return { success: false, error: errorMessage };
    }
  }, []);

  const signup = useCallback(async (name, email, password, phone = null) => {
    setLoading(true);
    
    try {
      const response = await authAPI.signup(name, email, password, phone);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Save token and user data
        localStorage.setItem('gym-auth-token', token);
        localStorage.setItem('gym-auth-user', JSON.stringify(userData));
        setUser(userData);
        setLoading(false);
        
        return { success: true, user: userData };
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout API if token exists
      const token = localStorage.getItem('gym-auth-token');
      if (token) {
        await authAPI.logout();
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
