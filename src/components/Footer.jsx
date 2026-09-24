import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__brand-icon">☀️</span>
            <div>
              <div className="footer__brand-name">LOOM Solar – Trimurti Solar Systems</div>
              <div className="footer__brand-sub">SR DISTRIBUTOR – MALDA</div>
            </div>
          </div>
          <div className="footer__contact">
            <span>WhatsApp: <strong>7001516219</strong></span>
          </div>
        </div>

        <div className="footer__links">
          <Link to="/">{t.nav.home}</Link>
          <Link to="/calculator">{t.nav.calculator}</Link>
          <Link to="/subsidy">{t.nav.subsidy}</Link>
          <a href="/#distributor">{t.nav.distributor}</a>
          <Link to="/faq">{t.nav.faq}</Link>
          <a href="/#contact">{t.nav.contact}</a>
        </div>

        <div className="footer__disclaimer">
          <p>{t.footer.disclaimer}</p>
        </div>

        <div className="footer__bottom">
          <p>© {currentYear} LOOM Solar – Trimurti Solar Systems. SR Distributor – Malda. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
