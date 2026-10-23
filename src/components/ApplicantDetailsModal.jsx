import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import './ApplicantDetailsModal.css';

export default function ApplicantDetailsModal({ applicant, onClose, onUpdateStatus, onUpdateRemark, onOpenPdf }) {
  const [qrUrl, setQrUrl] = useState('');
  const [currentStatus, setCurrentStatus] = useState(applicant.status || 'pending');
  const [updating, setUpdating] = useState(false);
  const [remark, setRemark] = useState(applicant.admin_remark || '');
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [remarkSaved, setRemarkSaved] = useState(false);

  // Generate unique verification payload for QR
  const qrPayload = JSON.stringify({
    appId: applicant.id,
    name: applicant.full_name,
    guardian: applicant.relation_name,
    mobile: applicant.mobile,
    block: applicant.block_name || applicant.sub_division || 'Malda',
    dealer: applicant.dealer_name ? `${applicant.dealer_name} (${applicant.dealer_contact})` : 'Assigned by Head',
    aadhaar: applicant.aadhaar_no,
    consumerId: applicant.electric_consumer_id || 'N/A',
    solar: `${applicant.kilowatt} ${applicant.solar_type} (${applicant.company})`,
    location: `${applicant.village}, ${applicant.district}, ${applicant.pin}`,
    status: currentStatus,
    scheme: 'PM Surya Ghar Muft Bijli Yojana',
    distributor: 'Trimurti Solar Systems, Malda',
  }, null, 2);

  useEffect(() => {
    QRCode.toDataURL(
      qrPayload,
      {
        width: 200,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err) setQrUrl(url);
      }
    );
  }, [applicant, currentStatus]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    if (onUpdateStatus) {
      setUpdating(true);
      await onUpdateStatus(applicant.id, newStatus);
      setUpdating(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `QR_${applicant.full_name.replace(/\s+/g, '_')}_${applicant.id.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'badge-success';
      case 'installed': return 'badge-installed';
      case 'under verification': return 'badge-warning';
      case 'rejected': return 'badge-danger';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="adm-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="adm-header">
          <div className="adm-header__info">
            <span className={`adm-badge ${getStatusBadgeClass(currentStatus)}`}>
              {currentStatus.toUpperCase()}
            </span>
            <h2 className="adm-name">{applicant.salutation || ''} {applicant.full_name}</h2>
            <span className="adm-id">Ref ID: <code>{applicant.id}</code></span>
          </div>
          <button className="adm-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {/* Modal Body */}
        <div className="adm-body">
          
          {/* Top Card: Status & Unique QR Code */}
          <div className="adm-qr-card">
            <div className="adm-qr-box">
              {qrUrl ? (
                <img src={qrUrl} alt="Unique Applicant QR Code" className="adm-qr-img" />
              ) : (
                <div className="adm-qr-loading">Generating QR...</div>
              )}
              <button type="button" className="adm-btn-qr-download" onClick={handleDownloadQr}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download QR Code
              </button>
            </div>

            <div className="adm-qr-meta">
              <div className="adm-qr-title">
                <h3>Unique Applicant QR Verification</h3>
                <p>Scan with any mobile camera or scanner to verify PM Surya Ghar registration and credentials.</p>
              </div>

              <div className="adm-status-control">
                <label className="adm-control-label">Change Application Status:</label>
                <div className="adm-select-wrapper">
                  <select
                    className="adm-status-select"
                    value={currentStatus}
                    onChange={handleStatusChange}
                    disabled={updating}
                  >
                    <option value="pending">⏳ Pending Review</option>
                    <option value="under verification">🔍 Under Verification</option>
                    <option value="approved">✅ Approved</option>
                    <option value="installed">⚡ Solar Installed</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                  {updating && <span className="adm-updating-spin" />}
                </div>
              </div>

              {/* Admin Remark */}
              <div className="adm-remark-control">
                <label className="adm-control-label">Admin Remark / Note for Applicant:</label>
                <textarea
                  className="adm-remark-textarea"
                  value={remark}
                  onChange={(e) => { setRemark(e.target.value); setRemarkSaved(false); }}
                  placeholder="Add a remark or note for this applicant (e.g. 'Documents verified, installation scheduled for next week')"
                  rows={3}
                />
                <div className="adm-remark-actions">
                  <button
                    type="button"
                    className="adm-btn adm-btn--remark-save"
                    disabled={remarkSaving}
                    onClick={async () => {
                      if (onUpdateRemark) {
                        setRemarkSaving(true);
                        await onUpdateRemark(applicant.id, remark.trim());
                        setRemarkSaving(false);
                        setRemarkSaved(true);
                        setTimeout(() => setRemarkSaved(false), 3000);
                      }
                    }}
                  >
                    {remarkSaving ? '⏳ Saving...' : remarkSaved ? '✅ Saved!' : '💾 Save Remark'}
                  </button>
                  {remark && !remarkSaving && (
                    <button
                      type="button"
                      className="adm-btn adm-btn--remark-clear"
                      onClick={async () => {
                        setRemark('');
                        if (onUpdateRemark) {
                          setRemarkSaving(true);
                          await onUpdateRemark(applicant.id, '');
                          setRemarkSaving(false);
                          setRemarkSaved(true);
                          setTimeout(() => setRemarkSaved(false), 3000);
                        }
                      }}
                    >
                      🗑️ Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="adm-quick-actions">
                <button
                  type="button"
                  className="adm-btn adm-btn--pdf"
                  onClick={() => onOpenPdf(applicant)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Generate Official Application PDF
                </button>
              </div>
            </div>
          </div>

          {/* Section: Personal & Guardian */}
          <div className="adm-section">
            <h4 className="adm-section-title">👤 Personal Details</h4>
            <div className="adm-grid adm-grid--3">
              <div className="adm-item">
                <span className="adm-label">Full Name</span>
                <span className="adm-val">{applicant.salutation} {applicant.full_name}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Relation / Guardian</span>
                <span className="adm-val">{applicant.relation} {applicant.relation_name}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Social Category</span>
                <span className="adm-val"><span className="adm-pill">{applicant.category}</span></span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Submission Date</span>
                <span className="adm-val">{applicant.application_date || applicant.created_at?.slice(0, 10)}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Registered Mobile</span>
                <span className="adm-val"><a href={`tel:${applicant.mobile}`}>{applicant.mobile}</a></span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Email Address</span>
                <span className="adm-val">{applicant.email || '—'}</span>
              </div>
            </div>
          </div>

          {/* Section: Block & Dealer Coordinator */}
          <div className="adm-section">
            <h4 className="adm-section-title">🏢 Assigned Block &amp; Dealer Coordinator</h4>
            <div className="adm-grid adm-grid--3">
              <div className="adm-item">
                <span className="adm-label">Selected Block</span>
                <span className="adm-val adm-val--highlight">
                  {applicant.block_name || applicant.sub_division || '—'}
                </span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Preferred Dealer</span>
                <span className="adm-val adm-val--highlight">
                  {applicant.dealer_name || 'Assigned by Head Office'}
                </span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Dealer Contact &amp; Role</span>
                <span className="adm-val">
                  {applicant.dealer_contact ? (
                    <a href={`tel:${applicant.dealer_contact}`}>📞 {applicant.dealer_contact}</a>
                  ) : '7001516219'}{' '}
                  <span className="adm-pill">{applicant.dealer_designation || 'COORDINATOR'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div className="adm-section">
            <h4 className="adm-section-title">📍 Address &amp; Jurisdiction</h4>
            <div className="adm-grid adm-grid--3">
              <div className="adm-item">
                <span className="adm-label">Village / Locality</span>
                <span className="adm-val">{applicant.village}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Post Office (P.O.)</span>
                <span className="adm-val">{applicant.post_office || '—'}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Police Station (P.S.)</span>
                <span className="adm-val">{applicant.police_station || '—'}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">District</span>
                <span className="adm-val">{applicant.district || 'Malda'}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">State</span>
                <span className="adm-val">{applicant.state || 'West Bengal'}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">PIN Code</span>
                <span className="adm-val">{applicant.pin}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Panchayat / Ward</span>
                <span className="adm-val">{applicant.panchayat || '—'}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Sub Division</span>
                <span className="adm-val">{applicant.sub_division || '—'}</span>
              </div>
            </div>
          </div>

          {/* Section: Identity & Banking */}
          <div className="adm-section">
            <h4 className="adm-section-title">💳 Identity &amp; Banking Details</h4>
            <div className="adm-grid adm-grid--2">
              <div className="adm-item">
                <span className="adm-label">Aadhaar Card No.</span>
                <span className="adm-val"><code>{applicant.aadhaar_no}</code></span>
              </div>
              <div className="adm-item">
                <span className="adm-label">PAN Card No.</span>
                <span className="adm-val"><code>{applicant.pan_no || '—'}</code></span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Bank Account No.</span>
                <span className="adm-val"><code>{applicant.bank_ac_no || '—'}</code></span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Bank IFSC</span>
                <span className="adm-val"><code>{applicant.ifsc || '—'}</code></span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Branch Name</span>
                <span className="adm-val">{applicant.branch_name || '—'}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Electric Consumer ID</span>
                <span className="adm-val"><code>{applicant.electric_consumer_id || '—'}</code></span>
              </div>
            </div>
          </div>

          {/* Section: Solar Requirements */}
          <div className="adm-section">
            <h4 className="adm-section-title">☀️ Solar Installation Requirements</h4>
            <div className="adm-grid adm-grid--2">
              <div className="adm-item">
                <span className="adm-label">Selected Solar Capacity</span>
                <span className="adm-val adm-val--highlight">{applicant.kilowatt}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Solar System Type</span>
                <span className="adm-val adm-val--highlight">{applicant.solar_type}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Chosen Brand / Company</span>
                <span className="adm-val adm-val--highlight">{applicant.company} {applicant.company_other ? `(${applicant.company_other})` : ''}</span>
              </div>
              <div className="adm-item">
                <span className="adm-label">Electricity Meter Type</span>
                <span className="adm-val">{applicant.meter_type}</span>
              </div>
            </div>
          </div>

          {/* Section: Uploaded Documents Dossier */}
          <div className="adm-section">
            <h4 className="adm-section-title">📂 Uploaded Applicant Documents (7 Verification Files)</h4>
            <div className="adm-docs-grid">
              {[
                { label: 'Caste Certificate', bengali: 'জাতি শংসাপত্র', url: applicant.caste_cert_url, icon: '📑' },
                { label: 'Electricity Bill', bengali: 'বিদ্যুৎ বিল', url: applicant.electricity_bill_url, icon: '⚡' },
                { label: 'Passbook / Cheque', bengali: 'পাসবই / চেক', url: applicant.bank_passbook_url, icon: '🏦' },
                { label: 'Aadhaar Card', bengali: 'আধার কার্ড', url: applicant.aadhaar_card_url, icon: '🪪' },
                { label: 'PAN Card', bengali: 'প্যান কার্ড', url: applicant.pan_card_url, icon: '💳' },
                { label: 'Applicant GPS Photo', bengali: 'জিপিএস ছবি', url: applicant.applicant_gps_photo_url, icon: '📸' },
                { label: 'Customer Signature', bengali: 'গ্রাহকের স্বাক্ষর', url: applicant.customer_sign_url, icon: '✍️' },
              ].map((doc) => (
                <div key={doc.label} className={`adm-doc-item ${doc.url ? 'adm-doc-item--available' : 'adm-doc-item--missing'}`}>
                  <div className="adm-doc-item__icon">{doc.icon}</div>
                  <div className="adm-doc-item__info">
                    <span className="adm-doc-item__title">{doc.label}</span>
                    <span className="adm-doc-item__sub">{doc.bengali}</span>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="adm-doc-item__link"
                      >
                        👁️ View Document ↗
                      </a>
                    ) : (
                      <span className="adm-doc-item__none">Not Uploaded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="adm-footer">
          <button type="button" className="adm-btn adm-btn--secondary" onClick={() => window.print()}>
            🖨️ Print Dossier
          </button>
          <button type="button" className="adm-btn adm-btn--primary" onClick={() => onOpenPdf(applicant)}>
            📄 Open Official PDF
          </button>
          <button type="button" className="adm-btn adm-btn--close" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
