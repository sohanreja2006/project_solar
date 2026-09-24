import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './SubsidyEMI.css';

const stepIcons = ['📋', '🔍', '⚡', '🏦'];

export default function SubsidyEMI() {
  const { t } = useLanguage();
  const [headerRef, headerVisible] = useScrollReveal();
  const [featRef, featVisible] = useScrollReveal();
  const [stepsRef, stepsVisible] = useScrollReveal();

  return (
    <section className="subsidy" id="subsidy">
      <div className="subsidy__mesh" aria-hidden="true"></div>
      <div className="container">
        <div ref={headerRef} className={`subsidy__header reveal ${headerVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">{t.subsidy.badge}</span>
          <h2 className="section-title">{t.subsidy.title}</h2>
          <p className="section-subtitle">
            {t.subsidy.subtitle}
          </p>
        </div>

        <div ref={featRef} className={`subsidy__features stagger-children ${featVisible ? 'stagger-children--visible' : ''}`}>
          <div className="subsidy__feature">
            <div className="subsidy__feature-icon-wrap">
              <div className="subsidy__feature-icon">🏛️</div>
              <div className="subsidy__feature-ring"></div>
            </div>
            <h3>{t.subsidy.subsidyTitle}</h3>
            <p>{t.subsidy.subsidyDesc}</p>
            <ul className="subsidy__points">
              <li>✅ {t.subsidy.subsidyPoint1}</li>
              <li>✅ {t.subsidy.subsidyPoint2}</li>
              <li>✅ {t.subsidy.subsidyPoint3}</li>
            </ul>
          </div>
          <div className="subsidy__feature">
            <div className="subsidy__feature-icon-wrap">
              <div className="subsidy__feature-icon">💳</div>
              <div className="subsidy__feature-ring"></div>
            </div>
            <h3>{t.subsidy.emiTitle}</h3>
            <p>{t.subsidy.emiDesc}</p>
            <ul className="subsidy__points">
              <li>✅ {t.subsidy.emiPoint1}</li>
              <li>✅ {t.subsidy.emiPoint2}</li>
              <li>✅ {t.subsidy.emiPoint3}</li>
            </ul>
          </div>
        </div>

        <div ref={stepsRef} className={`subsidy__steps reveal ${stepsVisible ? 'reveal--visible' : ''}`}>
          <h3 className="subsidy__steps-title">{t.subsidy.processTitle}</h3>
          <div className="subsidy__steps-grid">
            {t.subsidy.steps.map((step, i) => (
              <div className="subsidy__step" key={i}>
                <div className="subsidy__step-num">{step.num}</div>
                <div className="subsidy__step-icon">{stepIcons[i] || '⚡'}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {i < t.subsidy.steps.length - 1 && (
                  <div className="subsidy__step-connector" aria-hidden="true">
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                      <path d="M0 12h32m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
