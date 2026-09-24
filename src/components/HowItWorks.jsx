import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './HowItWorks.css';

const stepIcons = ['📞', '📍', '🤝', '🏠', '🔧', '⚡'];

export default function HowItWorks() {
  const { t } = useLanguage();
  const [headerRef, headerVisible] = useScrollReveal();
  const [timelineRef, timelineVisible] = useScrollReveal({ threshold: 0.05 });

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div ref={headerRef} className={`how-it-works__header reveal ${headerVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">{t.howItWorks.badge}</span>
          <h2 className="section-title">{t.howItWorks.title}</h2>
          <p className="section-subtitle">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div ref={timelineRef} className={`how-it-works__timeline stagger-children ${timelineVisible ? 'stagger-children--visible' : ''}`}>
          {t.howItWorks.steps.map((step, i) => (
            <div className="timeline-step" key={i}>
              <div className="timeline-step__marker">
                <div className="timeline-step__num">
                  <span className="timeline-step__num-text">{step.num}</span>
                  <div className="timeline-step__num-ring"></div>
                </div>
                {i < t.howItWorks.steps.length - 1 && (
                  <div className="timeline-step__line">
                    <div className="timeline-step__line-fill"></div>
                  </div>
                )}
              </div>
              <div className="timeline-step__content">
                <div className="timeline-step__icon">{stepIcons[i] || '⚡'}</div>
                <h4 className="timeline-step__title">{step.title}</h4>
                <p className="timeline-step__desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
