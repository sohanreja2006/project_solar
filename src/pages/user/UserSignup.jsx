import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../lib/userAuth';
import { useUserAuth } from '../../context/UserAuthContext';
import MathCaptcha from '../../components/MathCaptcha';
import './UserAuth.css';

export default function UserSignup() {
  const navigate = useNavigate();
  const { setUser } = useUserAuth();
  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '',
    fullName: '', mobile: '', email: '', dob: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const captchaRef = useRef();
  const [captchaValid, setCaptchaValid] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: '' }));
  };

  const validate = () => {
    const err = {};
    if (!form.username.trim() || form.username.trim().length < 3) err.username = 'Username must be at least 3 characters.';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) err.username = 'Username can only contain letters, numbers, and underscores.';
    if (!form.fullName.trim()) err.fullName = 'Full name is required.';
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) err.mobile = 'Valid 10-digit mobile number required.';
    if (!form.dob) err.dob = 'Date of birth is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      err.email = 'Valid email is required (for account recovery).';
    }
    if (!form.password || form.password.length < 6) err.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) err.confirmPassword = 'Passwords do not match.';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsDuplicate(false);
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    if (!captchaRef.current?.validate()) {
      setSubmitError('Please complete the human verification (math captcha).');
      return;
    }
    setLoading(true);
    const result = await registerUser({
      username: form.username,
      password: form.password,
      fullName: form.fullName,
      mobile: form.mobile,
      email: form.email,
      dob: form.dob,
    });
    setLoading(false);
    if (result.success) {
      setUser(result.session);
      navigate('/dashboard');
    } else {
      setSubmitError(result.error || 'Registration failed. Please try again.');
      setIsDuplicate(!!result.isDuplicate);
    }
  };

  const fi = (name) => `uauth-input${errors[name] ? ' uauth-input--error' : ''}`;

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
                <circle cx="32" cy="32" r="22" fill="url(#boltSunGrad)" opacity="0.3" />
                <path d="M34 8L16 36h14l-4 20 22-30H30l4-18z" fill="url(#boltGrad)" stroke="#fef08a" strokeWidth="1.5" strokeLinejoin="round" />
                <defs>
                  <radialGradient id="boltSunGrad" cx="50%" cy="50%" r="50%">
                    <stop stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="boltGrad" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="uauth-hero__title">
              Start Your <span className="uauth-hero__highlight">Solar Journey</span>
            </h1>
            <p className="uauth-hero__desc">
              Create a free account to apply for PM Surya Ghar Muft Bijli Yojana and track your application status.
            </p>
            <div className="uauth-hero__steps">
              <div className="uauth-step">
                <div className="uauth-step__num">1</div>
                <div>
                  <div className="uauth-step__title">Create Account</div>
                  <div className="uauth-step__desc">Register with a username & password</div>
                </div>
              </div>
              <div className="uauth-step">
                <div className="uauth-step__num">2</div>
                <div>
                  <div className="uauth-step__title">Submit Application</div>
                  <div className="uauth-step__desc">Fill the solar application form</div>
                </div>
              </div>
              <div className="uauth-step">
                <div className="uauth-step__num">3</div>
                <div>
                  <div className="uauth-step__title">Track Status</div>
                  <div className="uauth-step__desc">Monitor your application progress</div>
                </div>
              </div>
            </div>
          </div>
          <div className="uauth-hero__scheme-badge">
            <span className="uauth-hero__scheme-text">PM Surya Ghar Muft Bijli Yojana</span>
            <span className="uauth-hero__scheme-sub">Government of India Initiative</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="uauth-form-panel">
          <div className="uauth-card-wrap">
            <div className="uauth-card-aura" />
            <div className="uauth-card uauth-card--signup">
            <div className="uauth-card__header">
              <div className="uauth-card__logo-row">
                <img src="/images/sr-logo.png" alt="SR" className="uauth-card__logo" />
                <div className="uauth-card__brand">
                  <span className="uauth-card__brand-name">SR Distributor</span>
                  <span className="uauth-card__brand-sub">Trimurti Solar Systems • Malda</span>
                </div>
              </div>
              <h2 className="uauth-card__title">Create Account</h2>
              <p className="uauth-card__subtitle">Join to track your solar application</p>
            </div>

            <form className="uauth-form" onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className="uauth-field">
                <label className="uauth-label" htmlFor="signup-fullname">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Full Name *
                </label>
                <input
                  id="signup-fullname"
                  className={fi('fullName')}
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.fullName && <span className="uauth-field-error">{errors.fullName}</span>}
              </div>

              {/* Username */}
              <div className="uauth-field">
                <label className="uauth-label" htmlFor="signup-username">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Username *
                </label>
                <input
                  id="signup-username"
                  className={fi('username')}
                  type="text"
                  name="username"
                  placeholder="Choose a username (e.g. rahul_123)"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
                {errors.username && <span className="uauth-field-error">{errors.username}</span>}
              </div>

              {/* Mobile */}
              <div className="uauth-field">
                <label className="uauth-label" htmlFor="signup-mobile">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                  Mobile Number * <small>(to link your application)</small>
                </label>
                <input
                  id="signup-mobile"
                  className={fi('mobile')}
                  type="tel"
                  name="mobile"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  maxLength={10}
                  onChange={handleChange}
                />
                {errors.mobile && <span className="uauth-field-error">{errors.mobile}</span>}
              </div>

              {/* Date of Birth */}
              <div className="uauth-field">
                <label className="uauth-label" htmlFor="signup-dob">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Date of Birth * <small>(used to verify password reset)</small>
                </label>
                <input
                  id="signup-dob"
                  className={fi('dob')}
                  type="date"
                  name="dob"
                  value={form.dob}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                />
                {errors.dob && <span className="uauth-field-error">{errors.dob}</span>}
              </div>

              {/* Email */}
              <div className="uauth-field">
                <label className="uauth-label" htmlFor="signup-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email Address * <small>(needed to recover username)</small>
                </label>
                <input
                  id="signup-email"
                  className={fi('email')}
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="uauth-field-error">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="uauth-field">
                <label className="uauth-label" htmlFor="signup-password">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Password *
                </label>
                <div className="uauth-input-wrap">
                  <input
                    id="signup-password"
                    className={fi('password')}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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
                {errors.password && <span className="uauth-field-error">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="uauth-field">
                <label className="uauth-label" htmlFor="signup-confirm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Confirm Password *
                </label>
                <div className="uauth-input-wrap">
                  <input
                    id="signup-confirm"
                    className={fi('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {form.confirmPassword && (
                    <button
                      type="button"
                      className="uauth-eye-btn"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
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
                {errors.confirmPassword && <span className="uauth-field-error">{errors.confirmPassword}</span>}
              </div>

              {submitError && (
                <div className="uauth-error" role="alert">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{submitError}</span>
                  {isDuplicate && (
                    <Link
                      to="/login"
                      style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: '6px 18px',
                        background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                        color: '#fff',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        textAlign: 'center',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      → Sign In to Your Account
                    </Link>
                  )}
                </div>
              )}

              <MathCaptcha
                ref={captchaRef}
                onValidChange={setCaptchaValid}
              />

              <button
                type="submit"
                className="uauth-submit-btn"
                disabled={loading || !captchaValid}
                id="user-signup-submit"
              >
                {loading ? (
                  <>
                    <span className="uauth-spinner" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="uauth-divider"><span>Already have an account?</span></div>
            <Link to="/login" className="uauth-switch-btn">
              Sign In →
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
