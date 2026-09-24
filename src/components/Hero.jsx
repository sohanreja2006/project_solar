import { useLanguage } from '../context/LanguageContext';
import SolarCanvas from './SolarCanvas';
import './Hero.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda.';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="hero">
      <div className="hero__bg">
        <img src="/images/hero.jpg" alt="Rooftop solar panels on Indian home in Malda" className="hero__bg-img" />
        <div className="hero__overlay"></div>
      </div>

      {/* Particle canvas */}
      <SolarCanvas />

      {/* Animated mesh gradient orbs */}
      <div className="hero__orb hero__orb--1" aria-hidden="true"></div>
      <div className="hero__orb hero__orb--2" aria-hidden="true"></div>
      <div className="hero__orb hero__orb--3" aria-hidden="true"></div>

      <div className="hero__content container">
        <div className="hero__badge">
          <span className="hero__badge-dot"></span>
          {t.hero.badge}
        </div>

        <h1 className="hero__title">
          <span className="hero__title-sun">☀️</span> {t.hero.title1}<br />{t.hero.title2}
        </h1>

        <p className="hero__subtitle">
          {t.hero.subtitle}<br />
          <strong>{t.hero.brand}</strong>
        </p>

        <p className="hero__bengali">
          {t.hero.bengaliTagline}
        </p>

        <p className="hero__desc">
          {t.hero.desc}
        </p>

        <div className="hero__ctas">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hero__btn hero__btn--whatsapp" id="hero-whatsapp-btn">
            <span className="hero__btn-glow"></span>
            {t.hero.whatsappBtn}
          </a>
          <a href="#contact" className="hero__btn hero__btn--consult" id="hero-consult-btn"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            {t.hero.consultBtn}
          </a>
        </div>

        <div className="hero__contact">
          <span>📞 {t.hero.whatsappText} <strong>7001516219</strong></span>
        </div>

        <p className="hero__disclaimer">
          {t.hero.disclaimer}
        </p>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <div className="hero__scroll-mouse">
          <span></span>
        </div>
        <p>{t.hero.scrollHint}</p>
      </div>
    </section>
  );
}
