import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/PageHeader';
import FAQ from '../components/FAQ';
import Warranty from '../components/Warranty';
import FinalCTA from '../components/FinalCTA';

export default function FAQPage() {
  const { t } = useLanguage();

  return (
    <div className="subpage faq-page">
      <PageHeader
        badge={t.faq.badge}
        title={t.faq.title}
        subtitle={t.faq.subtitle}
        breadcrumb={t.nav.faq}
      />
      <FAQ />
      <Warranty />
      <FinalCTA />
    </div>
  );
}
