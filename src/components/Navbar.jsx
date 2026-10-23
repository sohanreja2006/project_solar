import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import './Navbar.css';


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUserAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner container">
        {/* Brand with Logos Lockup */}
        <a href="/" className="navbar__brand" aria-label="Trimurti Solar Systems Malda">
          <img
            src="/images/sr-logo.png"
            alt="Trimurti Solar Systems Logo"
            className="navbar__sr-logo"
          />
          <div className="navbar__brand-col">
            <div className="navbar__brand-text">
              <span className="navbar__brand-title">
                <span className="brand-sr">SR</span>
                <span className="brand-dist">DISTRIBUTOR</span>
                <span className="brand-sep">&bull;</span>
                <span className="brand-loc">MALDA</span>
              </span>
              <span className="navbar__brand-sub">Trimurti Solar Systems</span>
            </div>
            <div className="navbar__assoc-logos">
              <img src="/images/nexis-logo.png" alt="NEXIS Renewable Energy" className="navbar__assoc-img" />
              <img src="/images/tss-logo.jpeg" alt="TSS Green Solar Energy" className="navbar__assoc-img" />
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`} aria-label="Main Navigation">
          <button className="navbar__link" onClick={() => scrollTo('#why-solar')}>Why Solar</button>
          <button className="navbar__link" onClick={() => scrollTo('#systems')}>Systems</button>
          <button className="navbar__link" onClick={() => scrollTo('#subsidy')}>Subsidy &amp; EMI</button>
          <button className="navbar__link" onClick={() => scrollTo('#warranty')}>Warranty</button>
          <button className="navbar__link" onClick={() => scrollTo('#how-it-works')}>Process</button>
          <button className="navbar__link navbar__link--highlight" onClick={() => scrollTo('#apply')}>
            Apply Online
          </button>
          <button className="navbar__link" onClick={() => scrollTo('#contact')}>Contact</button>
          <Link to="/admin/login" className="navbar__link navbar__link--admin" title="Admin Control Center">
            🛡️ Admin
          </Link>

          <div className="navbar__mobile-actions">
            <a href="tel:+917001516219" className="navbar__mobile-phone">
              &#9742; Call: 7001516219
            </a>
            <Link
              to="/admin/login"
              className="navbar__admin-btn--mobile"
              onClick={() => setMobileOpen(false)}
            >
              🛡️ Admin Control Portal
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="navbar__cta navbar__cta--mobile"
                onClick={() => setMobileOpen(false)}
              >
                👤 My Application
              </Link>
            ) : (
              <Link
                to="/login"
                className="navbar__cta navbar__cta--mobile"
                onClick={() => setMobileOpen(false)}
              >
                🔐 Login / Sign Up
              </Link>
            )}
          </div>
        </nav>

        {/* Right Actions: Phone + Auth + WhatsApp + Hamburger */}
        <div className="navbar__right-actions">
          <a href="tel:+917001516219" className="navbar__desktop-phone" title="Call Malda Distributor Helpline">
            <span className="navbar__phone-icon" aria-hidden="true">&#9742;</span>
            <span className="navbar__phone-text">7001516219</span>
          </a>

          {/* Auth Button */}
          {user ? (
            <Link to="/dashboard" className="navbar__user-btn" id="nav-account-btn" title="My Application Dashboard">
              <div className="navbar__user-avatar">
                {(user.fullName || user.username || 'U')[0].toUpperCase()}
              </div>
              <span className="navbar__user-label">My Application</span>
            </Link>
          ) : (
            <Link to="/login" className="navbar__login-btn" id="nav-login-btn" title="Login or Sign Up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Login
            </Link>
          )}
          <button
            className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
