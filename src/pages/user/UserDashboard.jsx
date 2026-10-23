import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { fetchUserApplications } from '../../lib/userAuth';
import { supabase } from '../../lib/supabase';
import './UserDashboard.css';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    icon: '⏳',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    desc: 'Your application has been received and is awaiting review by our team.',
    step: 1,
  },
  'under verification': {
    label: 'Under Verification',
    icon: '🔍',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
    desc: 'Your documents and details are currently being verified by our experts.',
    step: 2,
  },
  approved: {
    label: 'Approved ✓',
    icon: '✅',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
    desc: 'Congratulations! Your application has been approved. Installation will be scheduled soon.',
    step: 3,
  },
  installed: {
    label: 'Solar Installed 🎉',
    icon: '☀️',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    desc: 'Your solar system has been successfully installed. Welcome to clean energy!',
    step: 4,
  },
  rejected: {
    label: 'Rejected',
    icon: '❌',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    desc: 'Your application was not approved. Please contact us for more information.',
    step: 0,
  },
};

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Submitted', icon: '📋' },
  { key: 'under verification', label: 'Verification', icon: '🔍' },
  { key: 'approved', label: 'Approved', icon: '✅' },
  { key: 'installed', label: 'Installed', icon: '☀️' },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    loadApplications();
  }, [user]);

  // Real-time status updates via Supabase subscription
  // Only react to updates for applications that belong to the current user
  useEffect(() => {
    if (!supabase || !user) return;
    const channel = supabase
      .channel('user_app_status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'solar_applications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setApplications((prev) =>
          prev.map((a) => (a.id === payload.new.id ? { ...a, ...payload.new } : a))
        );
        setSelected((prev) => (prev && prev.id === payload.new.id ? { ...prev, ...payload.new } : prev));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const loadApplications = async () => {
    setLoading(true);
    const apps = await fetchUserApplications(user);
    setApplications(apps);
    if (apps.length > 0 && !selected) setSelected(apps[0]);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusConfig = (status) => STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

  const getStepClass = (stepIndex, currentStep, isRejected) => {
    if (isRejected) return 'ud-step--inactive';
    if (stepIndex < currentStep) return 'ud-step--done';
    if (stepIndex === currentStep - 1) return 'ud-step--active';
    return 'ud-step--inactive';
  };

  if (!user) return null;

  const statusCfg = selected ? getStatusConfig(selected.status) : null;
  const isRejected = selected?.status?.toLowerCase() === 'rejected';
  const currentStep = statusCfg?.step || 1;

  return (
    <div className="ud-page">
      {/* Background */}
      <div className="ud-bg">
        <div className="ud-bg__orb ud-bg__orb--1" />
        <div className="ud-bg__orb ud-bg__orb--2" />
      </div>

      {/* Navbar */}
      <header className="ud-navbar">
        <Link to="/" className="ud-navbar__brand">
          <img src="/images/sr-logo.png" alt="SR" className="ud-navbar__logo" />
          <div className="ud-navbar__brand-text">
            <span className="ud-navbar__brand-main">SR Distributor</span>
            <span className="ud-navbar__brand-sub">Trimurti Solar Systems</span>
          </div>
        </Link>

        <div className="ud-navbar__title">
          <span className="ud-navbar__title-text">☀️ My Application Dashboard</span>
        </div>

        <div className="ud-navbar__actions">
          <div className="ud-user-chip">
            <div className="ud-user-avatar">
              {(user.fullName || user.username || 'U')[0].toUpperCase()}
            </div>
            <div className="ud-user-info">
              <span className="ud-user-name">{user.fullName || user.username}</span>
              <span className="ud-user-username">@{user.username}</span>
            </div>
          </div>
          <Link to="/#apply" className="ud-btn-apply">
            + New Application
          </Link>
          <button className="ud-btn-logout" onClick={handleLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="ud-main">

        {loading ? (
          <div className="ud-loading">
            <div className="ud-spinner" />
            <p>Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          /* No applications yet */
          <div className="ud-empty">
            <div className="ud-empty__icon">📋</div>
            <h2 className="ud-empty__title">No Applications Yet</h2>
            <p className="ud-empty__desc">
              You haven't submitted any solar application yet. Apply now under{' '}
              <strong>PM Surya Ghar Muft Bijli Yojana</strong> to get free solar electricity!
            </p>
            <Link to="/#apply" className="ud-empty__btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Apply for Solar Now
            </Link>
            <p className="ud-empty__hint">
              💡 Make sure to use the same mobile number (<strong>{user.mobile}</strong>) when filling the application form.
            </p>
          </div>
        ) : (
          <div className="ud-layout">

            {/* Sidebar: Application List */}
            <aside className="ud-sidebar">
              <div className="ud-sidebar__header">
                <h3 className="ud-sidebar__title">My Applications</h3>
                <span className="ud-sidebar__count">{applications.length}</span>
              </div>
              <div className="ud-app-list">
                {applications.map((app) => {
                  const sc = getStatusConfig(app.status);
                  return (
                    <button
                      key={app.id}
                      className={`ud-app-item ${selected?.id === app.id ? 'ud-app-item--active' : ''}`}
                      onClick={() => setSelected(app)}
                    >
                      <div className="ud-app-item__top">
                        <span className="ud-app-item__name">
                          {app.salutation} {app.full_name}
                        </span>
                        <span
                          className="ud-app-item__status"
                          style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}
                        >
                          {sc.icon}
                        </span>
                      </div>
                      <div className="ud-app-item__meta">
                        <span>📅 {app.application_date || app.created_at?.slice(0, 10)}</span>
                        <span>☀️ {app.kilowatt}</span>
                      </div>
                      <div className="ud-app-item__id">
                        ID: {app.id?.slice(0, 8)}...
                      </div>
                      {app.admin_remark && (
                        <div className="ud-app-item__remark" title={app.admin_remark}>
                          💬 {app.admin_remark}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <Link to="/#apply" className="ud-sidebar__apply-btn">
                + Submit New Application
              </Link>
            </aside>

            {/* Main Detail Panel */}
            {selected && (
              <div className="ud-detail">

                {/* Status Hero */}
                <div
                  className="ud-status-hero"
                  style={{ '--status-color': statusCfg.color, '--status-bg': statusCfg.bg, '--status-border': statusCfg.border }}
                >
                  <div className="ud-status-hero__icon">{statusCfg.icon}</div>
                  <div className="ud-status-hero__content">
                    <div className="ud-status-hero__label">Current Status</div>
                    <div className="ud-status-hero__status">{statusCfg.label}</div>
                    <p className="ud-status-hero__desc">{statusCfg.desc}</p>
                  </div>
                  <div className="ud-status-hero__badge">
                    <span>{isRejected ? '❌ Not Approved' : `Step ${currentStep} of 4`}</span>
                  </div>
                </div>

                {/* Admin Remark Box */}
                {selected.admin_remark && (
                  <div className="ud-remark-card">
                    <div className="ud-remark-card__icon">💬</div>
                    <div className="ud-remark-card__content">
                      <div className="ud-remark-card__header">
                        <span className="ud-remark-card__title">Admin Remark / Message</span>
                        <span className="ud-remark-card__badge">Official Update</span>
                      </div>
                      <p className="ud-remark-card__text">{selected.admin_remark}</p>
                    </div>
                  </div>
                )}

                {/* Progress Timeline */}
                {!isRejected && (
                  <div className="ud-timeline">
                    {TIMELINE_STEPS.map((step, idx) => (
                      <div key={step.key} className={`ud-step ${getStepClass(idx, currentStep, isRejected)}`}>
                        <div className="ud-step__circle">
                          {idx < currentStep - 1 ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            <span>{step.icon}</span>
                          )}
                        </div>
                        {idx < TIMELINE_STEPS.length - 1 && <div className="ud-step__line" />}
                        <div className="ud-step__label">{step.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Application Details Grid */}
                <div className="ud-detail-grid">

                  {/* Applicant Info */}
                  <div className="ud-detail-card">
                    <h4 className="ud-detail-card__title">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Applicant Details
                    </h4>
                    <div className="ud-detail-rows">
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Full Name</span>
                        <span className="ud-detail-row__value">{selected.salutation} {selected.full_name}</span>
                      </div>
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Guardian</span>
                        <span className="ud-detail-row__value">{selected.relation} {selected.relation_name}</span>
                      </div>
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Category</span>
                        <span className="ud-detail-row__value">{selected.category}</span>
                      </div>
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Mobile</span>
                        <span className="ud-detail-row__value">📞 {selected.mobile}</span>
                      </div>
                      {selected.email && (
                        <div className="ud-detail-row">
                          <span className="ud-detail-row__label">Email</span>
                          <span className="ud-detail-row__value">{selected.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="ud-detail-card">
                    <h4 className="ud-detail-card__title">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Address
                    </h4>
                    <div className="ud-detail-rows">
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Village</span>
                        <span className="ud-detail-row__value">{selected.village}</span>
                      </div>
                      {selected.post_office && (
                        <div className="ud-detail-row">
                          <span className="ud-detail-row__label">Post Office</span>
                          <span className="ud-detail-row__value">{selected.post_office}</span>
                        </div>
                      )}
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">District</span>
                        <span className="ud-detail-row__value">{selected.district}</span>
                      </div>
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">PIN</span>
                        <span className="ud-detail-row__value">{selected.pin}</span>
                      </div>
                      {(selected.block_name || selected.sub_division) && (
                        <div className="ud-detail-row">
                          <span className="ud-detail-row__label">Block</span>
                          <span className="ud-detail-row__value">{selected.block_name || selected.sub_division}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Solar Specs */}
                  <div className="ud-detail-card">
                    <h4 className="ud-detail-card__title">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                      Solar Specifications
                    </h4>
                    <div className="ud-detail-rows">
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">System Type</span>
                        <span className="ud-detail-row__value">{selected.solar_type}</span>
                      </div>
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Capacity</span>
                        <span className="ud-detail-row__value ud-detail-row__value--highlight">{selected.kilowatt}</span>
                      </div>
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Company</span>
                        <span className="ud-detail-row__value">{selected.company}</span>
                      </div>
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Meter Type</span>
                        <span className="ud-detail-row__value">{selected.meter_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dealer */}
                  <div className="ud-detail-card">
                    <h4 className="ud-detail-card__title">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      Dealer & Application
                    </h4>
                    <div className="ud-detail-rows">
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">App. Date</span>
                        <span className="ud-detail-row__value">{selected.application_date || selected.created_at?.slice(0, 10)}</span>
                      </div>
                      <div className="ud-detail-row">
                        <span className="ud-detail-row__label">Reference ID</span>
                        <span className="ud-detail-row__value ud-detail-row__value--id">{selected.id?.slice(0, 16)}...</span>
                      </div>
                      {selected.dealer_name && (
                        <div className="ud-detail-row">
                          <span className="ud-detail-row__label">Dealer</span>
                          <span className="ud-detail-row__value">{selected.dealer_name}</span>
                        </div>
                      )}
                      {selected.dealer_contact && (
                        <div className="ud-detail-row">
                          <span className="ud-detail-row__label">Dealer Contact</span>
                          <span className="ud-detail-row__value">📞 {selected.dealer_contact}</span>
                        </div>
                      )}
                      {selected.electric_consumer_id && (
                        <div className="ud-detail-row">
                          <span className="ud-detail-row__label">Consumer ID</span>
                          <span className="ud-detail-row__value">{selected.electric_consumer_id}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  <div className="ud-detail-card ud-detail-card--span2">
                    <h4 className="ud-detail-card__title">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      Submitted Documents • জমা দেওয়া নথিপত্র
                    </h4>
                    <div className="ud-docs-list">
                      {[
                        { label: 'Caste Certificate', bengali: 'জাতি শংসাপত্র', url: selected.caste_cert_url, icon: '📑' },
                        { label: 'Electricity Bill', bengali: 'বিদ্যুৎ বিল', url: selected.electricity_bill_url, icon: '⚡' },
                        { label: 'Passbook / Cheque', bengali: 'ব্যাংক পাসবই / চেক', url: selected.bank_passbook_url, icon: '🏦' },
                        { label: 'Aadhaar Card', bengali: 'আধার কার্ড', url: selected.aadhaar_card_url, icon: '🪪' },
                        { label: 'PAN Card', bengali: 'প্যান কার্ড', url: selected.pan_card_url, icon: '💳' },
                        { label: 'Applicant GPS Photo', bengali: 'জিপিএস ছবি', url: selected.applicant_gps_photo_url, icon: '📸' },
                        { label: 'Customer Signature', bengali: 'গ্রাহকের স্বাক্ষর', url: selected.customer_sign_url, icon: '✍️' },
                      ].map((doc) => (
                        <div key={doc.label} className={`ud-doc-item ${doc.url ? 'ud-doc-item--uploaded' : 'ud-doc-item--none'}`}>
                          <span className="ud-doc-item__icon">{doc.icon}</span>
                          <div className="ud-doc-item__text">
                            <span className="ud-doc-item__name">{doc.label}</span>
                            <span className="ud-doc-item__bengali">{doc.bengali}</span>
                          </div>
                          {doc.url ? (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="ud-doc-item__view">
                              View File ↗
                            </a>
                          ) : (
                            <span className="ud-doc-item__status">Not Attached</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Support Card */}
                <div className="ud-support-card">
                  <div className="ud-support-card__content">
                    <div className="ud-support-card__icon">💬</div>
                    <div>
                      <div className="ud-support-card__title">Need Help?</div>
                      <div className="ud-support-card__desc">Contact us for any queries about your application status.</div>
                    </div>
                  </div>
                  <div className="ud-support-card__actions">
                    <a href="tel:+917001516219" className="ud-support-btn ud-support-btn--call">
                      📞 7001516219
                    </a>
                    <a
                      href={`https://wa.me/917001516219?text=Hi%2C%20I%20want%20to%20check%20the%20status%20of%20my%20solar%20application%20(ID%3A%20${selected.id?.slice(0,8)})%20submitted%20for%20${encodeURIComponent(selected.full_name || '')}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ud-support-btn ud-support-btn--whatsapp"
                    >
                      WhatsApp Us
                    </a>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
