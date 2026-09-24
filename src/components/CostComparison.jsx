import { useLanguage } from '../context/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import './CostComparison.css';

export default function CostComparison() {
  const { t } = useLanguage();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const rows = [
    { label: t.comparison.row1Label, grid: t.comparison.row1Grid, solar: t.comparison.row1Solar, positive: true },
    { label: t.comparison.row2Label, grid: t.comparison.row2Grid, solar: t.comparison.row2Solar, positive: true },
    { label: t.comparison.row3Label, grid: t.comparison.row3Grid, solar: t.comparison.row3Solar, positive: true },
    { label: t.comparison.row4Label, grid: t.comparison.row4Grid, solar: t.comparison.row4Solar, positive: true },
    { label: t.comparison.row5Label, grid: t.comparison.row5Grid, solar: t.comparison.row5Solar, positive: true },
  ];

  return (
    <section className="comparison" id="comparison">
      <div className="container">
        <div ref={ref} className={`comparison__inner reveal ${isVisible ? 'reveal--visible' : ''}`}>
          
          <div className="comparison__header">
            <span className="section-label">{t.comparison.badge}</span>
            <h2 className="section-title">{t.comparison.title}</h2>
            <p className="section-subtitle">
              {t.comparison.subtitle}
            </p>
          </div>

          <div className="comparison__table-wrap">
            {/* Headers */}
            <div className="comparison__cols-header">
              <div className="comparison__col-head comparison__col-head--grid">
                <div className="comparison__head-icon">❌</div>
                <h3 className="comparison__head-title">{t.comparison.gridTitle}</h3>
                <p className="comparison__head-sub">{t.comparison.gridSub}</p>
              </div>

              <div className="comparison__vs-badge" aria-hidden="true">
                <span>{t.comparison.vsTag}</span>
              </div>

              <div className="comparison__col-head comparison__col-head--solar">
                <div className="comparison__head-badge">Recommended</div>
                <div className="comparison__head-icon">☀️</div>
                <h3 className="comparison__head-title">{t.comparison.solarTitle}</h3>
                <p className="comparison__head-sub">{t.comparison.solarSub}</p>
              </div>
            </div>

            {/* Rows */}
            <div className="comparison__rows">
              {rows.map((r, i) => (
                <div className="comparison__row" key={i}>
                  <div className="comparison__cell comparison__cell--grid">
                    <span className="comparison__cell-icon">❌</span>
                    <div>
                      <span className="comparison__cell-label">{r.label}</span>
                      <p className="comparison__cell-val">{r.grid}</p>
                    </div>
                  </div>

                  <div className="comparison__row-label">
                    <span>{r.label}</span>
                  </div>

                  <div className="comparison__cell comparison__cell--solar">
                    <span className="comparison__cell-icon">✅</span>
                    <div>
                      <span className="comparison__cell-label">{r.label}</span>
                      <p className="comparison__cell-val">{r.solar}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Banner */}
            <div className="comparison__banner">
              <p>{t.comparison.bottomBanner}</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
