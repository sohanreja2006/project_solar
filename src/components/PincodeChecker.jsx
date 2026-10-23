import { useState, useEffect } from 'react';
import './PincodeChecker.css';

// Comprehensive Malda district pincodes (West Bengal)
const SERVICEABLE_PINCODES = {
  // English Bazar Block / Malda Town
  '732101': { area: 'English Bazar (Malda Town / Rathbari)', block: 'English Bazar', status: 'available' },
  '732102': { area: 'English Bazar (Jhaljhalia / Fulbari)', block: 'English Bazar', status: 'available' },
  '732103': { area: 'Malda Town (Station Area / Industrial)', block: 'English Bazar', status: 'available' },
  '732201': { area: 'Old Malda (Bachamari / Sahapur)', block: 'Old Malda', status: 'available' },

  // Manikchak Block
  '732202': { area: 'Manikchak / Mathurapur', block: 'Manikchak', status: 'available' },
  '732203': { area: 'Manikchak (Dharampur / Enayetpur)', block: 'Manikchak', status: 'available' },
  '732216': { area: 'Manikchak (Nurpur / Gopalpur)', block: 'Manikchak', status: 'available' },

  // Kaliachak Blocks (I, II, III)
  '732205': { area: 'Kaliachak (Kaliachak I / Alipur)', block: 'Kaliachak I', status: 'available' },
  '732206': { area: 'Kaliachak / Sujapur (Silampur)', block: 'Kaliachak I', status: 'available' },
  '732207': { area: 'Kaliachak (Baishnabnagar / Dariapur)', block: 'Kaliachak III', status: 'available' },
  '732211': { area: 'Kaliachak / Mothabari', block: 'Kaliachak II', status: 'available' },
  '732212': { area: 'Kaliachak / Golapganj', block: 'Kaliachak III', status: 'available' },

  // Chanchal Blocks (I, II)
  '732123': { area: 'Chanchal (Chanchal I / Malatipur)', block: 'Chanchal I', status: 'available' },
  '732125': { area: 'Chanchal (Chanchal II / Bhado)', block: 'Chanchal II', status: 'available' },

  // Ratua Blocks (I, II)
  '732138': { area: 'Ratua / Samsi (Kahala)', block: 'Ratua I', status: 'available' },
  '732139': { area: 'Ratua (Ratua II / Pukhuria)', block: 'Ratua II', status: 'available' },
  '732140': { area: 'Ratua / Debipur', block: 'Ratua I', status: 'available' },

  // Harischandrapur Blocks (I, II)
  '732128': { area: 'Harischandrapur (Bhingole)', block: 'Harischandrapur I', status: 'available' },
  '732130': { area: 'Harischandrapur (Tulshihata / Kushida)', block: 'Harischandrapur II', status: 'available' },

  // Gazole Block
  '732124': { area: 'Gazole (Gazole Town / Pandua)', block: 'Gazole', status: 'available' },
  '732127': { area: 'Gazole (Bairgachhi / Rural)', block: 'Gazole', status: 'available' },

  // Bamangola Block
  '732126': { area: 'Bamangola (Pakuahat / Gobindapur)', block: 'Bamangola', status: 'available' },

  // Habibpur Block
  '732141': { area: 'Habibpur (Bulbulchandi)', block: 'Habibpur', status: 'available' },
  '732142': { area: 'Habibpur (Aiho / Kendpukhur)', block: 'Habibpur', status: 'available' },

  // Malda Rural & Periphery
  '732204': { area: 'Milki / Kotwali (English Bazar Rural)', block: 'English Bazar', status: 'available' },
  '732208': { area: 'Manikchak Rural', block: 'Manikchak', status: 'available' },
  '732209': { area: 'English Bazar Rural / Sovanagar', block: 'English Bazar', status: 'available' },
  '732210': { area: 'Mahadipur / Border Area', block: 'English Bazar', status: 'available' },
  '732213': { area: 'Manikchak / Bhutni', block: 'Manikchak', status: 'available' },
  '732214': { area: 'Manikchak South', block: 'Manikchak', status: 'available' },
  '732215': { area: 'Bedrabad / Kaliachak', block: 'Kaliachak II', status: 'available' },
};

// Popular chips for 1-click checking
const POPULAR_CHIPS = [
  { pin: '732101', label: 'English Bazar' },
  { pin: '732206', label: 'Sujapur' },
  { pin: '732124', label: 'Gazole' },
  { pin: '732201', label: 'Old Malda' },
  { pin: '732205', label: 'Kaliachak' },
  { pin: '732123', label: 'Chanchal' },
  { pin: '732203', label: 'Manikchak' },
  { pin: '732138', label: 'Samsi / Ratua' },
];

export function checkPincodeLookup(pincode) {
  if (!pincode || pincode.length !== 6) return null;

  if (SERVICEABLE_PINCODES[pincode]) {
    return {
      type: 'available',
      pincode,
      ...SERVICEABLE_PINCODES[pincode],
    };
  }

  // Any pincode in Malda district range (732xxx)
  if (pincode.startsWith('732')) {
    return {
      type: 'malda-district',
      pincode,
      area: 'Malda District Service Zone',
      block: 'Malda District',
    };
  }

  // Neighboring districts in North Bengal / Bengal (731: Birbhum, 733: Uttar/Dakshin Dinajpur, 742: Murshidabad)
  if (['731', '733', '742', '813', '816'].some((pre) => pincode.startsWith(pre))) {
    return {
      type: 'nearby',
      pincode,
      area: 'Neighboring District',
      block: 'Regional Partner Zone',
    };
  }

  return {
    type: 'outside',
    pincode,
  };
}

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCheck = (code) => {
    if (code.length !== 6 || !/^\d{6}$/.test(code)) return;
    setLoading(true);
    setTimeout(() => {
      const res = checkPincodeLookup(code);
      setResult(res);
      setLoading(false);
    }, 280);
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      runCheck(val);
    } else {
      setResult(null);
    }
  };

  const handleChipClick = (code) => {
    setPincode(code);
    runCheck(code);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      runCheck(pincode);
    }
  };

  const handleFillContactForm = () => {
    // Dispatch custom event to notify DealerContact form
    window.dispatchEvent(
      new CustomEvent('solar:select-pincode', {
        detail: {
          pincode,
          area: result?.area || '',
          block: result?.block || '',
        },
      })
    );
    // Smooth scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const waLink = result?.type === 'available'
    ? `https://wa.me/917001516219?text=${encodeURIComponent(
        `Hi, I checked PIN code ${result.pincode} (${result.area}, ${result.block}) on your website. I want to check solar rooftop feasibility and book a site visit.`
      )}`
    : `https://wa.me/917001516219?text=${encodeURIComponent(
        `Hi, I want to check solar installation feasibility for PIN code ${pincode} in Malda district.`
      )}`;

  return (
    <section className="pincode-section" id="service-check">
      <div className="container">
        <div className="pincode-card-wrapper">
          {/* Header */}
          <div className="pincode-card__header">
            <span className="eyebrow">Service Coverage</span>
            <h2 className="pincode-card__title">
              Check Solar Availability in Your Area
            </h2>
            <p className="pincode-card__subtitle">
              We provide doorstep rooftop surveys, WBSEDCL net-metering assistance, and authorized LOOM Solar installation across Malda District.
            </p>
          </div>

          {/* Quick chips */}
          <div className="pincode-chips" aria-label="Quick select popular Malda areas">
            <span className="pincode-chips__label">Popular Areas:</span>
            <div className="pincode-chips__list">
              {POPULAR_CHIPS.map((chip) => (
                <button
                  key={chip.pin}
                  type="button"
                  className={`pincode-chip ${pincode === chip.pin ? 'pincode-chip--active' : ''}`}
                  onClick={() => handleChipClick(chip.pin)}
                >
                  <span className="pincode-chip__name">{chip.label}</span>
                  <span className="pincode-chip__code">{chip.pin}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form className="pincode-search-form" onSubmit={handleFormSubmit}>
            <div className="pincode-input-box">
              <span className="pincode-input-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <input
                type="text"
                className="pincode-input"
                placeholder="Enter 6-digit Malda PIN Code (e.g. 732101)"
                value={pincode}
                onChange={handleInputChange}
                maxLength={6}
                inputMode="numeric"
                id="pincode-service-input"
                aria-label="Enter 6-digit Malda PIN code"
              />
              <button
                type="submit"
                className="btn-primary pincode-submit-btn"
                disabled={pincode.length !== 6 || loading}
                id="pincode-check-action-btn"
              >
                {loading ? (
                  <span className="pincode-spinner" aria-label="Checking"></span>
                ) : (
                  <>
                    <span>Check Service</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {result && (
            <div className={`pincode-result-card pincode-result-card--${result.type}`}>
              {result.type === 'available' && (
                <div className="pincode-result-inner">
                  <div className="pincode-status-badge pincode-status-badge--success">
                    <span className="pincode-badge-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>Service Confirmed &bull; Active Coverage Zone</span>
                  </div>

                  <h3 className="pincode-result-heading">
                    We Serve {result.area}
                  </h3>
                  <p className="pincode-result-text">
                    Rooftop solar consultation, technical load assessment, and certified LOOM Solar installations are actively available in <strong>{result.block}</strong> (PIN: {result.pincode}).
                  </p>

                  <div className="pincode-perks">
                    <div className="pincode-perk">
                      <span className="pincode-perk-check">&#10003;</span>
                      <span>Free Technical Site Feasibility Survey</span>
                    </div>
                    <div className="pincode-perk">
                      <span className="pincode-perk-check">&#10003;</span>
                      <span>PM Surya Ghar Subsidy Paperwork Assistance</span>
                    </div>
                    <div className="pincode-perk">
                      <span className="pincode-perk-check">&#10003;</span>
                      <span>WBSEDCL Net-Metering Guidance in Malda</span>
                    </div>
                    <div className="pincode-perk">
                      <span className="pincode-perk-check">&#10003;</span>
                      <span>Official LOOM Solar 25-Year Performance Warranty</span>
                    </div>
                  </div>

                  <div className="pincode-result-actions">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp pincode-wa-action"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Book Free Site Survey on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      className="btn-outline pincode-callback-action"
                      onClick={handleFillContactForm}
                    >
                      Fill Callback Request Form
                    </button>
                  </div>
                </div>
              )}

              {result.type === 'malda-district' && (
                <div className="pincode-result-inner">
                  <div className="pincode-status-badge pincode-status-badge--gold">
                    <span className="pincode-badge-icon">&#9888;</span>
                    <span>Malda District Zone &bull; Verification Available</span>
                  </div>
                  <h3 className="pincode-result-heading">
                    PIN Code {result.pincode} is in Malda District
                  </h3>
                  <p className="pincode-result-text">
                    We cover all blocks across Malda. Connect with our local distribution team to confirm site survey availability and technician scheduling for your exact locality.
                  </p>
                  <div className="pincode-result-actions">
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp pincode-wa-action">
                      Check Availability via WhatsApp
                    </a>
                    <button type="button" className="btn-outline pincode-callback-action" onClick={handleFillContactForm}>
                      Request Callback
                    </button>
                  </div>
                </div>
              )}

              {result.type === 'nearby' && (
                <div className="pincode-result-inner">
                  <div className="pincode-status-badge pincode-status-badge--neutral">
                    <span>Neighboring District</span>
                  </div>
                  <h3 className="pincode-result-heading">
                    Regional Partner Support
                  </h3>
                  <p className="pincode-result-text">
                    PIN code {result.pincode} is in a neighboring district. Depending on distance and system capacity, our team or an authorized partner may assist you.
                  </p>
                  <div className="pincode-result-actions">
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp pincode-wa-action">
                      Inquire on WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {result.type === 'outside' && (
                <div className="pincode-result-inner">
                  <div className="pincode-status-badge pincode-status-badge--muted">
                    <span>Outside Malda Zone</span>
                  </div>
                  <h3 className="pincode-result-heading">
                    Outside Primary Malda Zone
                  </h3>
                  <p className="pincode-result-text">
                    PIN code {result.pincode} is outside our direct Malda installation cluster. Please contact LOOM Solar national support or our representative for guidance on your nearest distributor.
                  </p>
                  <div className="pincode-result-actions">
                    <a
                      href="tel:+917001516219"
                      className="btn-outline"
                    >
                      Call Helpline: 7001516219
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
