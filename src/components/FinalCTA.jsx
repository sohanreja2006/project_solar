import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './FinalCTA.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda.';

export default function FinalCTA() {
  const { t } = useLanguage();
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="final-cta">
      <div className="final-cta__bg">
        <img
          src="/images/installation.jpg"
          alt="LOOM Solar installation technicians working on a rooftop in Malda"
          className="final-cta__bg-img"
        />
        <div className="final-cta__overlay"></div>
        <div className="final-cta__grid-bg" aria-hidden="true"></div>
        <div className="final-cta__orb final-cta__orb--1" aria-hidden="true"></div>
        <div className="final-cta__orb final-cta__orb--2" aria-hidden="true"></div>
      </div>
      <div ref={ref} className={`container final-cta__inner reveal-scale ${isVisible ? 'reveal-scale--visible' : ''}`}>
        <div className="final-cta__sun-wrap">
          <span className="final-cta__sun">☀️</span>
          <div className="final-cta__sun-rays"></div>
        </div>
        <h2 className="final-cta__title">
          {t.finalCta.title}
        </h2>
        <p className="final-cta__subtitle">
          {t.finalCta.subtitle}
        </p>
        <div className="final-cta__brand">
          <strong>{t.finalCta.brand}</strong>
          <span>{t.finalCta.distributor}</span>
        </div>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="final-cta__btn" id="final-whatsapp-btn">
          <span className="final-cta__btn-shimmer"></span>
          {t.finalCta.btn}
        </a>
        <p className="final-cta__note">
          {t.finalCta.note}
        </p>
      </div>
    </section>
  );
}
