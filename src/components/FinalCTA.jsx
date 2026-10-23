import './FinalCTA.css';

export default function FinalCTA() {
  return (
    <section className="final-cta" id="final-cta">
      <div className="final-cta__bg">
        <img
          src="/images/sunset-cta.jpg"
          alt="Rooftop solar panels at golden sunset — Malda"
          className="final-cta__bg-img"
        />
        <div className="final-cta__overlay"></div>
      </div>

      <div className="container final-cta__content">
        <div className="final-cta__text">
          <h2 className="final-cta__title">Your Roof Can Do More.</h2>
          <p className="final-cta__sub">Start generating your own electricity with solar.</p>
        </div>
      </div>
    </section>
  );
}
