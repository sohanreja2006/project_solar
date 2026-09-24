import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Hero from '../components/Hero';
import WhySolar from '../components/WhySolar';
import SolarSystems from '../components/SolarSystems';
import HowItWorks from '../components/HowItWorks';
import Distributor from '../components/Distributor';
import DealerContact from '../components/DealerContact';
import FinalCTA from '../components/FinalCTA';
import './Home.css';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="home-page">
      <Hero />
      <WhySolar />
      
      {/* Solar Systems */}
      <SolarSystems />

      {/* Quick Calculator Teaser Banner */}
      <section className="calc-teaser">
        <div className="container">
          <div className="calc-teaser__card">
            <div className="calc-teaser__content">
              <span className="section-label">{t.calculator.badge}</span>
              <h3 className="calc-teaser__title">{t.calculator.title}</h3>
              <p className="calc-teaser__desc">{t.calculator.subtitle}</p>
            </div>
            <Link to="/calculator" className="calc-teaser__btn" id="home-calc-link-btn">
              <span>⚡ {t.calculator.recSystem} →</span>
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Distributor />
      <DealerContact />
      <FinalCTA />
    </div>
  );
}
