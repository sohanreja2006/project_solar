import { useState, useEffect, useRef } from 'react';
import { checkPincodeLookup } from './PincodeChecker';
import './DealerContact.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda.';

export default function DealerContact() {
  const sectionRef = useRef(null);
  const nameInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    pincode: '',
    block: '',
    area: '',
    bill: '',
    capacity: '2 KW (Recommended)',
  });
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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

  // Listen for pincode selection from PincodeChecker component
  useEffect(() => {
    const handlePincodeEvent = (e) => {
      const { pincode, area, block } = e.detail || {};
      if (pincode) {
        setForm((prev) => ({
          ...prev,
          pincode,
          block: block || prev.block,
          area: area || prev.area,
        }));
        const status = checkPincodeLookup(pincode);
        setPincodeStatus(status);
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 400);
      }
    };

    window.addEventListener('solar:select-pincode', handlePincodeEvent);
    return () => window.removeEventListener('solar:select-pincode', handlePincodeEvent);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextVal = value;
    if (name === 'pincode') {
      nextVal = value.replace(/\D/g, '').slice(0, 6);
      if (nextVal.length === 6) {
        const status = checkPincodeLookup(nextVal);
        setPincodeStatus(status);
        if (status && status.block && !form.block) {
          setForm((prev) => ({ ...prev, pincode: nextVal, block: status.block, area: prev.area || status.area }));
          return;
        }
      } else {
        setPincodeStatus(null);
      }
    }
    setForm((prev) => ({ ...prev, [name]: nextVal }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, mobile, pincode, block, area, bill, capacity } = form;
    const pinNote = pincodeStatus?.type === 'available'
      ? ` (Service Verified - ${pincodeStatus.area})`
      : '';

    const msg = `*New Rooftop Solar Enquiry - Malda*%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Mobile:* ${encodeURIComponent(mobile)}%0A` +
      `*PIN Code:* ${encodeURIComponent(pincode)}${encodeURIComponent(pinNote)}%0A` +
      `*Block:* ${encodeURIComponent(block || 'Malda')}%0A` +
      `*Area/Village:* ${encodeURIComponent(area || 'Malda')}%0A` +
      `*Approx Monthly Bill:* ${encodeURIComponent(bill || 'Not specified')}%0A` +
      `*Preferred Capacity:* ${encodeURIComponent(capacity)}`;

    window.open(`https://wa.me/917001516219?text=${msg}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__inner stagger-children" ref={sectionRef}>
          {/* Left: Info */}
          <div className="contact__info">
            <span className="eyebrow">Local Distribution</span>
            <h2 className="section-title contact__title">
              Solar Is Now Closer To Home.
            </h2>
            <p className="section-subtitle contact__desc">
              Connect directly with Trimurti Solar Systems, official LOOM Solar SR Distributor for Malda district. We assist you through site evaluation, subsidy paperwork, and turnkey installation.
            </p>

            {/* Official Channel Card */}
            <div className="contact__distributor-card">
              <div className="contact__card-logos">
                <img
                  src="/images/sr-logo.png"
                  alt="Trimurti Solar Systems"
                  className="contact__sr-img"
                />
              </div>
              <div className="contact__card-details">
                <span className="contact__card-tag">Official Channel Partner</span>
                <h4 className="contact__card-name">Trimurti Solar Systems</h4>
                <p className="contact__card-sub">SR Distributor &bull; Malda, West Bengal</p>
                <div className="contact__card-badges">
                  <span>&#10003; 1 kW – 10 KW Residential</span>
                  <span>&#10003; WBSEDCL Net-Metering</span>
                  <span>&#10003; Doorstep Site Survey</span>
                </div>
              </div>
            </div>

            {/* Direct Phone Box */}
            <div className="contact__phone-box">
              <div className="contact__phone-header">
                <span className="contact__phone-icon" aria-hidden="true">&#9742;</span>
                <div>
                  <div className="contact__phone-label">Direct Helpline &bull; Malda</div>
                  <a href="tel:+917001516219" className="contact__phone-num">
                    +91 70015 16219
                  </a>
                </div>
              </div>
              <p className="contact__phone-sub">
                Speak directly with our local solar advisor (Mon–Sat, 9:00 AM – 7:00 PM).
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp contact__wa-btn"
                id="contact-whatsapp-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Advisor Now
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact__form-wrap">
            {submitted ? (
              <div className="contact__success">
                <div className="contact__success-icon">&#10003;</div>
                <h3 className="contact__success-title">Callback Request Sent</h3>
                <p className="contact__success-desc">
                  We've initiated WhatsApp with your information. Our Malda representative will verify your site details and connect with you shortly.
                </p>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Query
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} id="contact-form">
                <h3 className="contact__form-heading">Request a Solar Callback</h3>
                <p className="contact__form-subhead">
                  Fill in your details for a personalized capacity estimate and feasibility check.
                </p>

                <div className="contact__form-group">
                  <label htmlFor="name" className="contact__form-label">Full Name *</label>
                  <input
                    id="name"
                    ref={nameInputRef}
                    name="name"
                    type="text"
                    className="contact__form-input"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact__form-row">
                  <div className="contact__form-group">
                    <label htmlFor="mobile" className="contact__form-label">Mobile Number *</label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      className="contact__form-input"
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="contact__form-group">
                    <label htmlFor="pincode" className="contact__form-label">PIN Code *</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      className="contact__form-input"
                      placeholder="e.g. 732101"
                      value={form.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                {/* Inline Pincode Validation Feedback */}
                {pincodeStatus && (
                  <div className={`contact__pin-feedback contact__pin-feedback--${pincodeStatus.type}`}>
                    {pincodeStatus.type === 'available' && (
                      <span>&#10003; <strong>{pincodeStatus.area}</strong> ({pincodeStatus.block}) &bull; Active Coverage Zone</span>
                    )}
                    {pincodeStatus.type === 'malda-district' && (
                      <span>&#9888; Malda District &bull; Coverage Confirmed on Review</span>
                    )}
                    {pincodeStatus.type === 'nearby' && (
                      <span>&#8505; Neighboring District &bull; Regional Coordination Available</span>
                    )}
                    {pincodeStatus.type === 'outside' && (
                      <span>Outside Primary Malda Zone</span>
                    )}
                  </div>
                )}

                <div className="contact__form-row">
                  <div className="contact__form-group">
                    <label htmlFor="block" className="contact__form-label">Block in Malda</label>
                    <input
                      id="block"
                      name="block"
                      type="text"
                      className="contact__form-input"
                      placeholder="e.g. English Bazar, Gazole..."
                      value={form.block}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact__form-group">
                    <label htmlFor="area" className="contact__form-label">Village / Locality</label>
                    <input
                      id="area"
                      name="area"
                      type="text"
                      className="contact__form-input"
                      placeholder="e.g. Rathbari, Sujapur..."
                      value={form.area}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact__form-row">
                  <div className="contact__form-group">
                    <label htmlFor="bill" className="contact__form-label">Approx Monthly Bill</label>
                    <input
                      id="bill"
                      name="bill"
                      type="text"
                      className="contact__form-input"
                      placeholder="e.g. ₹1,200 – ₹2,500"
                      value={form.bill}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact__form-group">
                    <label htmlFor="capacity" className="contact__form-label">System Preference</label>
                    <select
                      id="capacity"
                      name="capacity"
                      className="contact__form-input contact__form-select"
                      value={form.capacity}
                      onChange={handleChange}
                    >
                      <option value="1 KW (Starter)">1 KW (Starter)</option>
                      <option value="2 KW (Recommended)">2 KW (Recommended)</option>
                      <option value="3 KW (Large Home)">3 KW (Large Home)</option>
                      <option value="5 KW (Premium Home)">5 KW (Premium Home)</option>
                      <option value="10 KW (High Capacity)">10 KW (High Capacity)</option>
                      <option value="Not Sure - Suggest Best">Not Sure - Suggest Best</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary contact__submit" id="contact-submit-btn">
                  Request Solar Callback on WhatsApp
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                <p className="contact__form-note">
                  Submitting will securely format your details into WhatsApp for instant response from our Malda representative. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
