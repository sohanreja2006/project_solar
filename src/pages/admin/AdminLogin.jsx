import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authenticateAdmin, getAdminSession } from '../../lib/adminAuth';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    const session = getAdminSession();
    if (session) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !uniqueId.trim()) {
      setError('Please enter both your registered Admin Email and Unique ID.');
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateAdmin(email, uniqueId);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setError('An error occurred during verification: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-page">
      <div className="al-container">
        
        {/* Portal Branding */}
        <div className="al-header">
          <div className="al-logo-row">
            <img src="/images/sr-logo.png" alt="SR Distributor" className="al-logo-sr" />
            <div className="al-divider-v" />
            <img src="/images/tss-logo.jpeg" alt="TSS" className="al-logo-tss" />
          </div>
          <span className="al-badge">ADMIN CONTROL PORTAL</span>
          <h1 className="al-title">Trimurti Solar Systems</h1>
          <p className="al-subtitle">SR Distributor, Malda • PM Surya Ghar Submissions Manager</p>
        </div>

        {/* Login Card */}
        <div className="al-card">
          <div className="al-card-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h2>Secure Admin Login</h2>
          </div>
          <p className="al-card-desc">Sign in with your registered admin email and unique security pass ID.</p>

          {error && (
            <div className="al-error" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="al-form" onSubmit={handleSubmit}>
            <div className="al-field">
              <label className="al-label" htmlFor="admin-email">Admin Email Address</label>
              <div className="al-input-wrap">
                <svg className="al-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="admin-email"
                  type="email"
                  className="al-input"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="al-field">
              <label className="al-label" htmlFor="admin-id">Unique Admin ID / Passcode</label>
              <div className="al-input-wrap">
                <svg className="al-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="admin-id"
                  type={showPassword ? 'text' : 'password'}
                  className="al-input"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                {uniqueId && (
                  <button
                    type="button"
                    className="al-eye-btn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            <button type="submit" className="al-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="al-spinner" /> Verifying Access...
                </>
              ) : (
                <>
                  Enter Admin Dashboard
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="al-card-footer">
            <Link to="/" className="al-back-link">
              ← Return to Loom Solar Main Website
            </Link>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="al-page-footer">
          <span>Protected by AES &amp; Supabase Database Row Level Security • Authorized Access Only</span>
        </div>

      </div>
    </div>
  );
}
