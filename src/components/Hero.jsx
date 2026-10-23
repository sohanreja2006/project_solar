import './Hero.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda.';

export default function Hero() {
  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      {/* Background image */}
      <div className="hero__bg">
        <img
          src="/images/hero.jpg"
          alt="Modern residential rooftop with high-efficiency solar panels"
          className="hero__bg-img"
        />
        <div className="hero__overlay"></div>
      </div>

      {/* Content */}
      <div className="hero__content container">
        <div className="hero__text-col">
          <span className="hero__eyebrow">Residential Rooftop Solar Specialist</span>

          <h1 className="hero__title">
            Power Your Home<br />
            <em>With Clean Solar.</em>
          </h1>

          <p className="hero__brand-line">
            Trimurti Solar Systems brings genuine <strong>LOOM Solar</strong> high-efficiency monocrystalline and bi-facial rooftop systems to homes across Malda district.
          </p>

          <div className="hero__trust-pills">
            <span className="hero__trust-pill">&#10003; 1 kW – 10 KW Solutions</span>
            <span className="hero__trust-pill">&#10003; PM Surya Ghar Subsidy Support</span>
            <span className="hero__trust-pill">&#10003; WBSEDCL Net-Metering</span>
            <span className="hero__trust-pill">&#10003; 25-Year Performance Warranty</span>
          </div>

          <div className="hero__ctas">
            <button
              className="btn-primary hero__cta-primary"
              id="hero-apply-btn"
              onClick={() => scrollTo('#apply')}
            >
              Apply Online
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp hero__cta-wa"
              id="hero-whatsapp-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>

          <div className="hero__phone">
            <span className="hero__phone-label">Direct Malda Helpline</span>
            <a href="tel:+917001516219" className="hero__phone-number">+91 70015 16219</a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint">
        <div className="hero__scroll-mouse">
          <span></span>
        </div>
      </div>
    </section>
  );
}
