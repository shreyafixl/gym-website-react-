import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useAuth, ROLE_ROUTES } from '../contexts/AuthContext';

const INITIAL_LOGIN  = { email: '', password: '' };
const INITIAL_SIGNUP = { name: '', email: '', password: '', confirmPassword: '' };

function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [mode,       setMode]       = useState(defaultMode);
  const [loginData,  setLoginData]  = useState(INITIAL_LOGIN);
  const [signupData, setSignupData] = useState(INITIAL_SIGNUP);
  const [errors,     setErrors]     = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [loginErr,   setLoginErr]   = useState('');

  const handleClose = useCallback(() => {
    setLoginData(INITIAL_LOGIN);
    setSignupData(INITIAL_SIGNUP);
    setErrors({});
    setSubmitted(false);
    setLoginErr('');
    setMode(defaultMode);
    onClose();
  }, [onClose, defaultMode]);

  const switchMode = (m) => { setMode(m); setErrors({}); setSubmitted(false); setLoginErr(''); };

  // ── Validation ───────────────────────────────────────────────
  const validateLogin = () => {
    const e = {};
    if (!loginData.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) e.email = 'Enter a valid email.';
    if (!loginData.password) e.password = 'Password is required.';
    return e;
  };

  const validateSignup = () => {
    const e = {};
    if (!signupData.name.trim()) e.name = 'Name is required.';
    if (!signupData.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) e.email = 'Enter a valid email.';
    if (!signupData.password) e.password = 'Password is required.';
    else if (signupData.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!signupData.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (signupData.password !== signupData.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoginErr('');

    const result = login(loginData.email, loginData.password);
    if (result.success) {
      handleClose();
      navigate(ROLE_ROUTES[result.user.role] || '/');
    } else {
      setLoginErr(result.error);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  // ── Field helpers ────────────────────────────────────────────
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (loginErr) setLoginErr('');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mode === 'login' ? 'Welcome Back' : 'Create Account'}>
      <div className="auth-modal">

        {/* Tabs */}
        <div className="auth-tabs" role="tablist">
          <button role="tab" aria-selected={mode === 'login'}
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => switchMode('login')}>Login</button>
          <button role="tab" aria-selected={mode === 'signup'}
            className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => switchMode('signup')}>Sign Up</button>
        </div>

        {/* Sign-up success */}
        {submitted && mode === 'signup' ? (
          <div className="auth-success">
            <span className="auth-success-icon">✓</span>
            <h3>Account created!</h3>
            <p>Welcome to FitZone. Start your fitness journey today.</p>
            <button className="btn btn-primary btn-full" onClick={handleClose}>Continue</button>
          </div>

        ) : mode === 'login' ? (
          /* ── Login ── */
          <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
            {loginErr && <div className="login-error" role="alert">{loginErr}</div>}

            {/* Quick demo login buttons */}
            <div className="login-demo-hints">
              <p className="login-demo-label">Quick demo login:</p>
              <div className="login-demo-grid">
                {[
                  { role: 'Super Admin', email: 'superadmin@gym.com' },
                  { role: 'Admin',       email: 'admin@gym.com'      },
                  { role: 'Trainer',     email: 'trainer@gym.com'    },
                  { role: 'Member',      email: 'user@gym.com'       },
                ].map(h => (
                  <button
                    key={h.role}
                    type="button"
                    className="login-demo-btn"
                    onClick={() => {
                      setLoginData({ email: h.email, password: '123456' });
                      setLoginErr('');
                      setErrors({});
                    }}
                  >
                    {h.role}
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="m-login-email" className="auth-label">Email</label>
              <input id="m-login-email" type="email" name="email"
                className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                placeholder="you@example.com" value={loginData.email}
                onChange={handleLoginChange} autoComplete="email" />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-login-password" className="auth-label">Password</label>
              <input id="m-login-password" type="password" name="password"
                className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
                placeholder="Enter your password" value={loginData.password}
                onChange={handleLoginChange} autoComplete="current-password" />
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full auth-submit">Login</button>
            <p className="auth-switch-text">
              Don't have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={() => switchMode('signup')}>Sign Up</button>
            </p>
          </form>

        ) : (
          /* ── Sign Up ── */
          <form className="auth-form" onSubmit={handleSignupSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="m-signup-name" className="auth-label">Full Name</label>
              <input id="m-signup-name" type="text" name="name"
                className={`auth-input ${errors.name ? 'auth-input--error' : ''}`}
                placeholder="John Doe" value={signupData.name}
                onChange={handleSignupChange} autoComplete="name" />
              {errors.name && <span className="auth-error">{errors.name}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-email" className="auth-label">Email</label>
              <input id="m-signup-email" type="email" name="email"
                className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                placeholder="you@example.com" value={signupData.email}
                onChange={handleSignupChange} autoComplete="email" />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-password" className="auth-label">Password</label>
              <input id="m-signup-password" type="password" name="password"
                className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
                placeholder="Min. 6 characters" value={signupData.password}
                onChange={handleSignupChange} autoComplete="new-password" />
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="m-signup-confirm" className="auth-label">Confirm Password</label>
              <input id="m-signup-confirm" type="password" name="confirmPassword"
                className={`auth-input ${errors.confirmPassword ? 'auth-input--error' : ''}`}
                placeholder="Re-enter your password" value={signupData.confirmPassword}
                onChange={handleSignupChange} autoComplete="new-password" />
              {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full auth-submit">Create Account</button>
            <p className="auth-switch-text">
              Already have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={() => switchMode('login')}>Login</button>
            </p>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default AuthModal;
