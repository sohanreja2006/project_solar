import { useLanguage } from '../context/LanguageContext';
import './LanguageSwitcher.css';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'bn', label: 'বাংলা', short: 'বাংলা' },
  { code: 'hi', label: 'हिंदी', short: 'हिंदी' },
];

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`lang-switcher ${className}`} role="group" aria-label="Language Selector">
      {LANGUAGES.map((item) => {
        const isActive = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            className={`lang-btn ${isActive ? 'lang-btn--active' : ''}`}
            onClick={() => setLang(item.code)}
            aria-pressed={isActive}
            title={item.label}
          >
            <span className="lang-btn__label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
