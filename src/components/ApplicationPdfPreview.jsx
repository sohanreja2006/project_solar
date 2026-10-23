import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import './ApplicationPdfPreview.css';

export default function ApplicationPdfPreview({ form, onClose }) {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  // Normalize fields whether from camelCase form or snake_case Supabase row
  const d = {
    id: form.id || '',
    fullName: form.full_name || form.fullName || '',
    salutation: form.salutation || 'Mr.',
    relation: form.relation || 'S/O.',
    relationName: form.relation_name || form.relationName || '',
    village: form.village || '',
    postOffice: form.post_office || form.postOffice || '',
    policeStation: form.police_station || form.policeStation || '',
    district: form.district || 'Malda',
    pin: form.pin || '',
    state: form.state || 'West Bengal',
    category: form.category || '',
    panchayat: form.panchayat || '',
    subDivision: form.sub_division || form.subDivision || '',
    panNo: form.pan_no || form.panNo || '',
    aadhaarNo: form.aadhaar_no || form.aadhaarNo || '',
    bankAcNo: form.bank_ac_no || form.bankAcNo || '',
    ifsc: form.ifsc || '',
    branchName: form.branch_name || form.branchName || '',
    mobile: form.mobile || '',
    email: form.email || '',
    electricConsumerId: form.electric_consumer_id || form.electricConsumerId || '',
    meterType: form.meter_type || form.meterType || '',
    solarType: form.solar_type || form.solarType || '',
    company: form.company || '',
    companyOther: form.company_other || form.companyOther || '',
    kilowatt: form.kilowatt || '',
    kilowattOther: form.kilowatt_other || form.kilowattOther || '',
    date: form.application_date || form.date || new Date().toISOString().split('T')[0],
    blockName: form.block_name || form.blockName || '',
    dealerName: form.dealer_name || form.dealerName || '',
    dealerContact: form.dealer_contact || form.dealerContact || '',
    dealerDesignation: form.dealer_designation || form.dealerDesignation || '',
  };

  useEffect(() => {
    const payload = JSON.stringify({
      appId: d.id || 'SUBMITTED',
      name: d.fullName,
      mobile: d.mobile,
      consumerId: d.electricConsumerId || 'N/A',
      solar: `${d.kilowatt} ${d.solarType} (${d.company})`,
      distributor: 'Trimurti Solar Systems, Malda',
      scheme: 'PM Surya Ghar Muft Bijli Yojana',
    });

    QRCode.toDataURL(payload, { width: 90, margin: 1 }, (err, url) => {
      if (!err) setQrUrl(url);
    });
  }, [form]);

  const handleDownloadPdf = async () => {
    if (!printRef.current || downloading) return;
    setDownloading(true);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const safeName = (d.fullName || 'Applicant').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`PM_Surya_Ghar_Application_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Could not generate PDF. You can also use the Print button to Save as PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const METER_LIST = ['Domestic Meter', 'Commercial Meter', 'Industrial Meter', 'Others'];
  const SOLAR_LIST = ['On-Grid System', 'Hybrid Solar', 'Off-Grid Solar System'];
  const COMPANIES_LIST = ['Loom Solar', 'TATA Power Solar', 'ADANI Solar', 'Waaree Energies', 'Vikram Solar', 'Others'];
  const KW_LIST = ['1 KW', '2 KW', '3 KW', '4 KW', '5 KW', '6 KW', '7 KW', '8 KW', '9 KW', '10 KW', 'Others'];

  return (
    <div className="pdf-modal-backdrop" onClick={onClose}>
      <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Toolbar */}
        <div className="pdf-modal-toolbar">
          <div className="pdf-modal-title">
            <span className="pdf-modal-badge">A4 Official Document</span>
            <h3>Application Preview</h3>
          </div>
          <div className="pdf-modal-actions">
            <button
              type="button"
              className="pdf-btn pdf-btn--primary"
              onClick={handleDownloadPdf}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <span className="pdf-spinner" /> Generating PDF...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
            <button type="button" className="pdf-btn pdf-btn--secondary" onClick={handlePrint}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print / Save
            </button>
            <button type="button" className="pdf-btn pdf-btn--close" onClick={onClose} aria-label="Close preview">
              ✕
            </button>
          </div>
        </div>

        {/* Printable A4 Container */}
        <div className="pdf-sheet-wrapper">
          <div className="pdf-sheet" ref={printRef} id="printable-application-sheet">
            
            {/* Header Logos & Title */}
            <div className="pdf-header">
              <div className="pdf-header__top">
                <img src="/images/nexis-logo.png" alt="NEXIS" className="pdf-logo-nexis" />
                <div className="pdf-header__center">
                  <h1 className="pdf-org-title">GREEN ENERGY INFRA PRIVATE LIMITED</h1>
                  <h2 className="pdf-scheme-title">PM Surya Ghar Muft Bijli Yojana Govt. of India</h2>
                </div>
                <img src="/images/tss-logo.jpeg" alt="TSS" className="pdf-logo-tss" />
              </div>

              {/* Scheme Emblem Banner, QR & Date */}
              <div className="pdf-header__subbar">
                <div className="pdf-emblem-box">
                  <div className="pdf-emblem-flag">
                    <span className="pdf-emblem-pm">प्रधानमंत्री</span>
                    <span className="pdf-emblem-sg">SURYA GHAR</span>
                    <span className="pdf-emblem-mb">मुफ़्त बिजली योजना</span>
                  </div>
                </div>

                <div className="pdf-subbar-right">
                  {qrUrl && (
                    <div className="pdf-doc-qr" title="Scan to verify applicant">
                      <img src={qrUrl} alt="Applicant Verification QR" />
                      <span className="pdf-doc-qr-label">Scan to Verify</span>
                    </div>
                  )}
                  <div className="pdf-date-line">
                    <strong>Date:</strong> <span className="pdf-fill-value">{d.date}</span>
                  </div>
                </div>
              </div>

              {/* Prayer Subject */}
              <div className="pdf-subject-box">
                <p className="pdf-subject-text">Sub:- Prayer for Solar Plantation Under of PM SGMBY Scheme.</p>
                <p className="pdf-subject-sub">FILL IN THE FORM IN ENGLISH (BLOCK LETTERS)</p>
              </div>
            </div>

            {/* Form Body */}
            <div className="pdf-body">
              <p className="pdf-salutation-line">Respected Sir,</p>

              {/* Line: Name */}
              <div className="pdf-line">
                <span className="pdf-label">I, {d.salutation}</span>
                <span className="pdf-value pdf-dots">{d.fullName || '—'}</span>
              </div>

              {/* Line: Relation */}
              <div className="pdf-line">
                <span className="pdf-label">{d.relation}</span>
                <span className="pdf-value pdf-dots">{d.relationName || '—'}</span>
              </div>

              {/* Line: Vill / PO */}
              <div className="pdf-line pdf-line--split">
                <div className="pdf-split-item">
                  <span className="pdf-label">Vill.</span>
                  <span className="pdf-value pdf-dots">{d.village || '—'}</span>
                </div>
                <div className="pdf-split-item">
                  <span className="pdf-label">P.O.</span>
                  <span className="pdf-value pdf-dots">{d.postOffice || '—'}</span>
                </div>
              </div>

              {/* Line: PS / Dist */}
              <div className="pdf-line pdf-line--split">
                <div className="pdf-split-item">
                  <span className="pdf-label">P.S.</span>
                  <span className="pdf-value pdf-dots">{d.policeStation || '—'}</span>
                </div>
                <div className="pdf-split-item">
                  <span className="pdf-label">Dist.</span>
                  <span className="pdf-value pdf-dots">{d.district}</span>
                </div>
              </div>

              {/* Line: Pin / State / Category */}
              <div className="pdf-line pdf-line--three">
                <div className="pdf-three-item">
                  <span className="pdf-label">Pin.</span>
                  <span className="pdf-value pdf-dots">{d.pin || '—'}</span>
                </div>
                <div className="pdf-three-item">
                  <span className="pdf-label">State.</span>
                  <span className="pdf-value pdf-dots">{d.state}</span>
                </div>
                <div className="pdf-three-item pdf-category-box">
                  <span className="pdf-label">Category:</span>
                  <span className={`pdf-cat-tag ${d.category === 'GEN' ? 'pdf-cat-tag--active' : ''}`}>GEN</span>
                  <span className={`pdf-cat-tag ${d.category === 'SC' ? 'pdf-cat-tag--active' : ''}`}>SC</span>
                  <span className={`pdf-cat-tag ${d.category === 'ST' ? 'pdf-cat-tag--active' : ''}`}>ST</span>
                </div>
              </div>

              {/* Line: Panchayat / Municipality */}
              <div className="pdf-line">
                <span className="pdf-label">Panchayat / Ward No. / Corporation / Municipality.</span>
                <span className="pdf-value pdf-dots">{d.panchayat || '—'}</span>
              </div>

              {/* Line: Block & Preferred Dealer Coordinator */}
              <div className="pdf-line pdf-line--split">
                <div className="pdf-split-item">
                  <span className="pdf-label">Block Name.</span>
                  <span className="pdf-value pdf-dots">{d.blockName || d.subDivision || '—'}</span>
                </div>
                <div className="pdf-split-item">
                  <span className="pdf-label">Preferred Dealer.</span>
                  <span className="pdf-value pdf-dots">{d.dealerName ? `${d.dealerName} (${d.dealerContact || ''})` : '—'}</span>
                </div>
              </div>

              {/* Line: Sub Division / Pan */}
              <div className="pdf-line pdf-line--split">
                <div className="pdf-split-item">
                  <span className="pdf-label">Sub Division.</span>
                  <span className="pdf-value pdf-dots">{d.subDivision || '—'}</span>
                </div>
                <div className="pdf-split-item">
                  <span className="pdf-label">Pan No.</span>
                  <span className="pdf-value pdf-dots">{d.panNo || '—'}</span>
                </div>
              </div>

              {/* Line: Aadhaar */}
              <div className="pdf-line">
                <span className="pdf-label">Aadhaar No.</span>
                <span className="pdf-value pdf-dots">{d.aadhaarNo || '—'}</span>
              </div>

              {/* Line: Bank / IFSC */}
              <div className="pdf-line pdf-line--split">
                <div className="pdf-split-item">
                  <span className="pdf-label">Bank A/c No.</span>
                  <span className="pdf-value pdf-dots">{d.bankAcNo || '—'}</span>
                </div>
                <div className="pdf-split-item">
                  <span className="pdf-label">IFSC</span>
                  <span className="pdf-value pdf-dots">{d.ifsc || '—'}</span>
                </div>
              </div>

              {/* Line: Branch / Mob */}
              <div className="pdf-line pdf-line--split">
                <div className="pdf-split-item">
                  <span className="pdf-label">Branch Name.</span>
                  <span className="pdf-value pdf-dots">{d.branchName || '—'}</span>
                </div>
                <div className="pdf-split-item">
                  <span className="pdf-label">Mob.</span>
                  <span className="pdf-value pdf-dots">{d.mobile || '—'}</span>
                </div>
              </div>

              {/* Line: Email / Consumer ID */}
              <div className="pdf-line pdf-line--split">
                <div className="pdf-split-item">
                  <span className="pdf-label">Email ID (in block letter).</span>
                  <span className="pdf-value pdf-dots">{d.email || '—'}</span>
                </div>
                <div className="pdf-split-item">
                  <span className="pdf-label">Electric Consumer Id.</span>
                  <span className="pdf-value pdf-dots">{d.electricConsumerId || '—'}</span>
                </div>
              </div>

              {/* Option 1: Type of Meter */}
              <div className="pdf-choice-block">
                <div className="pdf-choice-title">
                  <span className="pdf-check-icon">✓</span>
                  <strong>Type of Meter :</strong>
                </div>
                <div className="pdf-options-row">
                  {METER_LIST.map((m) => (
                    <span
                      key={m}
                      className={`pdf-option-item ${d.meterType === m ? 'pdf-option-item--selected' : ''}`}
                    >
                      <span className="pdf-box">{d.meterType === m ? '☑' : '☐'}</span> {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Option 2: Solar System Type */}
              <div className="pdf-choice-block">
                <div className="pdf-choice-title">
                  <span className="pdf-check-icon">✓</span>
                  <strong>Complete Range of Solar Products :</strong>
                </div>
                <div className="pdf-options-row">
                  {SOLAR_LIST.map((s) => (
                    <span
                      key={s}
                      className={`pdf-option-item ${d.solarType === s ? 'pdf-option-item--selected' : ''}`}
                    >
                      <span className="pdf-box">{d.solarType === s ? '☑' : '☐'}</span> {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Option 3: Chosen Company */}
              <div className="pdf-choice-block">
                <div className="pdf-choice-title">
                  <span className="pdf-check-icon">✓</span>
                  <strong>Chose your Companies Name :-</strong>
                </div>
                <div className="pdf-options-row pdf-options-row--wrap">
                  {COMPANIES_LIST.map((c, idx) => (
                    <span
                      key={c}
                      className={`pdf-option-item ${d.company === c ? 'pdf-option-item--selected' : ''}`}
                    >
                      <span className="pdf-box">{d.company === c ? '☑' : '☐'}</span> ({['i', 'ii', 'iii', 'iv', 'v', 'vi'][idx]}) {c}
                      {c === 'Others' && d.company === 'Others' && d.companyOther && (
                        <span className="pdf-option-other"> ({d.companyOther})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Option 4: Kilowatts */}
              <div className="pdf-choice-block">
                <div className="pdf-choice-title">
                  <span className="pdf-check-icon">✓</span>
                  <strong>Mark the correct number of kilowatts you need to it :-</strong>
                </div>
                <div className="pdf-options-row pdf-options-row--wrap">
                  {KW_LIST.map((k, idx) => (
                    <span
                      key={k}
                      className={`pdf-option-item ${d.kilowatt === k ? 'pdf-option-item--selected' : ''}`}
                    >
                      <span className="pdf-box">{d.kilowatt === k ? '☑' : '☐'}</span> ({['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi'][idx]}) {k}
                      {k === 'Others' && d.kilowatt === 'Others' && d.kilowattOther && (
                        <span className="pdf-option-other"> ({d.kilowattOther})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prayer Declaration Statement */}
              <div className="pdf-prayer-statement">
                I Want to set up this unique Solar Project of PM SGMBY Scheme. Therefore I request you to grant me for this Project.
              </div>

              {/* Notes */}
              <div className="pdf-notes">
                <p><strong>Note 1 :-</strong> To claim SC/ST status please submit the certificate.</p>
                <p><strong>Note 2 :-</strong> Filling this form is mandatory for your Solar Connection.</p>
                <p><strong>Note 3 :-</strong> Please send with this application form : (1) Electricity Bill, (2) First page of your Passbook or Cancelled Cheque, (3) Aadhaar Card, (4) PAN Card, (5) GPS Photograph of the applicant.</p>
              </div>

              {/* Signatures */}
              <div className="pdf-signatures">
                <div className="pdf-sig-consumer">
                  <div className="pdf-sig-dots" />
                  <span className="pdf-sig-label">Consumer Signature</span>
                </div>
                <div className="pdf-sig-witness">
                  <span className="pdf-sig-witness-title">Witness Signature</span>
                  <div className="pdf-witness-line">
                    <span>i)</span>
                    <div className="pdf-sig-dots" />
                  </div>
                  <div className="pdf-witness-line">
                    <span>ii)</span>
                    <div className="pdf-sig-dots" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
