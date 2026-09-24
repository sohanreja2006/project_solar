import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './WhySolar.css';

const benefitIcons = [
  { icon: '☀️', gradient: 'linear-gradient(135deg, #fef9c3, #fde68a)', glow: 'rgba(250, 204, 21, 0.15)' },
  { icon: '💰', gradient: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', glow: 'rgba(34, 197, 94, 0.15)' },
  { icon: '🏠', gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', glow: 'rgba(59, 130, 246, 0.15)' },
  { icon: '🔋', gradient: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', glow: 'rgba(124, 58, 237, 0.15)' },
  { icon: '🛡️', gradient: 'linear-gradient(135deg, #ccfbf1, #99f6e4)', glow: 'rgba(13, 148, 136, 0.15)' },
];

export default function WhySolar() {
  const { t } = useLanguage();
  const [headerRef, headerVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <section className="why-solar" id="why-solar">
      {/* Decorative blobs */}
      <div className="why-solar__blob why-solar__blob--1" aria-hidden="true"></div>
      <div className="why-solar__blob why-solar__blob--2" aria-hidden="true"></div>

      <div className="container">
        <div ref={headerRef} className={`why-solar__header reveal ${headerVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">{t.whySolar.badge}</span>
          <h2 className="section-title">{t.whySolar.title}</h2>
          <p className="section-subtitle">
            {t.whySolar.subtitle}
          </p>
        </div>

        <div ref={gridRef} className={`why-solar__grid stagger-children ${gridVisible ? 'stagger-children--visible' : ''}`}>
          {t.whySolar.benefits.map((item, i) => {
            const visual = benefitIcons[i] || benefitIcons[0];
            return (
              <article
                className="benefit-card"
                key={i}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ '--card-glow': visual.glow }}
              >
                <div className="benefit-card__spotlight"></div>
                <div className="benefit-card__icon" style={{ background: visual.gradient }}>
                  <span>{visual.icon}</span>
                </div>
                <h3 className="benefit-card__title">{item.title}</h3>
                <p className="benefit-card__desc">{item.desc}</p>
                <div className="benefit-card__number">{String(i + 1).padStart(2, '0')}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
