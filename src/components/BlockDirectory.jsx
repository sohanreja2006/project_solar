import { useState, useMemo } from 'react';
import { MALDA_BLOCKS_DATA, DISTRICT_HEAD, getDealersForBlock } from '../data/dealers';
import './BlockDirectory.css';

export default function BlockDirectory() {
  const [selectedBlockId, setSelectedBlockId] = useState('ratua-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Current selected block
  const currentBlock = useMemo(() => {
    return MALDA_BLOCKS_DATA.find((b) => b.id === selectedBlockId) || MALDA_BLOCKS_DATA[0];
  }, [selectedBlockId]);

  // Dealers for current block
  const blockDealers = useMemo(() => {
    return getDealersForBlock(currentBlock.name);
  }, [currentBlock]);

  // Search results across all blocks
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matches = [];
    MALDA_BLOCKS_DATA.forEach((b) => {
      b.gps.forEach((gp, idx) => {
        if (gp.toLowerCase().includes(q) || b.name.toLowerCase().includes(q)) {
          matches.push({
            block: b.name,
            blockId: b.id,
            gp,
            serial: idx + 1,
            dealers: getDealersForBlock(b.name),
          });
        }
      });
    });
    return matches;
  }, [searchQuery]);

  const handleApplyClick = (blockName, gpName) => {
    // Dispatch custom event to auto-fill block and GP in ApplicationForm
    window.dispatchEvent(
      new CustomEvent('solar:select-block-gp', {
        detail: { blockName, gramPanchayat: gpName },
      })
    );
    // Smooth scroll to application form
    document.querySelector('#apply')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bdir-section" id="network">
      <div className="container">
        {/* Header */}
        <div className="bdir-header">
          <span className="eyebrow">MALDA DISTRICT COVERAGE</span>
          <h2 className="section-title">All 15 Blocks &amp; Gram Panchayats (G.P.)</h2>
          <p className="section-subtitle">
            Click on any block below to see all authorized Gram Panchayats and local dealer coverage across Malda district.
          </p>

          {/* Search Bar */}
          <div className="bdir-search-wrap">
            <svg className="bdir-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="bdir-search-input"
              placeholder="Search Gram Panchayat or Block (e.g. Samsi, Sujapur, Milki, Kahala...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="bdir-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* If Search is active */}
        {searchResults !== null ? (
          <div className="bdir-search-results">
            <div className="bdir-results-bar">
              <span>
                Found <strong>{searchResults.length}</strong> Gram Panchayat{searchResults.length === 1 ? '' : 's'} matching "{searchQuery}"
              </span>
              <button type="button" className="bdir-clear-link" onClick={() => setSearchQuery('')}>
                Show All Blocks
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="bdir-empty-state">
                <p>No Gram Panchayat found matching "{searchQuery}".</p>
                <button type="button" className="btn-outline btn-sm" onClick={() => setSearchQuery('')}>
                  View All 15 Blocks
                </button>
              </div>
            ) : (
              <div className="bdir-gp-grid">
                {searchResults.map((item, idx) => (
                  <div key={`${item.block}-${item.gp}-${idx}`} className="bdir-gp-card">
                    <div className="bdir-gp-card__top">
                      <span className="bdir-gp-num">#{item.serial}</span>
                      <span className="bdir-gp-badge">DEALER</span>
                    </div>
                    <h4 className="bdir-gp-name">{item.gp}</h4>
                    <div className="bdir-gp-block-tag">
                      <span>Block: <strong>{item.block}</strong></span>
                    </div>
                    {item.dealers.length > 0 && (
                      <div className="bdir-gp-dealer-hint">
                        <span>👤 {item.dealers[0].name}</span>
                        <a href={`tel:${item.dealers[0].contact}`} className="bdir-gp-call">
                          📞 {item.dealers[0].contact}
                        </a>
                      </div>
                    )}
                    <button
                      type="button"
                      className="bdir-gp-apply-btn"
                      onClick={() => handleApplyClick(item.block, item.gp)}
                    >
                      Apply for this G.P. →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Normal Block Navigation &
          all the gp should be  affected by the  ain a
          GP Listing */
          <div className="bdir-main">
            {/* 15 Blocks Interactive Tabs */}
            <div className="bdir-blocks-pills" role="tablist" aria-label="Malda Blocks">
              {MALDA_BLOCKS_DATA.map((block, idx) => {
                const isActive = block.id === currentBlock.id;
                return (
                  <button
                    key={block.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`bdir-block-pill ${isActive ? 'bdir-block-pill--active' : ''}`}
                    onClick={() => setSelectedBlockId(block.id)}
                  >
                    <span className="bdir-pill-num">{idx + 1}.</span>
                    <span className="bdir-pill-name">{block.name}</span>
                    <span className="bdir-pill-count">{block.gps.length} GP</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Block Details & GP Showcase */}
            <div className="bdir-block-panel">
              <div className="bdir-panel-header">
                <div className="bdir-panel-title-wrap">
                  <div className="bdir-panel-tag">SELECTED BLOCK</div>
                  <h3 className="bdir-panel-title">{currentBlock.name}</h3>
                  <p className="bdir-panel-sub">
                    {currentBlock.gps.length} Gram Panchayats &bull; Authorized Trimurti Solar Systems Dealer Coverage
                  </p>
                </div>

                {/* District Head / Block Dealer Banner */}
                <div className="bdir-dealer-box">
                  <div className="bdir-dealer-box__head">
                    <span className="bdir-dealer-tag">AUTHORITY</span>
                    <span className="bdir-head-name">{DISTRICT_HEAD.name}</span>
                    <span className="bdir-head-role">Head of Malda District</span>
                  </div>
                  {blockDealers.length > 0 && (
                    <div className="bdir-block-dealers-list">
                      {blockDealers.map((d, dIdx) => (
                        <div key={dIdx} className="bdir-dealer-item">
                          <div>
                            <strong>{d.name}</strong>
                            <span className="bdir-item-role">{d.designation}</span>
                          </div>
                          <a href={`tel:${d.contact}`} className="bdir-dealer-tel">
                            📞 {d.contact}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gram Panchayats Grid */}
              <div className="bdir-gp-section">
                <div className="bdir-gp-section-title">
                  <span>Gram Panchayats (G.P.) in <strong>{currentBlock.name}</strong>:</span>
                  <span className="bdir-gp-counter">{currentBlock.gps.length} Total</span>
                </div>

                <div className="bdir-gp-grid">
                  {currentBlock.gps.map((gpName, idx) => (
                    <div key={gpName} className="bdir-gp-card">
                      <div className="bdir-gp-card__top">
                        <span className="bdir-gp-num">#{idx + 1}</span>
                        <span className="bdir-gp-badge">DEALER</span>
                      </div>
                      <h4 className="bdir-gp-name">{gpName}</h4>
                      <p className="bdir-gp-sub">Gram Panchayat &bull; {currentBlock.name}</p>
                      
                      <button
                        type="button"
                        className="bdir-gp-apply-btn"
                        onClick={() => handleApplyClick(currentBlock.name, gpName)}
                      >
                        Apply for {gpName} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
