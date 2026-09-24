import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './DealerContact.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda.';

const MALDA_PINCODES = {
  '732101': 'English Bazar / Malda Town',
  '732102': 'Mokdumpur',
  '732103': 'Mangalbari',
  '732121': 'Golapganj',
  '732122': 'Habibpur / Bulbulchandi',
  '732123': 'Chanchal',
  '732124': 'Gazole',
  '732125': 'Harishchandrapur',
  '732126': 'Manikchak',
  '732128': 'Old Malda',
  '732138': 'Bhaluka',
  '732139': 'Samsi',
  '732140': 'Tulshihatta',
  '732141': 'Kushida',
  '732142': 'Baisnabnagar',
  '732143': 'Mathurapur',
  '732201': 'Kaliachak',
  '732202': 'Manikchak',
  '732203': 'Mothabari',
  '732205': 'Ratua',
  '732206': 'Sujapur',
  '732207': 'Mozampur',
  '732208': 'Jalalpur',
  '732209': 'Bedrabad',
  '732210': 'Baishnabnagar',
  '732216': 'Panchanandapur',
  '733124': 'Malda Border (Gazole Area)',
};

const checkMaldaPincode = (pin, t) => {
  const clean = (pin || '').trim();
  if (!clean) return null;
  if (!/^\d{6}$/.test(clean)) {
    return { status: 'invalid', message: t.contact.invalidPin };
  }
  // Malda district check: starts with 732 or 733124
  if (clean.startsWith('732') || clean === '733124') {
    const area = MALDA_PINCODES[clean];
    return {
      status: 'available',
      area: area || 'Malda District, West Bengal',
      pincode: clean,
      message: t.contact.congratsTitle(area, clean),
      subtext: t.contact.congratsSubtext,
    };
  }
  return {
    status: 'unavailable',
    pincode: clean,
    message: t.contact.outsideTitle(clean),
    subtext: t.contact.outsideSubtext,
  };
};

export default function DealerContact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '', mobile: '', pincode: '', block: '', village: '', bill: '', capacity: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [infoRef, infoVisible] = useScrollReveal();
  const [formRef, formVisible] = useScrollReveal();

  // Standalone pincode checker state
  const [checkerPin, setCheckerPin] = useState('');
  const [checkerResult, setCheckerResult] = useState(null);

  const handleCheckerChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCheckerPin(val);
    if (val.length === 6) {
      const res = checkMaldaPincode(val, t);
      setCheckerResult(res);
      // Auto-sync into form if empty
      if (!form.pincode) {
        setForm(f => ({ ...f, pincode: val }));
      }
    } else if (val.length === 0) {
      setCheckerResult(null);
    }
  };

  const handleCheckerSubmit = (e) => {
    e.preventDefault();
    const res = checkMaldaPincode(checkerPin, t);
    setCheckerResult(res);
    if (res?.status === 'available') {
      setForm(f => ({ ...f, pincode: checkerPin }));
    }
  };

  const handleChipClick = (pin) => {
    setCheckerPin(pin);
    const res = checkMaldaPincode(pin, t);
    setCheckerResult(res);
    setForm(f => ({ ...f, pincode: pin }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = `${t.contact.nameLabel} is required`;
    if (!form.mobile.trim()) errs.mobile = `${t.contact.mobileLabel} is required`;
    else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.pincode.trim()) errs.pincode = `${t.contact.pincodeLabel} is required`;
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = 'Enter a valid 6-digit PIN code';
    if (!form.block.trim()) errs.block = `${t.contact.blockLabel} is required`;
    if (!form.village.trim()) errs.village = `${t.contact.villageLabel} is required`;
    if (!form.bill.trim()) errs.bill = `${t.contact.billLabel} is required`;
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const pinCheck = checkMaldaPincode(form.pincode, t);
    const pinStatusText = pinCheck?.status === 'available' ? ' (Malda Service Zone - Available)' : ' (Outside Malda - Please contact different distributor)';

    const msg = encodeURIComponent(
      `New Solar Enquiry from Malda:\n` +
      `Name: ${form.name}\n` +
      `Mobile: ${form.mobile}\n` +
      `PIN Code: ${form.pincode}${pinStatusText}\n` +
      `Block: ${form.block}\n` +
      `Village/Area: ${form.village}\n` +
      `Approx Monthly Bill: ₹${form.bill}\n` +
      `Required Capacity: ${form.capacity || 'Not specified'}`
    );
    window.open(`https://wa.me/917001516219?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  const handleChange = (field) => (e) => {
    let val = e.target.value;
    if (field === 'pincode') {
      val = val.replace(/\D/g, '').slice(0, 6);
    }
    setForm({ ...form, [field]: val });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const formPincodeResult = form.pincode.length === 6 ? checkMaldaPincode(form.pincode, t) : null;

  return (
    <section className="dealer-contact" id="contact">
      <div className="dealer-contact__mesh" aria-hidden="true"></div>
      <div className="container">
        <div className="dealer-contact__inner">
          <div ref={infoRef} className={`dealer-contact__info reveal-left ${infoVisible ? 'reveal-left--visible' : ''}`}>
            <span className="section-label">{t.contact.badge}</span>
            <h2 className="section-title">{t.contact.title}</h2>
            <p className="dealer-contact__desc">
              {t.contact.desc}
            </p>

            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="dealer-contact__whatsapp-cta" id="dealer-whatsapp-btn">
              <span className="dealer-contact__wa-shimmer"></span>
              <span className="dealer-contact__wa-icon">📲</span>
              <div>
                <span className="dealer-contact__wa-label">{t.contact.waBtnLabel}</span>
                <span className="dealer-contact__wa-number">{t.contact.waNumber}</span>
              </div>
            </a>

            {/* Interactive Pincode Checker Card */}
            <div className="pincode-card" id="pincode-checker-box">
              <div className="pincode-card__header">
                <span className="pincode-card__icon">📍</span>
                <div>
                  <h4 className="pincode-card__title">{t.contact.pincodeCardTitle}</h4>
                  <p className="pincode-card__desc">{t.contact.pincodeCardDesc}</p>
                </div>
              </div>

              <form className="pincode-card__form" onSubmit={handleCheckerSubmit}>
                <div className="pincode-card__input-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={t.contact.pincodePlaceholder}
                    value={checkerPin}
                    onChange={handleCheckerChange}
                    className="pincode-card__input"
                    id="checker-pincode-input"
                  />
                  <button type="submit" className="pincode-card__btn" id="check-pincode-btn">
                    {t.contact.checkBtn}
                  </button>
                </div>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="pincode-card__chips">
                <span className="pincode-card__chips-label">{t.contact.popularLabel}</span>
                {[
                  { pin: '732101', name: 'English Bazar' },
                  { pin: '732124', name: 'Gazole' },
                  { pin: '732201', name: 'Kaliachak' },
                  { pin: '732123', name: 'Chanchal' },
                  { pin: '732206', name: 'Sujapur' },
                ].map(c => (
                  <button
                    key={c.pin}
                    type="button"
                    className={`pincode-chip ${checkerPin === c.pin ? 'pincode-chip--active' : ''}`}
                    onClick={() => handleChipClick(c.pin)}
                  >
                    {c.pin} ({c.name})
                  </button>
                ))}
              </div>

              {/* Result Notification */}
              {checkerResult && (
                <div className={`pincode-result pincode-result--${checkerResult.status}`}>
                  <div className="pincode-result__header">
                    <span className="pincode-result__badge-icon">
                      {checkerResult.status === 'available' ? '🎉' : checkerResult.status === 'invalid' ? '⚠️' : '⚠️'}
                    </span>
                    <strong className="pincode-result__message">{checkerResult.message}</strong>
                  </div>
                  {checkerResult.subtext && (
                    <p className="pincode-result__subtext">{checkerResult.subtext}</p>
                  )}
                  {checkerResult.status === 'available' && (
                    <div className="pincode-result__action">
                      <a
                        href="#contact-form"
                        className="pincode-result__cta"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('contact-name')?.focus();
                        }}
                      >
                        {t.contact.formCtaJump}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="dealer-contact__points">
              {t.contact.points.map((pt, i) => (
                <div className="dealer-contact__point" key={i}>
                  <span className="dealer-contact__point-check">✅</span> {pt}
                </div>
              ))}
            </div>
          </div>

          <div ref={formRef} className={`dealer-contact__form-wrap reveal-right ${formVisible ? 'reveal-right--visible' : ''}`} id="contact-form">
            {submitted ? (
              <div className="dealer-contact__success">
                <div className="dealer-contact__success-icon">✅</div>
                <h3>{t.contact.successTitle}</h3>
                <p>{t.contact.successDesc}</p>
              </div>
            ) : (
              <>
                <h3 className="dealer-contact__form-title">{t.contact.formTitle}</h3>
                <form className="dealer-contact__form" onSubmit={handleSubmit} noValidate>
                  <div className="form-field">
                    <label htmlFor="contact-name">{t.contact.nameLabel}</label>
                    <input id="contact-name" type="text" placeholder={t.contact.namePlaceholder} value={form.name} onChange={handleChange('name')} />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-mobile">{t.contact.mobileLabel}</label>
                      <input id="contact-mobile" type="tel" placeholder={t.contact.mobilePlaceholder} maxLength={10} value={form.mobile} onChange={handleChange('mobile')} />
                      {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-pincode">{t.contact.pincodeLabel}</label>
                      <input
                        id="contact-pincode"
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 732101"
                        maxLength={6}
                        value={form.pincode}
                        onChange={handleChange('pincode')}
                      />
                      {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                    </div>
                  </div>

                  {/* Dynamic in-form pincode feedback badge */}
                  {formPincodeResult && (
                    <div className={`form-pincode-badge form-pincode-badge--${formPincodeResult.status}`}>
                      <span className="form-pincode-badge__icon">
                        {formPincodeResult.status === 'available' ? '🎉' : '⚠️'}
                      </span>
                      <div>
                        <strong>{formPincodeResult.message}</strong>
                      </div>
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-block">{t.contact.blockLabel}</label>
                      <input id="contact-block" type="text" placeholder={t.contact.blockPlaceholder} value={form.block} onChange={handleChange('block')} />
                      {errors.block && <span className="form-error">{errors.block}</span>}
                    </div>
                    <div className="form-field">
                      <label htmlFor="contact-village">{t.contact.villageLabel}</label>
                      <input id="contact-village" type="text" placeholder={t.contact.villagePlaceholder} value={form.village} onChange={handleChange('village')} />
                      {errors.village && <span className="form-error">{errors.village}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-bill">{t.contact.billLabel}</label>
                      <input id="contact-bill" type="text" placeholder={t.contact.billPlaceholder} value={form.bill} onChange={handleChange('bill')} />
                      {errors.bill && <span className="form-error">{errors.bill}</span>}
                    </div>
                    <div className="form-field">
                      <label htmlFor="contact-capacity">{t.contact.capacityLabel}</label>
                      <select id="contact-capacity" value={form.capacity} onChange={handleChange('capacity')}>
                        <option value="">{t.contact.capacitySelect}</option>
                        <option value="1 KW">1 KW</option>
                        <option value="2 KW">2 KW</option>
                        <option value="3 KW">3 KW</option>
                        <option value="4 KW">4 KW</option>
                        <option value="5 KW">5 KW</option>
                        <option value="5+ KW">5+ KW</option>
                        <option value="Not sure">{t.contact.capacityNotSure}</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="form-submit" id="form-submit-btn">
                    <span className="form-submit__shimmer"></span>
                    {t.contact.submitBtn}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
