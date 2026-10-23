import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { verifyResetCredentials, resetUserPassword, recoverUsername } from '../../lib/userAuth';
import './UserAuth.css';

const WHATSAPP_HELP = 'https://wa.me/917001516219?text=Hi%2C%20I%20need%20help%20recovering%20my%20Trimurti%20Solar%20account%20credentials.';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'username' ? 'username' : 'password';

  const [mode, setMode] = useState(initialMode); // 'password' | 'username'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Reset Form State
  const [resetStep, setResetStep] = useState(1); // 1 = verify, 2 = set new password
  const [resetForm, setResetForm] = useState({
    username: '',
    mobile: '',
    dob: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Username Recovery Form State
  const [userForm, setUserForm] = useState({
    mobile: '',
    dob: '',
    email: '',
  });
  const [recoveredUser, setRecoveredUser] = useState(null);

  useEffect(() => {
    setError('');
    setSuccessMsg('');
  }, [mode]);

  const handleResetChange = (e) => {
    setResetForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleUserChange = (e) => {
    setUserForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  // Step 1: Verify identity (Username + Mobile + DOB)
  const handleVerifyReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!resetForm.username.trim() || !resetForm.mobile.trim() || !resetForm.dob) {
      setError('Please provide your Username, Registered Mobile Number, and Date of Birth.');
      return;
    }
    setLoading(true);
    const result = await verifyResetCredentials({
      username: resetForm.username,
      mobile: resetForm.mobile,
      dob: resetForm.dob,
    });
    setLoading(false);

    if (result.success) {
      setResetStep(2);
      setSuccessMsg('Account verified! Please create your new password below.');
    } else {
      setError(result.error || 'Verification failed. Please check your details.');
    }
  };

  // Step 2: Save New Password
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!resetForm.newPassword || resetForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await resetUserPassword({
      username: resetForm.username,
      mobile: resetForm.mobile,
      dob: resetForm.dob,
      newPassword: resetForm.newPassword,
    });
    setLoading(false);

    if (result.success) {
      setResetStep(3); // Completed
      setSuccessMsg('Your password has been reset successfully! You can now sign in.');
    } else {
      setError(result.error || 'Failed to update password.');
    }
  };

  // Recover Username: Mobile + DOB + Email
  const handleRecoverUsername = async (e) => {
    e.preventDefault();
    setError('');
    setRecoveredUser(null);

    if (!userForm.mobile.trim() || !userForm.dob || !userForm.email.trim()) {
      setError('Please enter your Mobile Number, Date of Birth, and Registered Email Address.');
      return;
    }

    setLoading(true);
    const result = await recoverUsername({
      mobile: userForm.mobile,
      dob: userForm.dob,
      email: userForm.email,
    });
    setLoading(false);

    if (result.success) {
      setRecoveredUser({
        username: result.username,
        fullName: result.fullName,
      });
      setSuccessMsg('Account matched! Your username has been retrieved.');
    } else {
      setError(result.error || 'Could not find an account with the provided details.');
    }
  };

  const switchToResetWithFoundUser = (username) => {
    setResetForm((f) => ({
      ...f,
      username,
      mobile: userForm.mobile,
      dob: userForm.dob,
    }));
    setMode('password');
    setResetStep(2); // directly to password entry since already verified
  };

  return (
    <div className="uauth-page">
      {/* Background decorations */}
      <div className="uauth-bg">
        <div className="uauth-bg__beam" />
        <div className="uauth-bg__orb uauth-bg__orb--1" />
        <div className="uauth-bg__orb uauth-bg__orb--2" />
        <div className="uauth-bg__orb uauth-bg__orb--3" />
        <div className="uauth-bg__grid" />
        <div className="uauth-bg__dots" />
      </div>

      <div className="uauth-container">
        {/* Left Hero Panel */}
        <div className="uauth-hero">
          <Link to="/login" className="uauth-hero__back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Sign In
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
              Account <span className="uauth-hero__highlight">Security &amp; Recovery</span>
            </h1>
            <p className="uauth-hero__desc">
              Verify your registered credentials to reset your password or recover your forgotten username securely.
            </p>
            <div className="uauth-hero__features">
              <div className="uauth-feature">
                <span className="uauth-feature__icon">🔒</span>
                <span>Self-service 3-point identity verification</span>
              </div>
              <div className="uauth-feature">
                <span className="uauth-feature__icon">🎂</span>
                <span>DOB + Mobile validation ensures account safety</span>
              </div>
              <div className="uauth-feature">
                <span className="uauth-feature__icon">⚡</span>
                <span>Instant password update without waiting for SMS</span>
              </div>
            </div>
          </div>
          <div className="uauth-hero__scheme-badge">
            <span className="uauth-hero__scheme-text">Trimurti Solar Systems</span>
            <span className="uauth-hero__scheme-sub">Authorized SR Distributor &bull; Malda</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="uauth-form-panel">
          <div className="uauth-card-wrap">
            <div className="uauth-card-aura" />
            <div className="uauth-card">
              <div className="uauth-card__header">
                <div className="uauth-card__logo-row">
                  <img src="/images/sr-logo.png" alt="SR" className="uauth-card__logo" />
                  <div className="uauth-card__brand">
                    <span className="uauth-card__brand-name">Account Recovery</span>
                    <span className="uauth-card__brand-sub">Trimurti Solar Systems • Malda</span>
                  </div>
                </div>

                {/* Tabs to switch between Reset Password and Forgot Username */}
                <div className="uauth-tabs">
                  <button
                    type="button"
                    className={`uauth-tab-btn ${mode === 'password' ? 'uauth-tab-btn--active' : ''}`}
                    onClick={() => { setMode('password'); setResetStep(1); }}
                  >
                    Reset Password
                  </button>
                  <button
                    type="button"
                    className={`uauth-tab-btn ${mode === 'username' ? 'uauth-tab-btn--active' : ''}`}
                    onClick={() => { setMode('username'); setRecoveredUser(null); }}
                  >
                    Forgot Username
                  </button>
                </div>

                <h2 className="uauth-card__title">
                  {mode === 'password' ? 'Reset Your Password' : 'Find Your Username'}
                </h2>
                <p className="uauth-card__subtitle">
                  {mode === 'password'
                    ? 'Verify your Username, Mobile, and Date of Birth'
                    : 'Verify your Mobile, Date of Birth, and Email'}
                </p>
              </div>

              {/* ──────────────── MODE 1: RESET PASSWORD ──────────────── */}
              {mode === 'password' && (
                <>
                  {resetStep === 1 && (
                    <form className="uauth-form" onSubmit={handleVerifyReset} noValidate>
                      <div className="uauth-step-badge">
                        <span>Step 1 of 2: Verify Identity</span>
                      </div>

                      {/* Username */}
                      <div className="uauth-field">
                        <label className="uauth-label" htmlFor="reset-username">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          Username *
                        </label>
                        <input
                          id="reset-username"
                          className="uauth-input"
                          type="text"
                          name="username"
                          placeholder="Your account username"
                          value={resetForm.username}
                          onChange={handleResetChange}
                          autoFocus
                          required
                        />
                      </div>

                      {/* Mobile */}
                      <div className="uauth-field">
                        <label className="uauth-label" htmlFor="reset-mobile">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                            <line x1="12" y1="18" x2="12.01" y2="18"/>
                          </svg>
                          Registered Mobile Number *
                        </label>
                        <input
                          id="reset-mobile"
                          className="uauth-input"
                          type="tel"
                          name="mobile"
                          placeholder="10-digit mobile number"
                          value={resetForm.mobile}
                          maxLength={10}
                          onChange={handleResetChange}
                          required
                        />
                      </div>

                      {/* DOB */}
                      <div className="uauth-field">
                        <label className="uauth-label" htmlFor="reset-dob">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          Date of Birth (DOB) *
                        </label>
                        <input
                          id="reset-dob"
                          className="uauth-input"
                          type="date"
                          name="dob"
                          value={resetForm.dob}
                          max={new Date().toISOString().split('T')[0]}
                          onChange={handleResetChange}
                          required
                        />
                      </div>

                      {error && (
                        <div className="uauth-error" role="alert">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          {error}
                        </div>
                      )}

                      <button type="submit" className="uauth-submit-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Continue →'}
                      </button>
                    </form>
                  )}

                  {resetStep === 2 && (
                    <form className="uauth-form" onSubmit={handleSavePassword} noValidate>
                      <div className="uauth-step-badge">
                        <span>Step 2 of 2: Create New Password</span>
                      </div>

                      {successMsg && (
                        <div className="uauth-success-box" style={{ margin: '0 0 1rem' }}>
                          <p style={{ margin: 0, fontSize: '0.86rem' }}>{successMsg}</p>
                        </div>
                      )}

                      {/* New Password */}
                      <div className="uauth-field">
                        <label className="uauth-label" htmlFor="reset-newPassword">
                          New Password * (min 6 characters)
                        </label>
                        <div className="uauth-input-wrap">
                          <input
                            id="reset-newPassword"
                            className="uauth-input"
                            type={showPassword ? 'text' : 'password'}
                            name="newPassword"
                            placeholder="Enter new password"
                            value={resetForm.newPassword}
                            onChange={handleResetChange}
                            autoFocus
                            required
                          />
                          <button
                            type="button"
                            className="uauth-eye-btn"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label="Toggle password"
                          >
                            {showPassword ? '👁️' : '🔒'}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="uauth-field">
                        <label className="uauth-label" htmlFor="reset-confirmPassword">
                          Confirm New Password *
                        </label>
                        <input
                          id="reset-confirmPassword"
                          className="uauth-input"
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Re-enter new password"
                          value={resetForm.confirmPassword}
                          onChange={handleResetChange}
                          required
                        />
                      </div>

                      {error && (
                        <div className="uauth-error" role="alert">
                          {error}
                        </div>
                      )}

                      <button type="submit" className="uauth-submit-btn" disabled={loading}>
                        {loading ? 'Updating Password...' : 'Save New Password & Finish'}
                      </button>
                    </form>
                  )}

                  {resetStep === 3 && (
                    <div className="uauth-success-box">
                      <h3>🎉 Password Reset Complete!</h3>
                      <p>Your password has been successfully updated. You can now log in to your account with your new credentials.</p>
                      <Link to="/login" className="uauth-submit-btn" style={{ textDecoration: 'none', marginTop: '1rem' }}>
                        Sign In Now →
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* ──────────────── MODE 2: FORGOT USERNAME ──────────────── */}
              {mode === 'username' && (
                <>
                  {!recoveredUser ? (
                    <form className="uauth-form" onSubmit={handleRecoverUsername} noValidate>
                      <div className="uauth-step-badge">
                        <span>Recover by Mobile, DOB &amp; Email</span>
                      </div>

                      {/* Mobile */}
                      <div className="uauth-field">
                        <label className="uauth-label" htmlFor="recover-mobile">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                            <line x1="12" y1="18" x2="12.01" y2="18"/>
                          </svg>
                          Registered Mobile Number *
                        </label>
                        <input
                          id="recover-mobile"
                          className="uauth-input"
                          type="tel"
                          name="mobile"
                          placeholder="10-digit mobile number"
                          value={userForm.mobile}
                          maxLength={10}
                          onChange={handleUserChange}
                          autoFocus
                          required
                        />
                      </div>

                      {/* DOB */}
                      <div className="uauth-field">
                        <label className="uauth-label" htmlFor="recover-dob">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          Date of Birth (DOB) *
                        </label>
                        <input
                          id="recover-dob"
                          className="uauth-input"
                          type="date"
                          name="dob"
                          value={userForm.dob}
                          max={new Date().toISOString().split('T')[0]}
                          onChange={handleUserChange}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="uauth-field">
                        <label className="uauth-label" htmlFor="recover-email">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          Registered Email Address *
                        </label>
                        <input
                          id="recover-email"
                          className="uauth-input"
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          value={userForm.email}
                          onChange={handleUserChange}
                          required
                        />
                      </div>

                      {error && (
                        <div className="uauth-error" role="alert">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          {error}
                        </div>
                      )}

                      <button type="submit" className="uauth-submit-btn" disabled={loading}>
                        {loading ? 'Finding Account...' : 'Find My Username →'}
                      </button>
                    </form>
                  ) : (
                    <div className="uauth-success-box">
                      <h3>🎉 Account Found!</h3>
                      <p>Applicant Name: <strong>{recoveredUser.fullName}</strong></p>
                      <p>Your registered username is:</p>
                      <div className="uauth-recovered-username">
                        {recoveredUser.username}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.25rem' }}>
                        <button
                          type="button"
                          className="uauth-submit-btn"
                          onClick={() => switchToResetWithFoundUser(recoveredUser.username)}
                        >
                          Reset Password for this Account →
                        </button>
                        <Link to="/login" className="uauth-switch-btn">
                          Sign In with this Username →
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="uauth-divider"><span>Remembered your password?</span></div>

              <Link to="/login" className="uauth-switch-btn">
                Back to Sign In →
              </Link>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a
                  href={WHATSAPP_HELP}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.82rem',
                    color: '#059669',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  💬 Need help? Message Admin on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
