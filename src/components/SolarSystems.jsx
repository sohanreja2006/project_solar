import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './SolarSystems.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda.';

const systemVisuals = [
  {
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    glow: 'rgba(34, 197, 94, 0.2)',
    tag: 'Starter',
    appliances: [
      { icon: '💡', label: '4 Lights' },
      { icon: '🌀', label: '4 Fans' },
      { icon: '🚿', label: '1 Water Pump' },
      { icon: '🧊', label: '1 Refrigerator' },
    ],
  },
  {
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    glow: 'rgba(59, 130, 246, 0.2)',
    tag: 'Popular',
    highlight: true,
    appliances: [
      { icon: '💡', label: '8 Lights' },
      { icon: '🌀', label: '8 Fans' },
      { icon: '🚿', label: '1 Water Pump' },
      { icon: '🧊', label: '1 Refrigerator' },
      { icon: '👕', label: '1 Washing Machine' },
    ],
  },
  {
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    glow: 'rgba(124, 58, 237, 0.2)',
    tag: 'Premium',
    appliances: [
      { icon: '💡', label: '12 Lights' },
      { icon: '🌀', label: '12 Fans' },
      { icon: '🚿', label: '1 Water Pump' },
      { icon: '👕', label: '1 Washing Machine' },
      { icon: '❄️', label: '1 AC' },
    ],
  },
  {
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    glow: 'rgba(245, 158, 11, 0.2)',
    tag: 'Heavy Load',
    appliances: [
      { icon: '💡', label: 'Full Home Lighting' },
      { icon: '🌀', label: 'All Ceiling Fans' },
      { icon: '❄️', label: '2 Inverter ACs' },
      { icon: '🧊', label: 'Large Fridge + Deep Freezer' },
      { icon: '🚿', label: 'Water Pump & Heavy Appliances' },
    ],
  },
];

export default function SolarSystems() {
  const { t } = useLanguage();
  const [headerRef, headerVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="solar-systems" id="systems">
      <div className="container">
        <div ref={headerRef} className={`solar-systems__header reveal ${headerVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">{t.systems.badge}</span>
          <h2 className="section-title">{t.systems.title}</h2>
          <p className="section-subtitle">
            {t.systems.subtitle}
          </p>
        </div>

        <div ref={gridRef} className={`solar-systems__grid stagger-children ${gridVisible ? 'stagger-children--visible' : ''}`}>
          {t.systems.cards.map((sys, i) => {
            const visual = systemVisuals[i] || systemVisuals[0];
            return (
              <article
                className={`system-card ${visual.highlight ? 'system-card--highlight' : ''}`}
                key={i}
                style={{ '--card-gradient': visual.gradient, '--card-glow': visual.glow }}
              >
                {/* Animated border */}
                <div className="system-card__border-glow"></div>

                {visual.highlight && <div className="system-card__ribbon">⭐ {t.systems.popular}</div>}
                <div className="system-card__badge">{visual.tag}</div>
                <div className="system-card__kw-wrap">
                  <span className="system-card__kw">{sys.kw}</span>
                  <span className="system-card__unit">{t.systems.kw}</span>
                </div>
                <p className="system-card__label">{sys.name}</p>

                <div className="system-card__divider"></div>

                <div className="system-card__specs">
                  <div className="system-card__spec-item">
                    <span className="system-card__spec-label">🎯 {t.systems.idealFor}:</span>
                    <span className="system-card__spec-val">{sys.ideal}</span>
                  </div>
                  <div className="system-card__spec-item">
                    <span className="system-card__spec-label">⚡ {t.systems.appliances}:</span>
                    <span className="system-card__spec-val">{sys.appliances}</span>
                  </div>
                  <div className="system-card__spec-item">
                    <span className="system-card__spec-label">📈 {t.systems.generation}:</span>
                    <span className="system-card__spec-val">{sys.units}</span>
                  </div>
                  <div className="system-card__spec-item">
                    <span className="system-card__spec-label">💰 {t.systems.subsidy}:</span>
                    <span className="system-card__spec-val highlight-green">{sys.subsidy}</span>
                  </div>
                </div>

                <a
                  href={`${WHATSAPP_LINK} (${sys.name})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="system-card__cta"
                >
                  <span className="system-card__cta-glow"></span>
                  {t.systems.cta} →
                </a>
              </article>
            );
          })}
        </div>

        <div className={`solar-systems__footer reveal ${headerVisible ? 'reveal--visible' : ''}`}>
          <p className="solar-systems__note">
            ⚡ {t.systems.footerNote}
          </p>
          <div className="solar-systems__calc-action">
            <Link to="/calculator" className="systems-calc-link" id="systems-to-calculator-link">
              🧮 {t.calculator.title} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
