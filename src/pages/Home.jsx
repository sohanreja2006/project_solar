import Hero from '../components/Hero';
import WhySolar from '../components/WhySolar';
import SolarSystems from '../components/SolarSystems';
import SubsidyEMI from '../components/SubsidyEMI';
import Warranty from '../components/Warranty';
import HowItWorks from '../components/HowItWorks';
import Distributor from '../components/Distributor';
import ServiceProviders from '../components/ServiceProviders';
import ApplicationForm from '../components/ApplicationForm';
import DealerContact from '../components/DealerContact';
import FinalCTA from '../components/FinalCTA';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <Hero />
      <WhySolar />
      <SolarSystems />
      <SubsidyEMI />
      <Warranty />
      <HowItWorks />
      <Distributor />
      <ServiceProviders />
      <ApplicationForm />
      <DealerContact />
      <FinalCTA />
    </div>
  );
}
