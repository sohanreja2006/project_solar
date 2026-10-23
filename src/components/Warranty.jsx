import { useEffect, useRef } from 'react';
import './Warranty.css';

export default function Warranty() {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="warranty" id="warranty">
      <div className="container">
        <div className="warranty__inner stagger-children" ref={sectionRef}>
          <div className="warranty__text">
            <span className="eyebrow">Reliability</span>
            <h2 className="section-title warranty__title">
              Built For The Long Run.
            </h2>
            <p className="section-subtitle warranty__desc">
              Solar is a long-term investment. LOOM Solar products are designed with durability and longevity in mind.
            </p>
            <p className="warranty__support">
              Supported by local dealer and representative assistance in Malda.
            </p>
            <p className="warranty__note">
              Warranty and guarantee terms are as per the applicable LOOM Solar product documentation. Please enquire for full details.
            </p>
          </div>

          <div className="warranty__cards">
            <div className="warranty__card">
              <div className="warranty__card-years">5</div>
              <div className="warranty__card-unit">Years</div>
              <div className="warranty__card-label">GUARANTEE</div>
            </div>
            <div className="warranty__card warranty__card--gold">
              <div className="warranty__card-years">25</div>
              <div className="warranty__card-unit">Years</div>
              <div className="warranty__card-label">WARRANTY</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
