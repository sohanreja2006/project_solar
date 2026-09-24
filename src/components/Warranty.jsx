import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './Warranty.css';

function AnimatedCounter({ value, suffix, displayText, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible || displayText) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [isVisible, value, displayText]);

  if (displayText) return <span>{displayText}</span>;
  return <span>{count}{suffix}</span>;
}

export default function Warranty() {
  const { t } = useLanguage();
  const [ref, isVisible] = useScrollReveal();

  const highlights = [
    {
      icon: '🛡️',
      value: t.warranty.guaranteeVal,
      suffix: t.warranty.guaranteeSuffix,
      label: t.warranty.guaranteeLabel,
      desc: t.warranty.guaranteeDesc,
    },
    {
      icon: '📋',
      value: t.warranty.warrantyVal,
      suffix: t.warranty.warrantySuffix,
      label: t.warranty.warrantyLabel,
      desc: t.warranty.warrantyDesc,
    },
    {
      icon: '🤝',
      value: 0,
      suffix: '',
      displayText: t.warranty.supportText,
      label: t.warranty.supportLabel,
      desc: t.warranty.supportDesc,
    },
  ];

  return (
    <section className="warranty" id="warranty">
      {/* Animated background grid */}
      <div className="warranty__grid-bg" aria-hidden="true"></div>
      <div className="warranty__glow warranty__glow--1" aria-hidden="true"></div>
      <div className="warranty__glow warranty__glow--2" aria-hidden="true"></div>

      <div className="container">
        <div ref={ref} className={`warranty__header reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <span className="section-label">{t.warranty.badge}</span>
          <h2 className="section-title">{t.warranty.title}</h2>
          <p className="section-subtitle">
            {t.warranty.subtitle}
          </p>
        </div>

        <div className={`warranty__grid stagger-children ${isVisible ? 'stagger-children--visible' : ''}`}>
          {highlights.map((item, i) => (
            <div className="warranty__card" key={i}>
              <div className="warranty__card-inner">
                <div className="warranty__card-icon">{item.icon}</div>
                <div className="warranty__card-value">
                  <AnimatedCounter value={item.value} suffix={item.suffix} displayText={item.displayText} isVisible={isVisible} />
                </div>
                <div className="warranty__card-label">{item.label}</div>
                <p className="warranty__card-desc">{item.desc}</p>
              </div>
              <div className="warranty__card-border"></div>
            </div>
          ))}
        </div>

        <div className={`warranty__note reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <p>{t.warranty.note}</p>
        </div>
      </div>
    </section>
  );
}
