import { useEffect, useRef } from 'react';
import './WhySolar.css';

const benefits = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    title: 'Generate Clean Energy',
    desc: 'Harness Malda’s high solar irradiance directly on your rooftop, drastically cutting your reliance on the conventional power grid.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: 'Slash Electricity Bills',
    desc: 'Offset expensive tiered electricity tariffs by up to 80–90% during peak daytime hours, shielding your family from future tariff hikes.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Engineered for Homes',
    desc: 'From compact 1 kW setups to robust 10 kW high-output configurations, each system is calibrated for your roof geometry and domestic loads.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: 'WBSEDCL Net-Metering',
    desc: 'Export surplus generated daytime units back to the West Bengal state grid, earning bill credits that offset your nighttime consumption.',
  },
];

export default function WhySolar() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            if (gridRef.current) gridRef.current.classList.add('stagger-children--visible');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-solar" id="why-solar">
      <div className="container">
        <div className="why-solar__header reveal" ref={sectionRef}>
          <span className="eyebrow">Why Choose Solar</span>
          <h2 className="section-title why-solar__title">
            The Smarter, Cleaner Way<br />to Power Your Home
          </h2>
          <p className="section-subtitle why-solar__subtitle">
            Rooftop solar turns an ongoing monthly expense into an appreciating household asset. Generate your own power with proven LOOM Solar technology.
          </p>
        </div>

        <div className="why-solar__grid stagger-children" ref={gridRef}>
          {benefits.map((b, i) => (
            <div className="why-solar__card" key={i}>
              <div className="why-solar__card-icon">{b.icon}</div>
              <h3 className="why-solar__card-title">{b.title}</h3>
              <p className="why-solar__card-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
