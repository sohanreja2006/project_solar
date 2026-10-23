import { useEffect, useRef } from 'react';
import './SubsidyEMI.css';

const steps = [
  { num: '01', label: 'Enquire', desc: 'Get in touch with us to discuss your requirements.' },
  { num: '02', label: 'Site & Load Assessment', desc: 'Our team visits your home for a technical assessment.' },
  { num: '03', label: 'Installation', desc: 'Professional solar installation by qualified technicians.' },
];

export default function SubsidyEMI() {
  const sectionRef = useRef(null);
  const stepsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            if (stepsRef.current) stepsRef.current.classList.add('stagger-children--visible');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="subsidy" id="subsidy">
      <div className="container">
        <div className="subsidy__header reveal" ref={sectionRef}>
          <span className="eyebrow">Subsidy & Financing</span>
          <h2 className="section-title subsidy__title">
            Make Your Solar Journey<br />More Accessible.
          </h2>
          <p className="section-subtitle subsidy__desc">
            Government subsidy and EMI/financing options may be available depending on the applicable government scheme, your eligibility, technical feasibility and approval. Our team will guide you through the applicable process.
          </p>
        </div>

        <div className="subsidy__steps stagger-children" ref={stepsRef}>
          {steps.map((step, i) => (
            <div className="subsidy__step" key={i}>
              <div className="subsidy__step-num">{step.num}</div>
              <div className="subsidy__step-content">
                <h3 className="subsidy__step-label">{step.label}</h3>
                <p className="subsidy__step-desc">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="subsidy__step-arrow" aria-hidden="true">→</div>
              )}
            </div>
          ))}
        </div>

        <div className="subsidy__cta-row">
          <a
            href="https://wa.me/917001516219?text=Hi%2C%20I%20want%20to%20know%20about%20Government%20subsidy%20and%20EMI%20options%20for%20solar%20in%20Malda."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            id="subsidy-enquire-btn"
          >
            Enquire About Subsidy & EMI
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        <p className="subsidy__disclaimer">
          Government subsidy and financing options are subject to applicable government regulations, eligibility criteria, technical feasibility and approval. Please enquire for current applicable schemes.
        </p>
      </div>
    </section>
  );
}
