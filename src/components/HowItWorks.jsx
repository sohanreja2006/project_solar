import { useEffect, useRef } from 'react';
import './HowItWorks.css';

const steps = [
  { num: '01', title: 'Connect With Us', desc: 'Reach out via call or WhatsApp to discuss your solar requirements.' },
  { num: '02', title: 'Share Your Location & Requirements', desc: 'Tell us your block, area, and approximate electricity usage.' },
  { num: '03', title: 'Site / Load Assessment', desc: 'Our team visits your home for a technical site and load evaluation.' },
  { num: '04', title: 'Solar Installation', desc: 'Professional installation by qualified technicians after approvals.' },
];

export default function HowItWorks() {
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
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="how-it-works__header reveal" ref={sectionRef}>
          <span className="eyebrow">Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From your first enquiry to a fully operational solar system — here's what to expect.
          </p>
        </div>

        <div className="how-it-works__steps stagger-children" ref={stepsRef}>
          {steps.map((step, i) => (
            <div className="how-it-works__step" key={i}>
              <div className="how-it-works__step-connector"></div>
              <div className="how-it-works__step-num">{step.num}</div>
              <h3 className="how-it-works__step-title">{step.title}</h3>
              <p className="how-it-works__step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
