import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__top">
          {/* Brand with Logos */}
          <div className="footer__brand">
            <div className="footer__brand-logos">
              <img
                src="/images/sr-logo.png"
                alt="Trimurti Solar Systems Logo"
                className="footer__sr-logo"
              />
            </div>
            <div className="footer__brand-name">Trimurti Solar Systems</div>
            <div className="footer__brand-sub">Official SR Distributor &bull; Malda, West Bengal</div>
            <p className="footer__brand-desc">
              Providing certified residential rooftop solar systems (1 kW to 10 kW) with WBSEDCL net-metering facilitation and PM Surya Ghar subsidy assistance across Malda district.
            </p>
          </div>

          {/* Links */}
          <div className="footer__nav-group">
            <h4 className="footer__nav-title">Quick Navigation</h4>
            <div className="footer__links">
              <button className="footer__link" onClick={() => scrollTo('#why-solar')}>Why Solar</button>
              <button className="footer__link" onClick={() => scrollTo('#systems')}>Solar Systems (1–10 kW)</button>
              <button className="footer__link" onClick={() => scrollTo('#subsidy')}>Subsidy & EMI Details</button>
              <button className="footer__link" onClick={() => scrollTo('#warranty')}>25-Year Warranty</button>
              <button className="footer__link" onClick={() => scrollTo('#how-it-works')}>4-Step Process</button>
              <button className="footer__link" onClick={() => scrollTo('#apply')}>Apply Online</button>
              <button className="footer__link" onClick={() => scrollTo('#distributor')}>Distributor Profile</button>
              <button className="footer__link" onClick={() => scrollTo('#contact')}>Request Callback</button>
            </div>
          </div>

          {/* Contact & Helpline */}
          <div className="footer__contact">
            <h4 className="footer__nav-title">Malda Channel Helpline</h4>
            <div className="footer__contact-box">
              <div className="footer__contact-label">Call / WhatsApp</div>
              <a href="tel:+917001516219" className="footer__contact-num">+91 70015 16219</a>
              <p className="footer__contact-sub">
                Mon – Sat: 9:00 AM – 7:00 PM<br />
                Malda District, West Bengal
              </p>
              <a
                href="https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp footer__wa-btn"
              >
                WhatsApp Advisor
              </a>
            </div>
          </div>
        </div>

        {/* Regulatory & Subsidy Disclaimer */}
        <div className="footer__disclaimer">
          <p>
            <strong>Official Disclaimer:</strong> Government subsidies under PM Surya Ghar Muft Bijli Yojana, net-metering synchronization with WBSEDCL (West Bengal State Electricity Distribution Company Limited), return-on-investment, and financing approval are subject to central/state government regulations, consumer category, technical rooftop feasibility, and respective authority guidelines. Product warranty and performance guarantees are governed by official manufacturer terms.
          </p>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <p className="footer__copyright">
              &copy; {currentYear} Copyright goes to <strong>@MD SAMAYUN REJA . SR DISTRIBUTORS</strong>.
            </p>
            <p className="footer__bottom-sub">Authorized SR Channel Partner for Malda District, West Bengal.</p>
          </div>
          <div className="footer__bottom-right">
            <p className="footer__developer-credit">
              Created And Developed By <strong>@ Ahammed Sohan Reja</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
