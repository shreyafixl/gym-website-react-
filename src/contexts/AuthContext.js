import { createContext, useContext, useState, useCallback } from 'react';

// ── Demo accounts ────────────────────────────────────────────
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

  const login = useCallback((email, password) => {
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: 'Invalid email or password.' };

    const { password: _pw, ...safeUser } = found;
    localStorage.setItem('gym-auth-user', JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true, user: safeUser };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('gym-auth-user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
