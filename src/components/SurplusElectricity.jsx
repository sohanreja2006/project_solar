import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './SurplusElectricity.css';

export default function SurplusElectricity() {
  const { t } = useLanguage();
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="surplus" id="surplus">
      <div className="container">
        <div ref={ref} className={`surplus__inner reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <div className="surplus__icon-wrap">
            <span className="surplus__icon">🔋</span>
            <div className="surplus__icon-ring"></div>
            <div className="surplus__icon-ring surplus__icon-ring--2"></div>
          </div>
          <div className="surplus__content">
            <span className="section-label">{t.surplus.badge}</span>
            <h2 className="section-title">{t.surplus.title}</h2>
            <p className="surplus__text">
              {t.surplus.desc}
            </p>
            <div className="surplus__visual">
              <div className={`surplus__flow ${isVisible ? 'surplus__flow--animate' : ''}`}>
                <div className="surplus__flow-item">
                  <span>☀️</span>
                  <small>{t.surplus.step1Title}</small>
                </div>
                <div className="surplus__flow-arrow">
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                    <path d="M0 12h32m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="surplus__flow-item">
                  <span>🏠</span>
                  <small>{t.surplus.step2Title}</small>
                </div>
                <div className="surplus__flow-arrow">
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                    <path d="M0 12h32m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="surplus__flow-item surplus__flow-item--highlight">
                  <span>⚡</span>
                  <small>{t.surplus.step3Title}</small>
                </div>
              </div>
              {/* Energy flow line */}
              <div className={`surplus__energy-line ${isVisible ? 'surplus__energy-line--animate' : ''}`}></div>
            </div>
            <p className="surplus__disclaimer">
              {t.surplus.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
