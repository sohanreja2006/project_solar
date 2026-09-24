import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './PageHeader.css';

export default function PageHeader({ badge, title, subtitle, breadcrumb }) {
  const { t } = useLanguage();

  return (
    <section className="page-header">
      <div className="page-header__bg" aria-hidden="true"></div>
      <div className="container page-header__inner">
        <nav className="page-header__breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">🏠 {t.nav.home}</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{breadcrumb}</span>
        </nav>

        {badge && <span className="section-label">{badge}</span>}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
