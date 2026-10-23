import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getAdminSession, logoutAdmin } from '../../lib/adminAuth';
import ApplicantDetailsModal from '../../components/ApplicantDetailsModal';
import ApplicationPdfPreview from '../../components/ApplicationPdfPreview';
import { BLOCKS_LIST } from '../../data/dealers';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [solarFilter, setSolarFilter] = useState('ALL');
  const [companyFilter, setCompanyFilter] = useState('ALL');

  // Modals
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [pdfApplicant, setPdfApplicant] = useState(null);

  // Verify Auth Session
  useEffect(() => {
    const currentSession = getAdminSession();
    if (!currentSession) {
      navigate('/admin/login', { replace: true });
    } else {
      setSession(currentSession);
    }
  }, [navigate]);

  // Fetch Applications from Supabase
  const fetchApplications = async () => {
    if (!supabase) return;
    setSyncing(true);
    try {
      const { data, error } = await supabase
        .from('solar_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setSyncing(false);
      setLoading(false);
    }
  };

  // Initial Fetch & Real-time Supabase Subscription
  useEffect(() => {
    fetchApplications();

    if (!supabase) return;

    // Realtime channel for live sync
    const channel = supabase
      .channel('solar_applications_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'solar_applications' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setApplications((prev) => [payload.new, ...prev]);
            setLastSyncTime(new Date());
          } else if (payload.eventType === 'UPDATE') {
            setApplications((prev) =>
              prev.map((app) => (app.id === payload.new.id ? payload.new : app))
            );
            setLastSyncTime(new Date());
          } else if (payload.eventType === 'DELETE') {
            setApplications((prev) => prev.filter((app) => app.id !== payload.old.id));
            setLastSyncTime(new Date());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update Status in Supabase
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('solar_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating status: ' + err.message);
    }
  };

  // Update Remark in Supabase
  const handleUpdateRemark = async (id, newRemark) => {
    try {
      const { error } = await supabase
        .from('solar_applications')
        .update({ admin_remark: newRemark || null })
        .eq('id', id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, admin_remark: newRemark || null } : a))
      );
      if (selectedApplicant?.id === id) {
        setSelectedApplicant((prev) => (prev ? { ...prev, admin_remark: newRemark || null } : prev));
      }
    } catch (err) {
      console.error('Failed to update remark:', err);
      alert('Error updating remark: ' + err.message);
      throw err;
    }
  };

  // Delete Application
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete application for ${name}?`)) return;

    try {
      const { error } = await supabase.from('solar_applications').delete().eq('id', id);
      if (error) throw error;

      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (selectedApplicant?.id === id) setSelectedApplicant(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const normalizeBlock = (str) => (str || '').toString().trim().toUpperCase().replace(/[\s\-_]+/g, '');

  // Filtered List
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        app.full_name?.toLowerCase().includes(q) ||
        app.relation_name?.toLowerCase().includes(q) ||
        app.mobile?.includes(q) ||
        app.aadhaar_no?.includes(q) ||
        app.village?.toLowerCase().includes(q) ||
        app.block_name?.toLowerCase().includes(q) ||
        app.dealer_name?.toLowerCase().includes(q) ||
        app.electric_consumer_id?.toLowerCase().includes(q) ||
        app.id?.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'ALL' || (app.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
      
      const appBlock = normalizeBlock(app.block_name || app.sub_division);
      const targetBlock = normalizeBlock(blockFilter);
      const matchBlock =
        blockFilter === 'ALL' ||
        appBlock === targetBlock ||
        appBlock.includes(targetBlock) ||
        targetBlock.includes(appBlock);

      const matchSolar = solarFilter === 'ALL' || app.solar_type === solarFilter;
      const matchCompany = companyFilter === 'ALL' || app.company === companyFilter;

      return matchSearch && matchStatus && matchBlock && matchSolar && matchCompany;
    });
  }, [applications, search, statusFilter, blockFilter, solarFilter, companyFilter]);

  // Active Scope Statistics (District Wide or Specific Block)
  const stats = useMemo(() => {
    const targetBlock = normalizeBlock(blockFilter);
    const scopeApps = blockFilter === 'ALL'
      ? applications
      : applications.filter((a) => {
          const appBlock = normalizeBlock(a.block_name || a.sub_division);
          return appBlock === targetBlock || appBlock.includes(targetBlock) || targetBlock.includes(appBlock);
        });

    const total = scopeApps.length;
    const pending = scopeApps.filter((a) => !a.status || a.status.toLowerCase() === 'pending').length;
    const approved = scopeApps.filter((a) => a.status?.toLowerCase() === 'approved' || a.status?.toLowerCase() === 'installed').length;
    
    const totalKw = scopeApps.reduce((acc, curr) => {
      const match = (curr.kilowatt || '').match(/(\d+)/);
      return acc + (match ? parseInt(match[1], 10) : 0);
    }, 0);

    return { total, pending, approved, totalKw, scopeName: blockFilter };
  }, [applications, blockFilter]);

  // Export to CSV
  const handleExportCsv = () => {
    if (!filteredApplications.length) {
      alert('No applications to export.');
      return;
    }

    const headers = [
      'Application ID', 'Date', 'Full Name', 'Guardian Name', 'Category',
      'Village', 'Post Office', 'Police Station', 'District', 'PIN', 'State',
      'Mobile', 'Email', 'Electric Consumer ID', 'Aadhaar No', 'PAN No',
      'Bank A/c', 'IFSC', 'Branch', 'Meter Type', 'Solar System', 'Company', 'Kilowatt', 'Status'
    ];

    const rows = filteredApplications.map((a) => [
      a.id,
      a.application_date || a.created_at?.slice(0, 10),
      `"${a.salutation || ''} ${a.full_name || ''}"`,
      `"${a.relation || ''} ${a.relation_name || ''}"`,
      a.category,
      `"${a.village || ''}"`,
      `"${a.post_office || ''}"`,
      `"${a.police_station || ''}"`,
      `"${a.district || ''}"`,
      a.pin,
      `"${a.state || ''}"`,
      a.mobile,
      a.email || '',
      a.electric_consumer_id || '',
      `'${a.aadhaar_no || ''}`,
      a.pan_no || '',
      `'${a.bank_ac_no || ''}`,
      a.ifsc || '',
      `"${a.branch_name || ''}"`,
      `"${a.meter_type || ''}"`,
      `"${a.solar_type || ''}"`,
      `"${a.company || ''}"`,
      `"${a.kilowatt || ''}"`,
      a.status || 'pending'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PM_Surya_Ghar_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'ad-badge-success';
      case 'installed': return 'ad-badge-installed';
      case 'under verification': return 'ad-badge-warning';
      case 'rejected': return 'ad-badge-danger';
      default: return 'ad-badge-pending';
    }
  };

  return (
    <div className="ad-container">
      
      {/* Top Navbar */}
      <header className="ad-navbar">
        <div className="ad-navbar__brand">
          <img src="/images/sr-logo.png" alt="SR" className="ad-nav-logo" />
          <div className="ad-nav-titles">
            <div className="ad-nav-title-row">
              <span className="ad-nav-main">SR DISTRIBUTOR • MALDA</span>
              <span className="ad-nav-pill">ADMIN PORTAL</span>
            </div>
            <span className="ad-nav-sub">Trimurti Solar Systems • PM Surya Ghar Submissions</span>
          </div>
        </div>

        <div className="ad-navbar__actions">
          <div className="ad-sync-indicator" title="Connected to Supabase Realtime">
            <span className="ad-sync-dot" />
            <span className="ad-sync-text">
              Live Sync {lastSyncTime ? `• ${lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
            </span>
          </div>

          <button
            type="button"
            className="ad-btn-sync"
            onClick={fetchApplications}
            disabled={syncing}
            title="Refresh database records"
          >
            <svg className={syncing ? 'ad-spin' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Sync
          </button>

          <div className="ad-user-chip">
            <span className="ad-user-email">{session?.email || 'Admin'}</span>
          </div>

          <button type="button" className="ad-btn-logout" onClick={handleLogout} title="Sign Out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>

          <Link to="/" className="ad-btn-site" target="_blank" rel="noopener noreferrer">
            Visit Public Site ↗
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="ad-main">
        
        {/* Stats Section with Dynamic Block Breakdown */}
        <section className="ad-stats-section">
          <div className="ad-stats-header">
            <div className="ad-stats-header__info">
              <span className="ad-stats-header__badge">
                {blockFilter === 'ALL' ? '🌍 ALL 15 BLOCKS' : `📍 ${blockFilter}`}
              </span>
              <span className="ad-stats-header__title">
                {blockFilter === 'ALL' ? 'Entire Malda District Demand' : `${blockFilter} Block Demand`}
              </span>
            </div>

            <div className="ad-stats-header__filter">
              <label htmlFor="ad-block-select-top" className="ad-stats-header__label">
                View By Block:
              </label>
              <select
                id="ad-block-select-top"
                className="ad-stats-header__select"
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value)}
              >
                <option value="ALL">🌍 All Malda District (Total)</option>
                {BLOCKS_LIST.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ad-stats-strip">
            <div className="ad-stat-card">
              <div className="ad-stat-icon ad-stat-icon--total">📋</div>
              <div className="ad-stat-info">
                <span className="ad-stat-val">{stats.total}</span>
                <span className="ad-stat-lbl">
                  {blockFilter === 'ALL' ? 'Total Applications' : `${blockFilter} Applications`}
                </span>
              </div>
            </div>

            <div className="ad-stat-card">
              <div className="ad-stat-icon ad-stat-icon--pending">⏳</div>
              <div className="ad-stat-info">
                <span className="ad-stat-val">{stats.pending}</span>
                <span className="ad-stat-lbl">Pending Review</span>
              </div>
            </div>

            <div className="ad-stat-card">
              <div className="ad-stat-icon ad-stat-icon--approved">✅</div>
              <div className="ad-stat-info">
                <span className="ad-stat-val">{stats.approved}</span>
                <span className="ad-stat-lbl">Approved / Active</span>
              </div>
            </div>

            <div className="ad-stat-card">
              <div className="ad-stat-icon ad-stat-icon--solar">☀️</div>
              <div className="ad-stat-info">
                <span className="ad-stat-val">{stats.totalKw} KW</span>
                <span className="ad-stat-lbl">
                  {blockFilter === 'ALL' ? 'District Capacity Demanded' : `${blockFilter} Demand`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <section className="ad-toolbar">
          <div className="ad-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="ad-search-input"
              placeholder="Search by Name, Mobile, Aadhaar, Village, Consumer ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="ad-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="ad-filters-row">
            <select
              className="ad-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="under verification">Under Verification</option>
              <option value="approved">Approved</option>
              <option value="installed">Solar Installed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              className="ad-filter-select"
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
            >
              <option value="ALL">All Blocks (Malda)</option>
              {BLOCKS_LIST.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              className="ad-filter-select"
              value={solarFilter}
              onChange={(e) => setSolarFilter(e.target.value)}
            >
              <option value="ALL">All Solar Types</option>
              <option value="On-Grid System">On-Grid System</option>
              <option value="Hybrid Solar">Hybrid Solar</option>
              <option value="Off-Grid Solar System">Off-Grid Solar System</option>
            </select>

            <select
              className="ad-filter-select"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="ALL">All Brands</option>
              <option value="Loom Solar">Loom Solar</option>
              <option value="TATA Power Solar">TATA Power Solar</option>
              <option value="ADANI Solar">ADANI Solar</option>
              <option value="Waaree Energies">Waaree Energies</option>
              <option value="Vikram Solar">Vikram Solar</option>
            </select>

            <button type="button" className="ad-btn-export" onClick={handleExportCsv}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV ({filteredApplications.length})
            </button>
          </div>
        </section>

        {/* Applications Table */}
        <section className="ad-table-card">
          {loading ? (
            <div className="ad-loading-state">
              <div className="ad-spinner-big" />
              <p>Connecting to Supabase Database...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="ad-empty-state">
              <span className="ad-empty-icon">📂</span>
              <h3>No Applications Found</h3>
              <p>
                {applications.length === 0
                  ? 'No applicants have submitted the online form yet. Any new submission on the website will sync here automatically in real time!'
                  : 'No records match your active search or filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="ad-table-responsive">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Ref ID &amp; QR</th>
                    <th>Applicant Details</th>
                    <th>Contact &amp; Location</th>
                    <th>Solar Specification</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="ad-th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="ad-table-row">
                      
                      {/* Ref ID */}
                      <td className="ad-td-id">
                        <button
                          type="button"
                          className="ad-ref-btn"
                          onClick={() => setSelectedApplicant(app)}
                          title="Click to view unique QR & full dossier"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          <code>{app.id.slice(0, 8)}</code>
                        </button>
                      </td>

                      {/* Applicant */}
                      <td className="ad-td-applicant">
                        <strong className="ad-app-name">{app.salutation} {app.full_name}</strong>
                        <span className="ad-app-guardian">{app.relation} {app.relation_name}</span>
                        <span className="ad-app-cat">{app.category}</span>
                      </td>

                      {/* Contact & Village */}
                      <td className="ad-td-contact">
                        <span className="ad-app-mobile">📞 {app.mobile}</span>
                        <span className="ad-app-loc">📍 {app.village}, {app.district}</span>
                        {(app.block_name || app.sub_division) && (
                          <span className="ad-app-block-badge">Block: {app.block_name || app.sub_division}</span>
                        )}
                        {app.dealer_name && (
                          <span className="ad-app-dealer-tag">Dealer: {app.dealer_name}</span>
                        )}
                        <span className="ad-app-pin">PIN: {app.pin}</span>
                      </td>

                      {/* Solar Specs */}
                      <td className="ad-td-solar">
                        <span className="ad-solar-kw">{app.kilowatt}</span>
                        <span className="ad-solar-sys">{app.solar_type}</span>
                        <span className="ad-solar-brand">{app.company}</span>
                      </td>

                      {/* Date */}
                      <td className="ad-td-date">
                        <span>{app.application_date || app.created_at?.slice(0, 10)}</span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="ad-td-status">
                        <select
                          className={`ad-status-pill ${getStatusBadgeClass(app.status)}`}
                          value={app.status || 'pending'}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="under verification">Under Verification</option>
                          <option value="approved">Approved</option>
                          <option value="installed">Installed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {app.admin_remark && (
                          <div className="ad-table-remark" title={`Admin Remark: ${app.admin_remark}`}>
                            💬 <span>{app.admin_remark}</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="ad-td-actions">
                        <div className="ad-action-btns">
                          <button
                            type="button"
                            className="ad-btn-act ad-btn-act--view"
                            onClick={() => setSelectedApplicant(app)}
                            title="View Full Profile & Unique QR"
                          >
                            👁️ View &amp; QR
                          </button>
                          <button
                            type="button"
                            className="ad-btn-act ad-btn-act--pdf"
                            onClick={() => setPdfApplicant(app)}
                            title="Generate Official PM Surya Ghar PDF"
                          >
                            📄 PDF
                          </button>
                          <button
                            type="button"
                            className="ad-btn-act ad-btn-act--del"
                            onClick={() => handleDelete(app.id, app.full_name)}
                            title="Delete Record"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* Applicant Dossier & QR Modal */}
      {selectedApplicant && (
        <ApplicantDetailsModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateRemark={handleUpdateRemark}
          onOpenPdf={(app) => {
            setSelectedApplicant(null);
            setPdfApplicant(app);
          }}
        />
      )}

      {/* Official Form PDF 
      
      
      Modal */}
      {pdfApplicant && (
        <ApplicationPdfPreview
          form={pdfApplicant}
          onClose={() => setPdfApplicant(null)}
        />
      )}

    </div>
  );
}
