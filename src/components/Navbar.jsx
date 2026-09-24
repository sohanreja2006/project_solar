import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda.';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, to: '/', type: 'route' },
    { label: t.nav.calculator, to: '/calculator', type: 'route' },
    { label: t.nav.subsidy, to: '/subsidy', type: 'route' },
    { label: t.nav.distributor, to: '/#distributor', hash: '#distributor', type: 'anchor' },
    { label: t.nav.faq, to: '/faq', type: 'route' },
    { label: t.nav.contact, to: '/#contact', hash: '#contact', type: 'anchor' },
  ];

  const handleLinkClick = (e, link) => {
    setMobileOpen(false);
    if (link.type === 'anchor') {
      e.preventDefault();
      if (location.pathname === '/') {
        document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + link.hash);
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" onClick={() => setMobileOpen(false)}>
          <span className="navbar__brand-icon">☀️</span>
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">LOOM Solar</span>
            <span className="navbar__brand-sub">Trimurti Solar Systems</span>
          </div>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => (
            link.type === 'route' ? (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ) : (
              <a
                key={link.to}
                href={link.to}
                className="navbar__link"
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.label}
              </a>
            )
          ))}
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="navbar__cta">
            📲 {t.nav.whatsapp}
          </a>
          {/* Mobile Language Switcher */}
          <div className="navbar__mobile-lang">
            <LanguageSwitcher className="lang-switcher--mobile" />
          </div>
        </div>

        {/* Desktop Language Switcher */}
        <div className="navbar__desktop-lang">
          <LanguageSwitcher />
        </div>

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
    </nav>
  );
}
