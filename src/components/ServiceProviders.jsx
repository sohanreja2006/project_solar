import { useEffect, useRef } from 'react';
import './ServiceProviders.css';

const providers = [
  {
    id: 'nexis',
    logo: '/images/nexis-logo.png',
    name: 'NEXIS Renewable Energy',
    desc: 'End-to-end renewable energy solutions across Malda & surrounding districts.',
  },
  {
    id: 'tss',
    logo: '/images/tss-logo.jpeg',
    name: 'Trimurti Solar Systems',
    desc: 'Authorized SR Distributor for LOOM Solar in Malda — rooftop solar installation, subsidy support & net-metering facilitation.',
  },
  {
    id: 'gei',
    logo: '/images/green-energy-infra-logo.png',
    name: 'Green Energy Infra Pvt. Ltd.',
    desc: 'Infrastructure-grade solar installation, grid-tie systems & O&M support.',
  },
];

export default function ServiceProviders() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('stagger-children--visible');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="service-providers" id="service-providers">
      <div className="container">
        <div className="service-providers__header">
          <span className="eyebrow">Trusted Network</span>
          <h2 className="section-title">Our Service Providers</h2>
          <p className="section-subtitle">
            We collaborate with established solar energy companies to deliver reliable, high-quality installations across Malda.
          </p>
        </div>

        <div className="service-providers__grid stagger-children" ref={sectionRef}>
          {providers.map((p) => (
            <div className="sp-card" key={p.id}>
              <div className="sp-card__logo-wrap">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="sp-card__logo"
                />
              </div>
              <div className="sp-card__body">
                <h3 className="sp-card__name">{p.name}</h3>
                <p className="sp-card__desc">{p.desc}</p>
              </div>
              <div className="sp-card__shine" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
