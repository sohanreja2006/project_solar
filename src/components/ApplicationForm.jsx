import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useUserAuth } from '../context/UserAuthContext';
import { DOCUMENT_TYPES, uploadApplicationDocument, compressImage } from '../lib/documentStorage';
import ApplicationPdfPreview from './ApplicationPdfPreview';
import { BLOCKS_LIST, getDealersForBlock, getGramPanchayatsForBlock } from '../data/dealers';
import './ApplicationForm.css';

const INITIAL = {
  date: '', salutation: 'Mr.', fullName: '', relation: 'S/O', relationName: '',
  village: '', postOffice: '', policeStation: '', district: 'Malda', pin: '',
  state: 'West Bengal', category: '', panchayat: '', subDivision: '', panNo: '',
  aadhaarNo: '', bankAcNo: '', ifsc: '', branchName: '', mobile: '', email: '',
  electricConsumerId: '', meterType: '', solarType: '', company: '',
  companyOther: '', kilowatt: '', kilowattOther: '',
  blockName: '', dealerName: '', dealerContact: '', dealerDesignation: '',
};

const METER_TYPES = ['Domestic Meter', 'Commercial Meter', 'Industrial Meter', 'Others'];
const SOLAR_TYPES = ['On-Grid System', 'Hybrid Solar', 'Off-Grid Solar System'];
const COMPANIES = ['Loom Solar', 'TATA Power Solar', 'ADANI Solar', 'Waaree Energies', 'Vikram Solar', 'Others'];
const KILOWATTS = ['1 KW', '2 KW', '3 KW', '4 KW', '5 KW', '6 KW', '7 KW', '8 KW', '9 KW', '10 KW', 'Others'];

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export default function ApplicationForm() {
  const { user } = useUserAuth();
  const [form, setForm] = useState(INITIAL);
  const [documents, setDocuments] = useState({});
  const [docPreviews, setDocPreviews] = useState({});
  const [docMeta, setDocMeta] = useState({});
  const [uploadStepMsg, setUploadStepMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscDetails, setIfscDetails] = useState(null);
  const [ifscError, setIfscError] = useState(null);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: f.fullName || user.fullName || '',
        mobile: f.mobile || user.mobile || '',
        email: f.email || user.email || '',
      }));
    }
  }, [user]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // Auto-fetch bank & branch details from RBI directory using free Razorpay IFSC API
  const fetchIfscDetails = async (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean.length !== 11) return;

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(clean)) {
      setIfscError('IFSC must be 11 characters (e.g. SBIN0000129)');
      setIfscDetails(null);
      return;
    }

    setIfscLoading(true);
    setIfscError(null);
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${clean}`);
      if (!res.ok) {
        throw new Error('IFSC code not found in RBI directory.');
      }
      const data = await res.json();
      const branchDisplay = data.BANK ? `${data.BANK} - ${data.BRANCH}` : data.BRANCH;
      setForm((f) => ({ ...f, branchName: branchDisplay }));
      setIfscDetails({
        bank: data.BANK,
        branch: data.BRANCH,
        city: data.CITY || data.DISTRICT || data.CENTRE || '',
        state: data.STATE || '',
      });
      setIfscError(null);
    } catch (err) {
      setIfscDetails(null);
      setIfscError(err.message || 'Unable to fetch branch. Please enter manually.');
    } finally {
      setIfscLoading(false);
    }
  };

  const handleIfscChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    setForm((f) => ({ ...f, ifsc: val }));
    if (val.length === 11) {
      fetchIfscDetails(val);
    } else {
      setIfscDetails(null);
      setIfscError(null);
    }
  };

  // Listen for selection from Block & GP directory
  useEffect(() => {
    const handleBlockGpSelect = (e) => {
      const { blockName, gramPanchayat } = e.detail || {};
      if (blockName) {
        const dealers = getDealersForBlock(blockName);
        setForm((f) => ({
          ...f,
          blockName,
          panchayat: gramPanchayat || f.panchayat,
          subDivision: f.subDivision || blockName,
          dealerName: dealers.length === 1 ? dealers[0].name : f.dealerName,
          dealerContact: dealers.length === 1 ? dealers[0].contact : f.dealerContact,
          dealerDesignation: dealers.length === 1 ? dealers[0].designation : f.dealerDesignation,
        }));
      }
    };
    window.addEventListener('solar:select-block-gp', handleBlockGpSelect);
    return () => window.removeEventListener('solar:select-block-gp', handleBlockGpSelect);
  }, []);

  const availableDealers = getDealersForBlock(form.blockName);
  const availableGps = getGramPanchayatsForBlock(form.blockName);

  const handleBlockChange = (e) => {
    const b = e.target.value;
    const dealers = getDealersForBlock(b);
    setForm((f) => ({
      ...f,
      blockName: b,
      panchayat: '',
      subDivision: f.subDivision || b,
      dealerName: dealers.length === 1 ? dealers[0].name : '',
      dealerContact: dealers.length === 1 ? dealers[0].contact : '',
      dealerDesignation: dealers.length === 1 ? dealers[0].designation : '',
    }));
  };

  const selectDealer = (dealer) => {
    setForm((f) => ({
      ...f,
      dealerName: dealer.name,
      dealerContact: dealer.contact,
      dealerDesignation: dealer.designation,
    }));
  };

  const handleFileChange = (docKey) => async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    if (rawFile.size > 20 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [docKey]: 'File size must be under 20MB' }));
      return;
    }

    // Live compression immediately when the user selects a file
    let file = rawFile;
    if (rawFile.type.startsWith('image/')) {
      try {
        file = await compressImage(rawFile);
      } catch (err) {
        console.warn('Compression fallback to original file:', err);
      }
    }

    setDocuments((prev) => ({ ...prev, [docKey]: file }));
    setDocMeta((prev) => ({
      ...prev,
      [docKey]: {
        originalSize: rawFile.size,
        compressedSize: file.size,
        savedPercent: rawFile.size > file.size ? Math.round(((rawFile.size - file.size) / rawFile.size) * 100) : 0,
      },
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });

    if (rawFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setDocPreviews((prev) => ({ ...prev, [docKey]: url }));
    } else {
      setDocPreviews((prev) => ({ ...prev, [docKey]: null }));
    }
  };

  const handleRemoveDoc = (docKey) => {
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
    setDocPreviews((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
    setDocMeta((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
  };

  const validate = () => {
    const err = {};
    if (!form.fullName.trim()) err.fullName = 'Name is required';
    if (!form.relationName.trim()) err.relationName = 'Guardian name is required';
    if (!form.village.trim()) err.village = 'Village is required';
    if (!form.blockName) err.blockName = 'Please select your Block in Malda';
    if (!form.dealerName) err.dealerName = 'Please choose your preferred dealer for this block';
    if (!form.pin || !/^\d{6}$/.test(form.pin)) err.pin = 'Valid 6-digit PIN required';
    if (!form.category) err.category = 'Select a category';
    if (!form.aadhaarNo || !/^\d{12}$/.test(form.aadhaarNo.replace(/\s/g, ''))) err.aadhaarNo = 'Valid 12-digit Aadhaar required';
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) err.mobile = 'Valid 10-digit mobile required';
    if (!form.meterType) err.meterType = 'Select meter type';
    if (!form.solarType) err.solarType = 'Select solar system type';
    if (!form.company) err.company = 'Select a company';
    if (!form.kilowatt) err.kilowatt = 'Select required kilowatt';

    // Validate required documents
    DOCUMENT_TYPES.forEach((doc) => {
      if (doc.required && !documents[doc.key]) {
        err[doc.key] = `${doc.label} is required`;
      }
    });

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      setTimeout(() => {
        const el = document.querySelector('.af-field--error, .af-doc-card--error');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    setErrors({});

    if (!user) {
      setSubmitError('You must be logged in to submit an application. Please sign in or register.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setSubmitError('Supabase is not configured yet. Please check your .env file.');
      return;
    }

    setIsSubmitting(true);
    setUploadStepMsg('Preparing documents...');

    try {
      // 1. Upload selected documents to Supabase Storage with automatic compression
      const uploadedUrls = {};
      const docEntries = Object.entries(documents);

      for (let i = 0; i < docEntries.length; i++) {
        const [key, file] = docEntries[i];
        const docDef = DOCUMENT_TYPES.find((d) => d.key === key);
        setUploadStepMsg(`Optimizing & uploading ${docDef?.label || key} (${i + 1} of ${docEntries.length})...`);
        try {
          const url = await uploadApplicationDocument(user?.id, key, file, (progressMsg) => {
            setUploadStepMsg(`${docDef?.label || key}: ${progressMsg}`);
          });
          if (url) {
            uploadedUrls[`${key}_url`] = url;
          }
        } catch (uploadErr) {
          console.warn(`Could not upload ${key}:`, uploadErr);
          // If storage bucket isn't created yet, continue gracefully so user is not blocked
        }
      }

      setUploadStepMsg('Saving application details to database...');

      const payload = {
        salutation: form.salutation,
        full_name: form.fullName.trim(),
        relation: form.relation,
        relation_name: form.relationName.trim(),
        village: form.village.trim(),
        post_office: form.postOffice.trim() || null,
        police_station: form.policeStation.trim() || null,
        district: form.district.trim(),
        pin: form.pin.trim(),
        state: form.state.trim(),
        category: form.category,
        panchayat: form.panchayat.trim() || null,
        sub_division: form.blockName ? `${form.blockName} (${form.dealerName || ''})` : (form.subDivision.trim() || null),
        pan_no: form.panNo.trim() ? form.panNo.trim().toUpperCase() : null,
        aadhaar_no: form.aadhaarNo.trim(),
        bank_ac_no: form.bankAcNo.trim() || null,
        ifsc: form.ifsc.trim() ? form.ifsc.trim().toUpperCase() : null,
        branch_name: form.branchName.trim() || null,
        mobile: form.mobile.trim(),
        email: form.email.trim() || null,
        electric_consumer_id: form.electricConsumerId.trim() || null,
        meter_type: form.meterType,
        solar_type: form.solarType,
        company: form.company === 'Others' ? (form.companyOther.trim() || 'Others') : form.company,
        company_other: form.company === 'Others' ? form.companyOther.trim() : null,
        kilowatt: form.kilowatt === 'Others' ? (form.kilowattOther.trim() || 'Others') : form.kilowatt,
        kilowatt_other: form.kilowatt === 'Others' ? form.kilowattOther.trim() : null,
        application_date: form.date || new Date().toISOString().split('T')[0],
        block_name: form.blockName || null,
        dealer_name: form.dealerName || null,
        dealer_contact: form.dealerContact || null,
        dealer_designation: form.dealerDesignation || null,
        user_id: user?.id || null,
        caste_cert_url: uploadedUrls.caste_cert_url || null,
        electricity_bill_url: uploadedUrls.electricity_bill_url || null,
        bank_passbook_url: uploadedUrls.bank_passbook_url || null,
        aadhaar_card_url: uploadedUrls.aadhaar_card_url || null,
        pan_card_url: uploadedUrls.pan_card_url || null,
        applicant_gps_photo_url: uploadedUrls.applicant_gps_photo_url || null,
        customer_sign_url: uploadedUrls.customer_sign_url || null,
      };

      let { error } = await supabase.from('solar_applications').insert([payload]);

      // If columns are not yet added in Supabase table, retry cleanly without them so user submission never fails
      if (error && error.message?.includes('column')) {
        const fallback = { ...payload };
        delete fallback.block_name;
        delete fallback.dealer_name;
        delete fallback.dealer_contact;
        delete fallback.dealer_designation;
        delete fallback.user_id;
        delete fallback.caste_cert_url;
        delete fallback.electricity_bill_url;
        delete fallback.bank_passbook_url;
        delete fallback.aadhaar_card_url;
        delete fallback.pan_card_url;
        delete fallback.applicant_gps_photo_url;
        delete fallback.customer_sign_url;
        const res = await supabase.from('solar_applications').insert([fallback]);
        error = res.error;
      }

      if (error) {
        throw error;
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Supabase submission error:', err);
      setSubmitError(err.message || 'Failed to submit application to database. Please check your connection.');
    } finally {
      setIsSubmitting(false);
      setUploadStepMsg('');
    }
  };

  const handleReset = () => {
    setForm(INITIAL);
    setDocuments({});
    setDocPreviews({});
    setDocMeta({});
    setUploadStepMsg('');
    setSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setShowPreview(false);
    setErrors({});
    setIfscLoading(false);
    setIfscDetails(null);
    setIfscError(null);
  };

  if (submitted) {
    return (
      <section className="application-form" id="apply">
        <div className="container">
          <div className="af-success">
            <div className="af-success__icon">✓</div>
            <h2 className="af-success__title">Application Submitted!</h2>
            <p className="af-success__msg">
              Thank you for applying under <strong>PM Surya Ghar Muft Bijli Yojana</strong>.<br />
              Your details have been saved to the database. You can now preview or download your official application PDF.
            </p>
            <div className="af-success__actions">
              <button
                type="button"
                className="btn-primary af-success__btn"
                onClick={() => setShowPreview(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Preview &amp; Download PDF
              </button>
              <button type="button" className="btn-outline" onClick={handleReset}>
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
        {showPreview && (
          <ApplicationPdfPreview form={form} onClose={() => setShowPreview(false)} />
        )}
      </section>
    );
  }

  const fi = (name) => ({ className: `af-input${errors[name] ? ' af-input--error' : ''}` });
  const fd = (name) => `af-field${errors[name] ? ' af-field--error' : ''}`;

  return (
    <section className="application-form" id="apply">
      <div className="container">
        <div className="af-header">
          <div className="af-header__logos">
            <img src="/images/nexis-logo.png" alt="NEXIS" className="af-header__logo" />
            <div className="af-header__org">
              <span className="af-header__company">Green Energy Infra Private Limited</span>
              <span className="af-header__scheme">PM Surya Ghar Muft Bijli Yojana — Govt. of India</span>
            </div>
            <img src="/images/tss-logo.jpeg" alt="TSS" className="af-header__logo" />
          </div>
          <div className="af-header__subtitle">
            <strong>Sub:- Prayer for Solar Plantation Under PM SGMBY Scheme</strong>
            <span>Fill in the form in English (Block Letters)</span>
          </div>
        </div>

        {!user ? (
          <div className="af-auth-gate">
            <div className="af-auth-gate__icon-box">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span className="af-auth-gate__badge">🔒 Applicant Login Required</span>
            <h3 className="af-auth-gate__title">Please Log In to Fill &amp; Submit Your Application</h3>
            <p className="af-auth-gate__desc">
              To ensure genuine applications and enable real-time tracking of your PM Surya Ghar installation status, please sign in or register before submitting your details.
            </p>
            <div className="af-auth-gate__actions">
              <Link to="/login" className="btn-primary af-auth-gate__btn">
                Sign In to Apply
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/signup" className="btn-outline af-auth-gate__btn">
                Create Account
              </Link>
            </div>
            <div className="af-auth-gate__features">
              <span>✓ Link your application automatically</span>
              <span>✓ Live updates from SR Distributor</span>
              <span>✓ Download official signed PDF anytime</span>
            </div>
          </div>
        ) : (
          <form className="af-form" onSubmit={handleSubmit} noValidate>
            <div className="af-user-banner">
              <div className="af-user-banner__left">
                <span className="af-user-banner__avatar">
                  {user.fullName ? user.fullName[0].toUpperCase() : (user.username ? user.username[0].toUpperCase() : 'U')}
                </span>
                <div>
                  <div className="af-user-banner__title">
                    Logged in as <strong>{user.fullName || user.username}</strong>
                    <span className="af-user-banner__badge">Verified Applicant</span>
                  </div>
                  <div className="af-user-banner__sub">
                    Username: @{user.username} {user.mobile && `• Mobile: ${user.mobile}`} • Application will be linked directly to your account
                  </div>
                </div>
              </div>
              <Link to="/dashboard" className="af-user-banner__link">
                View My Applications →
              </Link>
            </div>

          <div className="af-section">
            <h3 className="af-section__title">Personal Details</h3>
            <div className="af-grid af-grid--3">
              <div className="af-field">
                <label className="af-label">Salutation</label>
                <select className="af-input" value={form.salutation} onChange={set('salutation')}>
                  <option>Mr.</option><option>Miss.</option><option>Mrs.</option>
                </select>
              </div>
              <div className={`af-field af-field--span2 ${fd('fullName')}`}>
                <label className="af-label">Full Name *</label>
                <input {...fi('fullName')} type="text" placeholder="Full name in BLOCK letters" value={form.fullName} onChange={set('fullName')} />
                {errors.fullName && <span className="af-error">{errors.fullName}</span>}
              </div>
            </div>

            <div className="af-grid af-grid--3">
              <div className="af-field">
                <label className="af-label">Relation</label>
                <select className="af-input" value={form.relation} onChange={set('relation')}>
                  <option>S/O</option><option>D/O</option><option>W/O</option>
                </select>
              </div>
              <div className={`af-field af-field--span2 ${fd('relationName')}`}>
                <label className="af-label">Guardian / Father / Husband Name *</label>
                <input {...fi('relationName')} type="text" placeholder="Name in BLOCK letters" value={form.relationName} onChange={set('relationName')} />
                {errors.relationName && <span className="af-error">{errors.relationName}</span>}
              </div>
            </div>

            <div className="af-grid af-grid--2">
              <div className={fd('village')}>
                <label className="af-label">Village *</label>
                <input {...fi('village')} type="text" placeholder="Village name" value={form.village} onChange={set('village')} />
                {errors.village && <span className="af-error">{errors.village}</span>}
              </div>
              <div className="af-field">
                <label className="af-label">Post Office (P.O.)</label>
                <input className="af-input" type="text" placeholder="Post Office" value={form.postOffice} onChange={set('postOffice')} />
              </div>
              <div className="af-field">
                <label className="af-label">Police Station (P.S.)</label>
                <input className="af-input" type="text" placeholder="Police Station" value={form.policeStation} onChange={set('policeStation')} />
              </div>
              <div className="af-field">
                <label className="af-label">District</label>
                <input className="af-input" type="text" value={form.district} onChange={set('district')} />
              </div>
              <div className={fd('pin')}>
                <label className="af-label">PIN Code *</label>
                <input {...fi('pin')} type="text" maxLength={6} placeholder="6-digit PIN" value={form.pin} onChange={set('pin')} />
                {errors.pin && <span className="af-error">{errors.pin}</span>}
              </div>
              <div className="af-field">
                <label className="af-label">State</label>
                <input className="af-input" type="text" value={form.state} onChange={set('state')} />
              </div>
              <div className={fd('category')}>
                <label className="af-label">Category *</label>
                <div className="af-radio-group">
                  {['GEN', 'SC', 'ST'].map((c) => (
                    <label key={c} className="af-radio-label">
                      <input type="radio" name="category" value={c} checked={form.category === c} onChange={set('category')} />{c}
                    </label>
                  ))}
                </div>
                {errors.category && <span className="af-error">{errors.category}</span>}
              </div>
              <div className="af-field">
                <label className="af-label">Panchayat / Ward No. / Corporation</label>
                <input className="af-input" type="text" placeholder="Panchayat or Ward" value={form.panchayat} onChange={set('panchayat')} />
              </div>
              <div className="af-field">
                <label className="af-label">Sub Division</label>
                <input className="af-input" type="text" placeholder="Sub Division" value={form.subDivision} onChange={set('subDivision')} />
              </div>
              <div className="af-field">
                <label className="af-label">PAN No.</label>
                <input className="af-input" type="text" maxLength={10} placeholder="ABCDE1234F" value={form.panNo} onChange={set('panNo')} />
              </div>
            </div>
          </div>

          <div className="af-section af-section--dealer">
            <div className="af-dealer-sec-header">
              <div>
                <h3 className="af-section__title">🏢 Block &amp; Preferred Dealer Coordinator (Malda)</h3>
                <p className="af-dealer-sec-sub">
                  Select your block in Malda to choose your nearest Trimurti Solar Systems authorized coordinator / dealer.
                </p>
              </div>
              <div className="af-dealer-sec-badge">
                <span>HEAD OF MALDA: MD SAMAYUN REJA</span>
                <span className="af-dealer-sec-phone">📞 7001516219</span>
              </div>
            </div>

            <div className="af-grid af-grid--2">
              <div className={fd('blockName')}>
                <label className="af-label">Select Your Block in Malda *</label>
                <select
                  className={`af-input${errors.blockName ? ' af-input--error' : ''}`}
                  value={form.blockName}
                  onChange={handleBlockChange}
                >
                  <option value="">-- Choose Your Block --</option>
                  {BLOCKS_LIST.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {errors.blockName && <span className="af-error">{errors.blockName}</span>}
              </div>

              {form.blockName && (
                <div className="af-field">
                  <label className="af-label">
                    Select Gram Panchayat (G.P.) in <strong>{form.blockName}</strong>
                  </label>
                  <select
                    className="af-input"
                    value={form.panchayat}
                    onChange={(e) => setForm((f) => ({ ...f, panchayat: e.target.value }))}
                  >
                    <option value="">-- Choose Gram Panchayat --</option>
                    {availableGps.map((gp, idx) => (
                      <option key={gp} value={gp}>{idx + 1}. {gp}</option>
                    ))}
                  </select>
                </div>
              )}

              {form.blockName && (
                <div className="af-field af-field--span2">
                  <label className="af-label">
                    Available Authorized Dealers for <strong>{form.blockName}</strong> *
                  </label>
                  
                  <div className="af-dealers-cards-grid">
                    {availableDealers.map((d) => {
                      const isSelected = form.dealerName === d.name && form.dealerContact === d.contact;
                      return (
                        <div
                          key={`${d.name}-${d.contact}-${d.designation}`}
                          className={`af-dealer-pick-card ${isSelected ? 'af-dealer-pick-card--selected' : ''}`}
                          onClick={() => selectDealer(d)}
                        >
                          <div className="af-dealer-pick-radio">
                            <input
                              type="radio"
                              name="preferredDealerRadio"
                              checked={isSelected}
                              onChange={() => selectDealer(d)}
                            />
                          </div>
                          <div className="af-dealer-pick-content">
                            <div className="af-dealer-pick-header">
                              <strong className="af-dealer-pick-name">{d.name}</strong>
                              <span className="af-dealer-pick-badge">{d.designation}</span>
                            </div>
                            <div className="af-dealer-pick-meta">
                              <span className="af-dealer-pick-phone">📞 {d.contact}</span>
                              <span className="af-dealer-pick-block">Block: {d.block}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.dealerName && <span className="af-error">{errors.dealerName}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="af-section">
            <h3 className="af-section__title">Identity &amp; Bank Details</h3>
            <div className="af-grid af-grid--2">
              <div className={fd('aadhaarNo')}>
                <label className="af-label">Aadhaar No. *</label>
                <input {...fi('aadhaarNo')} type="text" maxLength={14} placeholder="XXXX XXXX XXXX" value={form.aadhaarNo} onChange={set('aadhaarNo')} />
                {errors.aadhaarNo && <span className="af-error">{errors.aadhaarNo}</span>}
              </div>
              <div className="af-field">
                <label className="af-label">Bank Account No.</label>
                <input className="af-input" type="text" placeholder="Account Number" value={form.bankAcNo} onChange={set('bankAcNo')} />
              </div>
              <div className="af-field">
                <div className="af-label-row">
                  <label className="af-label">IFSC Code</label>
                  {ifscLoading && <span className="af-ifsc-spinner">Fetching...</span>}
                </div>
                <input
                  className={`af-input af-input--uppercase ${ifscError ? 'af-input--error' : ''}`}
                  type="text"
                  maxLength={11}
                  placeholder="e.g. SBIN0000129"
                  value={form.ifsc}
                  onChange={handleIfscChange}
                  onBlur={() => {
                    if (form.ifsc && form.ifsc.length === 11 && !ifscDetails && !ifscLoading) {
                      fetchIfscDetails(form.ifsc);
                    }
                  }}
                />
                {ifscLoading && (
                  <span className="af-ifsc-status af-ifsc-status--loading">
                    🔄 Fetching bank &amp; branch details...
                  </span>
                )}
                {ifscError && (
                  <span className="af-ifsc-status af-ifsc-status--error">
                    ⚠️ {ifscError}
                  </span>
                )}
              </div>
              <div className="af-field">
                <div className="af-label-row">
                  <label className="af-label">Branch Name</label>
                  {ifscDetails && <span className="af-label-badge">Auto-filled</span>}
                </div>
                <input
                  className="af-input"
                  type="text"
                  placeholder="Bank Branch Name"
                  value={form.branchName}
                  onChange={set('branchName')}
                />
              </div>
            </div>
          </div>

          <div className="af-section">
            <h3 className="af-section__title">Contact Details</h3>
            <div className="af-grid af-grid--3">
              <div className={fd('mobile')}>
                <label className="af-label">Mobile No. *</label>
                <input {...fi('mobile')} type="tel" maxLength={10} placeholder="10-digit mobile" value={form.mobile} onChange={set('mobile')} />
                {errors.mobile && <span className="af-error">{errors.mobile}</span>}
              </div>
              <div className="af-field">
                <label className="af-label">Email ID</label>
                <input className="af-input" type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} />
              </div>
              <div className="af-field">
                <label className="af-label">Electric Consumer ID</label>
                <input className="af-input" type="text" placeholder="Consumer ID from bill" value={form.electricConsumerId} onChange={set('electricConsumerId')} />
              </div>
            </div>
          </div>

          <div className="af-section">
            <h3 className="af-section__title">Solar Requirements</h3>

            <div className={`af-field ${fd('meterType')}`}>
              <label className="af-label">Type of Meter *</label>
              <div className="af-radio-group af-radio-group--wrap">
                {METER_TYPES.map((m) => (
                  <label key={m} className="af-radio-label">
                    <input type="radio" name="meterType" value={m} checked={form.meterType === m} onChange={set('meterType')} />{m}
                  </label>
                ))}
              </div>
              {errors.meterType && <span className="af-error">{errors.meterType}</span>}
            </div>

            <div className={`af-field ${fd('solarType')}`}>
              <label className="af-label">Solar System Type *</label>
              <div className="af-radio-group af-radio-group--wrap">
                {SOLAR_TYPES.map((s) => (
                  <label key={s} className="af-radio-label">
                    <input type="radio" name="solarType" value={s} checked={form.solarType === s} onChange={set('solarType')} />{s}
                  </label>
                ))}
              </div>
              {errors.solarType && <span className="af-error">{errors.solarType}</span>}
            </div>

            <div className={`af-field ${fd('company')}`}>
              <label className="af-label">Choose Company *</label>
              <div className="af-radio-group af-radio-group--wrap">
                {COMPANIES.map((c) => (
                  <label key={c} className="af-radio-label">
                    <input type="radio" name="company" value={c} checked={form.company === c} onChange={set('company')} />{c}
                  </label>
                ))}
              </div>
              {form.company === 'Others' && (
                <input className="af-input af-input--inline" type="text" placeholder="Specify company" value={form.companyOther} onChange={set('companyOther')} />
              )}
              {errors.company && <span className="af-error">{errors.company}</span>}
            </div>

            <div className={`af-field ${fd('kilowatt')}`}>
              <label className="af-label">Required Kilowatts *</label>
              <div className="af-radio-group af-radio-group--wrap">
                {KILOWATTS.map((k) => (
                  <label key={k} className="af-radio-label">
                    <input type="radio" name="kilowatt" value={k} checked={form.kilowatt === k} onChange={set('kilowatt')} />{k}
                  </label>
                ))}
              </div>
              {form.kilowatt === 'Others' && (
                <input className="af-input af-input--inline" type="text" placeholder="Specify kilowatt" value={form.kilowattOther} onChange={set('kilowattOther')} />
              )}
              {errors.kilowatt && <span className="af-error">{errors.kilowatt}</span>}
            </div>
          </div>

          {/* Section: Document Upload */}
          <div className="af-section af-section--docs">
            <div className="af-section-header">
              <span className="af-section-header__num">6</span>
              <div>
                <h3 className="af-section-header__title">Required Documents Upload • প্রয়োজনীয় নথিপত্র</h3>
                <p className="af-section-header__sub">
                  Upload clear photos or PDFs (max 10MB each). Photos are automatically compressed on your device before upload to save bandwidth.
                </p>
              </div>
            </div>

            <div className="af-docs-grid">
              {DOCUMENT_TYPES.map((doc) => {
                const file = documents[doc.key];
                const preview = docPreviews[doc.key];
                const hasError = !!errors[doc.key];

                return (
                  <div
                    key={doc.key}
                    className={`af-doc-card ${file ? 'af-doc-card--uploaded' : ''} ${hasError ? 'af-doc-card--error' : ''}`}
                  >
                    <div className="af-doc-card__head">
                      <div className="af-doc-card__icon">{doc.icon}</div>
                      <div className="af-doc-card__meta">
                        <div className="af-doc-card__title-row">
                          <span className="af-doc-card__title">{doc.label}</span>
                          <span className={`af-doc-card__badge ${doc.required ? 'af-doc-card__badge--req' : 'af-doc-card__badge--opt'}`}>
                            {doc.required ? 'Required *' : 'Optional (যদি থাকে)'}
                          </span>
                        </div>
                        <span className="af-doc-card__bengali">{doc.bengali}</span>
                        <span className="af-doc-card__desc">{doc.description}</span>
                      </div>
                    </div>

                    <div className="af-doc-card__body">
                      {file ? (
                        <div className="af-doc-file-info">
                          {preview ? (
                            <img src={preview} alt={doc.label} className="af-doc-thumb" />
                          ) : (
                            <div className="af-doc-thumb-pdf">📄 PDF</div>
                          )}
                          <div className="af-doc-file-details">
                            <span className="af-doc-file-name" title={file.name}>{file.name}</span>
                            <span className="af-doc-file-size">
                              {docMeta[doc.key]?.savedPercent > 0 ? (
                                <span className="af-comp-badge">
                                  <span className="af-comp-orig">{formatBytes(docMeta[doc.key].originalSize)}</span>
                                  <span className="af-comp-arrow">➔</span>
                                  <span className="af-comp-now">{formatBytes(docMeta[doc.key].compressedSize)}</span>
                                  <span className="af-comp-pct">(-{docMeta[doc.key].savedPercent}%)</span>
                                </span>
                              ) : (
                                `${formatBytes(file.size)} • Ready`
                              )}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="af-doc-remove-btn"
                            onClick={() => handleRemoveDoc(doc.key)}
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="af-doc-upload-label">
                          <input
                            type="file"
                            accept={doc.accept}
                            onChange={handleFileChange(doc.key)}
                            className="af-doc-file-input"
                          />
                          <span className="af-doc-upload-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Choose File or Photo
                          </span>
                          <span className="af-doc-upload-hint">PNG, JPG, WEBP, PDF</span>
                        </label>
                      )}
                    </div>

                    {hasError && (
                      <span className="af-error af-doc-error">{errors[doc.key]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="af-declaration">
            <p>I want to set up this unique Solar Project of PM SGMBY Scheme. Therefore I request you to grant me for this Project.</p>
            <div className="af-notes">
              <p><strong>Note 1:</strong> To claim SC/ST status please submit the certificate.</p>
              <p><strong>Note 2:</strong> Filling this form is mandatory for your Solar Connection.</p>
              <p><strong>Note 3:</strong> Please send with this application form — (1) Caste Certificate (if have), (2) Electricity Bill, (3) First page of Passbook or Cancelled Cheque, (4) Aadhaar Card, (5) PAN Card, (6) GPS Photograph of the applicant, (7) Customer Signature.</p>
            </div>
          </div>

          {submitError && (
            <div className="af-alert-error" role="alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          <div className="af-submit-row">
            <button
              type="submit"
              className="btn-primary af-submit-btn"
              id="apply-form-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="af-spinner" />
                  {uploadStepMsg || 'Saving to Database...'}
                </>
              ) : (
                <>
                  Submit Application
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-outline af-preview-btn"
              onClick={() => setShowPreview(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview PDF Form
            </button>

            <button type="button" className="btn-outline" onClick={handleReset} disabled={isSubmitting}>
              Clear Form
            </button>
          </div>
        </form>
        )}
      </div>

      {showPreview && (
        <ApplicationPdfPreview form={form} onClose={() => setShowPreview(false)} />
      )}
    </section>
  );
}
