import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './Distributor.css';

const WHATSAPP_DISTRIBUTOR = 'https://wa.me/917001516219?text=Hello%20MD%20Samayun%20Reja%20Ji%2C%20I%20am%20interested%20in%20LOOM%20Solar%20rooftop%20system%20for%20my%20home%20in%20Malda.';

export default function Distributor() {
  const { t } = useLanguage();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="distributor" id="distributor">
      <div className="distributor__mesh" aria-hidden="true"></div>
      <div className="container">
        <div ref={ref} className={`distributor__inner reveal ${isVisible ? 'reveal--visible' : ''}`}>
          
          {/* Section Header */}
          <div className="distributor__header">
            <span className="section-label">{t.distributor.badge}</span>
            <h2 className="section-title">{t.distributor.title}</h2>
            <p className="section-subtitle">
              {t.distributor.subtitle}
            </p>
          </div>

          <div className="distributor__card">
            {/* Profile Column */}
            <div className="distributor__profile">
              <div className="distributor__avatar-wrap">
                <img
                  src="/images/distributor.jpg"
                  alt="MD SAMAYUN REJA - SR Distributor Malda, LOOM Solar - Trimurti Solar Systems"
                  className="distributor__avatar"
                />
                <div className="distributor__badge">
                  <span className="distributor__badge-icon">✓</span>
                  <span>{t.distributor.authBadge}</span>
                </div>
              </div>

              {/* SR Distributor Logo Under Photo */}
              <div className="distributor__logo-wrap">
                <img
                  src="/images/sr-logo.png"
                  alt="SR DISTRIBUTOR Logo - Malda"
                  className="distributor__logo-img"
                />
                <span className="distributor__logo-caption">{t.distributor.logoCaption}</span>
              </div>

              <div className="distributor__meta">
                <h3 className="distributor__name">{t.distributor.name}</h3>
                <p className="distributor__role">{t.distributor.role}</p>
                <p className="distributor__company">{t.distributor.company}</p>
                <div className="distributor__location">
                  <span>📍</span> {t.distributor.location}
                </div>
              </div>

              <a
                href={WHATSAPP_DISTRIBUTOR}
                target="_blank"
                rel="noopener noreferrer"
                className="distributor__cta-btn"
                id="distributor-whatsapp-btn"
              >
                <span className="distributor__btn-shimmer"></span>
                <span>{t.distributor.chatBtn}</span>
              </a>
            </div>

            {/* Message Column */}
            <div className="distributor__content">
              <div className="distributor__quote-icon" aria-hidden="true">“</div>

              <div className="distributor__letter">
                <p className="distributor__salutation">{t.distributor.salutation}</p>

                <p className="distributor__paragraph">
                  {t.distributor.p1}
                </p>

                <p className="distributor__paragraph">
                  {t.distributor.p2}
                </p>

                <p className="distributor__paragraph">
                  {t.distributor.p3}
                </p>

                <p className="distributor__paragraph distributor__paragraph--callout">
                  {t.distributor.p4}
                </p>
              </div>

              {/* Trust Pillars */}
              <div className="distributor__pillars">
                <div className="distributor__pillar">
                  <span className="distributor__pillar-icon">☀️</span>
                  <div>
                    <strong>{t.distributor.pillar1Title}</strong>
                    <span>{t.distributor.pillar1Sub}</span>
                  </div>
                </div>
                <div className="distributor__pillar">
                  <span className="distributor__pillar-icon">💰</span>
                  <div>
                    <strong>{t.distributor.pillar2Title}</strong>
                    <span>{t.distributor.pillar2Sub}</span>
                  </div>
                </div>
                <div className="distributor__pillar">
                  <span className="distributor__pillar-icon">🤝</span>
                  <div>
                    <strong>{t.distributor.pillar3Title}</strong>
                    <span>{t.distributor.pillar3Sub}</span>
                  </div>
                </div>
              </div>

              {/* Signoff */}
              <div className="distributor__signoff">
                <div className="distributor__signoff-text">
                  <p className="distributor__warm-regards">{t.distributor.warmRegards}</p>
                  <p className="distributor__signature-name">{t.distributor.name}</p>
                  <p className="distributor__signature-title">{t.distributor.role} | {t.distributor.company}</p>
                  <p className="distributor__signature-phone">📞 {t.distributor.helpline} <strong>+91 7001516219</strong></p>
                </div>
                <div className="distributor__seal">
                  <div className="distributor__seal-inner">
                    <span>{t.distributor.sealOfficial}</span>
                    <strong>{t.distributor.sealDist}</strong>
                    <span>{t.distributor.sealMalda}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
