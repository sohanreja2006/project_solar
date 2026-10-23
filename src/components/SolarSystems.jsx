import { useEffect, useRef } from 'react';
import './SolarSystems.css';

const systems = [
  {
    kw: '1 KW',
    tagline: 'Starter Home',
    appliances: ['4 Lights', '4 Fans', '1 Water Pump', '1 Refrigerator'],
    note: null,
  },
  {
    kw: '2 KW',
    tagline: 'Mid-Size Home',
    appliances: ['8 Lights', '8 Fans', '1 Water Pump', '1 Refrigerator', '1 Washing Machine'],
    note: null,
    featured: true,
  },
  {
    kw: '3 KW',
    tagline: 'Larger Home',
    appliances: ['12 Lights', '12 Fans', '1 Water Pump', '1 Washing Machine', '1 Air Conditioner'],
    note: null,
  },
  {
    kw: '10 KW',
    tagline: 'High Capacity',
    appliances: [],
    note: 'Higher-capacity residential and commercial applications. Subject to technical assessment and applicable rules.',
  },
];

export default function SolarSystems() {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="solar-systems" id="systems">
      <div className="container">
        <div className="solar-systems__header reveal" ref={sectionRef}>
          <span className="eyebrow">Solar Capacity</span>
          <h2 className="section-title">
            Find the Right Solar System<br />for Your Home
          </h2>
          <p className="section-subtitle solar-systems__note-global">
            These are illustrative household load examples only. Actual solar capacity should be determined through a proper load and site assessment.
          </p>
        </div>

        <div className="solar-systems__grid stagger-children" ref={gridRef}>
          {systems.map((s, i) => (
            <div className={`solar-systems__card ${s.featured ? 'solar-systems__card--featured' : ''}`} key={i}>
              {s.featured && <div className="solar-systems__badge">Most Popular</div>}
              <div className="solar-systems__kw">{s.kw}</div>
              <div className="solar-systems__tagline">{s.tagline}</div>

              {s.appliances.length > 0 ? (
                <ul className="solar-systems__list">
                  {s.appliances.map((a, j) => (
                    <li key={j}>
                      <span className="solar-systems__check">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="solar-systems__special-note">{s.note}</p>
              )}

              {s.appliances.length > 0 && (
                <p className="solar-systems__illustration-note">Illustrative load example</p>
              )}
            </div>
          ))}
        </div>

        <p className="solar-systems__disclaimer">
          * Actual solar capacity requirement depends on your specific appliances, usage patterns, roof space availability, and technical feasibility. Our team will help you choose the right system through a proper site and load assessment.
        </p>
      </div>
    </section>
  );
}
