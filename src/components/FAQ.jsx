import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './FAQ.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20have%20a%20question%20regarding%20rooftop%20solar%20in%20Malda.';

export default function FAQ() {
  const { t } = useLanguage();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const toggleItem = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div ref={ref} className={`faq__inner reveal ${isVisible ? 'reveal--visible' : ''}`}>
          
          <div className="faq__header">
            <span className="section-label">{t.faq.badge}</span>
            <h2 className="section-title">{t.faq.title}</h2>
            <p className="section-subtitle">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="faq__list">
            {t.faq.items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                  key={i}
                >
                  <button
                    type="button"
                    className="faq-item__question"
                    onClick={() => toggleItem(i)}
                    aria-expanded={isOpen}
                    id={`faq-btn-${i}`}
                  >
                    <span className="faq-item__q-text">{item.q}</span>
                    <span className="faq-item__toggle-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div className="faq-item__answer" id={`faq-ans-${i}`}>
                    <div className="faq-item__answer-inner">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Still have questions */}
          <div className="faq__footer">
            <p className="faq__footer-prompt">{t.faq.stillHaveQuestions}</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="faq__whatsapp-btn"
              id="faq-whatsapp-btn"
            >
              <span className="faq__btn-shimmer"></span>
              <span>{t.faq.askWhatsApp}</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
