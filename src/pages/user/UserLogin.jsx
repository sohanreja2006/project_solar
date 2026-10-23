import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../lib/userAuth';
import { useUserAuth } from '../../context/UserAuthContext';
import './UserAuth.css';

const WHATSAPP_HELP = 'https://wa.me/917001516219?text=Hello%20Trimurti%20Solar%2C%20I%20am%20still%20unable%20to%20login%20to%20my%20account.%20Please%20help%20me.';

export default function UserLogin() {
  const navigate = useNavigate();
  const { setUser } = useUserAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    const result = await loginUser({ username: form.username, password: form.password });
    setLoading(false);
    if (result.success) {
      setUser(result.session);
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="uauth-page">
      {/* Background decorations with solar ray beam and floating photons */}
      <div className="uauth-bg">
        <div className="uauth-bg__beam" />
        <div className="uauth-bg__orb uauth-bg__orb--1" />
        <div className="uauth-bg__orb uauth-bg__orb--2" />
        <div className="uauth-bg__orb uauth-bg__orb--3" />
        <div className="uauth-bg__orb uauth-bg__orb--4" />
        <div className="uauth-bg__grid" />
        <div className="uauth-bg__dots" />
        <span className="uauth-photon uauth-photon--1" />
        <span className="uauth-photon uauth-photon--2" />
        <span className="uauth-photon uauth-photon--3" />
        <span className="uauth-photon uauth-photon--4" />
        <span className="uauth-photon uauth-photon--5" />
        <span className="uauth-photon uauth-photon--6" />
        <span className="uauth-photon uauth-photon--7" />
        <span className="uauth-photon uauth-photon--8" />
      </div>

      <div className="uauth-container">
        {/* Left Panel */}
        <div className="uauth-hero">
          <Link to="/" className="uauth-hero__back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Home
          </Link>
          <div className="uauth-hero__content">
            <div className="uauth-hero__solar-emblem">
              <div className="uauth-solar-glow" />
              <svg className="uauth-solar-svg" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="14" fill="url(#sunGrad)" />
                <g className="uauth-solar-rays">
                  <path d="M32 4v8M32 52v8M4 32h8M52 32h8M12.2 12.2l5.7 5.7M46.1 46.1l5.7 5.7M12.2 51.8l5.7-5.7M46.1 17.9l5.7-5.7" stroke="url(#rayGrad)" strokeWidth="3" strokeLinecap="round"/>
                </g>
                <defs>
                  <radialGradient id="sunGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="60%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </radialGradient>
                  <linearGradient id="rayGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fde047" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="uauth-hero__title">
              Track Your <span className="uauth-hero__highlight">Solar Journey</span>
            </h1>
            <p className="uauth-hero__desc">
              Log in to monitor your PM Surya Ghar application status in real-time — from submission to installation.
            </p>
            <div className="uauth-hero__features">
              <div className="uauth-feature">
                <span className="uauth-feature__icon">📋</span>
                <span>View your application status</span>
              </div>
              <div className="uauth-feature">
                <span className="uauth-feature__icon">🔔</span>
                <span>Get real-time updates</span>
              </div>
              <div className="uauth-feature">
                <span className="uauth-feature__icon">📄</span>
                <span>Download application PDF</span>
              </div>
              <div className="uauth-feature">
                <span className="uauth-feature__icon">✅</span>
                <span>Track installation progress</span>
              </div>
            </div>
          </div>
          <div className="uauth-hero__scheme-badge">
            <span className="uauth-hero__scheme-text">PM Surya Ghar Muft Bijli Yojana</span>
            <span className="uauth-hero__scheme-sub">Government of India Initiative</span>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="uauth-form-panel">
          <div className="uauth-card-wrap">
            <div className="uauth-card-aura" />
            <div className="uauth-card">
            <div className="uauth-card__header">
              <div className="uauth-card__logo-row">
                <img src="/images/sr-logo.png" alt="SR" className="uauth-card__logo" />
                <div className="uauth-card__brand">
                  <span className="uauth-card__brand-name">SR Distributor</span>
                  <span className="uauth-card__brand-sub">Trimurti Solar Systems • Malda</span>
                </div>
              </div>
              <h2 className="uauth-card__title">Welcome Back</h2>
              <p className="uauth-card__subtitle">Sign in to your applicant account</p>
            </div>

            <form className="uauth-form" onSubmit={handleSubmit} noValidate>
              <div className="uauth-field">
                <label className="uauth-label" htmlFor="login-username">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Username
                </label>
                <input
                  id="login-username"
                  className="uauth-input"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="uauth-field">
                <label className="uauth-label" htmlFor="login-password">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Password
                </label>
                <div className="uauth-input-wrap">
                  <input
                    id="login-password"
                    className="uauth-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  {form.password && (
                    <button
                      type="button"
                      className="uauth-eye-btn"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                <div className="uauth-forgot-row">
                  <Link to="/forgot-password?mode=password" className="uauth-forgot-link">
                    Forgot Password?
                  </Link>
                  <Link to="/forgot-password?mode=username" className="uauth-forgot-link">
                    Forgot Username?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="uauth-error" role="alert" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                  <a
                    href={WHATSAPP_HELP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="uauth-error-help-link"
                  >
                    Still unable? Contact us on WhatsApp (7001516219) →
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="uauth-submit-btn"
                disabled={loading}
                id="user-login-submit"
              >
                {loading ? (
                  <>
                    <span className="uauth-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Still Unable Help Option */}
            <div className="uauth-help-contact">
              <span>Still unable to login?</span>
              <a
                href={WHATSAPP_HELP}
                target="_blank"
                rel="noopener noreferrer"
                className="uauth-wa-contact-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact us on WhatsApp (7001516219)
              </a>
            </div>

            <div className="uauth-divider"><span>Don't have an account?</span></div>

            <Link to="/signup" className="uauth-switch-btn">
              Create Account →
            </Link>

            <p className="uauth-admin-link">
              Are you an admin?{' '}
              <Link to="/admin/login">Admin Portal →</Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
