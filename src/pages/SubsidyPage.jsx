import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/PageHeader';
import SubsidyEMI from '../components/SubsidyEMI';
import SurplusElectricity from '../components/SurplusElectricity';
import FinalCTA from '../components/FinalCTA';

export default function SubsidyPage() {
  const { t } = useLanguage();

  return (
    <div className="subpage subsidy-page">
      <PageHeader
        badge={t.subsidy.badge}
        title={t.subsidy.title}
        subtitle={t.subsidy.subtitle}
        breadcrumb={t.nav.subsidy}
      />
      <SubsidyEMI />
      <SurplusElectricity />
      <FinalCTA />
    </div>
  );
}
