import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/PageHeader';
import SolarCalculator from '../components/SolarCalculator';
import CostComparison from '../components/CostComparison';
import FinalCTA from '../components/FinalCTA';

export default function CalculatorPage() {
  const { t } = useLanguage();

  return (
    <div className="subpage calculator-page">
      <PageHeader
        badge={t.calculator.badge}
        title={t.calculator.title}
        subtitle={t.calculator.subtitle}
        breadcrumb={t.nav.calculator}
      />
      <SolarCalculator />
      <CostComparison />
      <FinalCTA />
    </div>
  );
}
