import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './SolarCalculator.css';

const PRESETS = [1500, 2500, 3500, 5000, 8000];

export default function SolarCalculator() {
  const { t } = useLanguage();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [bill, setBill] = useState(3000);

  // Sizing & savings logic
  let capacity = 2;
  let subsidy = 66000;
  let roofArea = 180;
  let paybackYears = '3.2';

  if (bill < 2000) {
    capacity = 1;
    subsidy = 33000;
    roofArea = 90;
    paybackYears = '3.5';
  } else if (bill <= 3800) {
    capacity = 2;
    subsidy = 66000;
    roofArea = 180;
    paybackYears = '3.1';
  } else if (bill <= 6500) {
    capacity = 3;
    subsidy = 78000;
    roofArea = 270;
    paybackYears = '2.9';
  } else if (bill <= 10000) {
    capacity = 5;
    subsidy = 78000;
    roofArea = 450;
    paybackYears = '3.2';
  } else {
    capacity = 7;
    subsidy = 78000;
    roofArea = 630;
    paybackYears = '3.4';
  }

  const monthlySavings = Math.round(bill * 0.85);
  // 25-year cumulative savings with 3% estimated annual tariff inflation
  const lifetimeSavings = Math.round(monthlySavings * 12 * 25 * 1.25);

  const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

  const waMessage = encodeURIComponent(
    `Hello LOOM Solar Malda!\n` +
    `I used your Solar Savings Calculator:\n` +
    `- My Monthly Electricity Bill: ${formatCurrency(bill)}\n` +
    `- Recommended Solar Capacity: ${capacity} KW\n` +
    `- Eligible PM Surya Ghar Subsidy: ${formatCurrency(subsidy)}\n` +
    `- Estimated Monthly Savings: ${formatCurrency(monthlySavings)}\n` +
    `Please provide a detailed site assessment and quote for my home in Malda.`
  );

  return (
    <section className="calculator" id="calculator">
      <div className="calculator__bg" aria-hidden="true"></div>
      <div className="container">
        <div ref={ref} className={`calculator__inner reveal ${isVisible ? 'reveal--visible' : ''}`}>
          
          <div className="calculator__header">
            <span className="section-label">{t.calculator.badge}</span>
            <h2 className="section-title">{t.calculator.title}</h2>
            <p className="section-subtitle">
              {t.calculator.subtitle}
            </p>
          </div>

          <div className="calculator__card">
            {/* Input Column */}
            <div className="calculator__input-col">
              <div className="calculator__bill-display">
                <span className="calculator__bill-label">{t.calculator.billLabel}</span>
                <span className="calculator__bill-amount">{formatCurrency(bill)}</span>
                <span className="calculator__bill-per">/ month</span>
              </div>

              {/* Slider */}
              <div className="calculator__slider-wrap">
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="250"
                  value={bill}
                  onChange={(e) => setBill(Number(e.target.value))}
                  className="calculator__slider"
                  id="solar-bill-slider"
                  aria-label={t.calculator.billLabel}
                />
                <div className="calculator__slider-range">
                  <span>₹1,000</span>
                  <span>₹7,500</span>
                  <span>₹15,000+</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="calculator__presets">
                <span className="calculator__presets-label">{t.calculator.billHelper}</span>
                <div className="calculator__preset-btns">
                  {PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`preset-btn ${bill === amt ? 'preset-btn--active' : ''}`}
                      onClick={() => setBill(amt)}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="calculator__quick-note">
                <span>💡</span>
                <p>
                  Calculated based on standard WBSEDCL residential tariff slabs and average Malda solar generation (~300 sunny days/year).
                </p>
              </div>
            </div>

            {/* Results Column */}
            <div className="calculator__result-col">
              <div className="calculator__result-grid">
                
                {/* Recommended System */}
                <div className="result-metric result-metric--highlight">
                  <span className="result-metric__icon">⚡</span>
                  <div className="result-metric__meta">
                    <span className="result-metric__label">{t.calculator.recSystem}</span>
                    <strong className="result-metric__value">{capacity} KW</strong>
                  </div>
                </div>

                {/* Subsidy */}
                <div className="result-metric result-metric--subsidy">
                  <span className="result-metric__icon">🏛️</span>
                  <div className="result-metric__meta">
                    <span className="result-metric__label">{t.calculator.subsidyEst}</span>
                    <strong className="result-metric__value">{formatCurrency(subsidy)}</strong>
                  </div>
                </div>

                {/* Monthly Savings */}
                <div className="result-metric">
                  <span className="result-metric__icon">💰</span>
                  <div className="result-metric__meta">
                    <span className="result-metric__label">{t.calculator.monthlySave}</span>
                    <strong className="result-metric__value text-green">{formatCurrency(monthlySavings)} / mo</strong>
                  </div>
                </div>

                {/* 25-Year Savings */}
                <div className="result-metric">
                  <span className="result-metric__icon">📈</span>
                  <div className="result-metric__meta">
                    <span className="result-metric__label">{t.calculator.annualSave}</span>
                    <strong className="result-metric__value text-gold">{formatCurrency(lifetimeSavings)}</strong>
                  </div>
                </div>

                {/* Roof Area */}
                <div className="result-metric">
                  <span className="result-metric__icon">🏠</span>
                  <div className="result-metric__meta">
                    <span className="result-metric__label">{t.calculator.roofArea}</span>
                    <strong className="result-metric__value">~{roofArea} {t.calculator.sqFt}</strong>
                  </div>
                </div>

                {/* Payback */}
                <div className="result-metric">
                  <span className="result-metric__icon">⏱️</span>
                  <div className="result-metric__meta">
                    <span className="result-metric__label">{t.calculator.payback}</span>
                    <strong className="result-metric__value">~{paybackYears} {t.calculator.years}</strong>
                  </div>
                </div>

              </div>

              {/* WhatsApp Action */}
              <a
                href={`https://wa.me/917001516219?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="calculator__cta"
                id="calculator-whatsapp-btn"
              >
                <span className="calculator__cta-shimmer"></span>
                <span>{t.calculator.ctaBtn}</span>
              </a>

              <p className="calculator__disclaimer">
                {t.calculator.disclaimer}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
