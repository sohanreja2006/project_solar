import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WhatsAppFloat.css';

const WHATSAPP_LINK = 'https://wa.me/917001516219?text=Hi%2C%20I%20am%20interested%20in%20rooftop%20solar%20for%20my%20home%20in%20Malda.';

export default function WhatsAppFloat() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stop pulse after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-float ${visible ? 'whatsapp-float--visible' : ''} ${pulse ? 'whatsapp-float--pulse' : ''}`}
      aria-label="Chat on WhatsApp"
      title={t.whatsappFloat?.tooltip || 'WhatsApp'}
      id="whatsapp-float-btn"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M16.004 0C7.163 0 .004 7.159.004 15.999c0 2.82.736 5.573 2.137 7.998L.017 32l8.22-2.156A15.948 15.948 0 0 0 16.004 32C24.844 32 32 24.841 32 16.001 32 7.159 24.844 0 16.004 0zm0 29.377a13.36 13.36 0 0 1-7.211-2.102l-.517-.307-5.359 1.405 1.428-5.217-.336-.535A13.334 13.334 0 0 1 2.636 16C2.636 8.619 8.622 2.633 16.004 2.633c7.381 0 13.367 5.986 13.367 13.367 0 7.382-5.986 13.377-13.367 13.377zm7.331-10.009c-.402-.201-2.379-1.174-2.748-1.308-.37-.134-.639-.201-.908.201-.268.402-1.04 1.308-1.274 1.576-.235.268-.469.302-.871.101-.402-.201-1.697-.625-3.233-1.994-1.195-1.065-2.001-2.381-2.236-2.783-.235-.402-.025-.619.177-.819.181-.181.402-.469.603-.704.201-.235.268-.402.402-.67.134-.268.067-.503-.034-.704-.101-.201-.908-2.188-1.243-2.995-.327-.786-.66-.68-.908-.692-.235-.012-.503-.014-.771-.014-.268 0-.704.101-1.073.503-.37.402-1.408 1.376-1.408 3.356 0 1.98 1.442 3.893 1.643 4.161.201.268 2.836 4.332 6.873 6.073.961.415 1.711.662 2.296.848.965.307 1.843.264 2.538.16.774-.116 2.379-.973 2.714-1.912.335-.94.335-1.744.235-1.912-.101-.168-.37-.268-.771-.469z"/>
      </svg>
      <span className="whatsapp-float__label">{t.nav?.whatsapp || 'WhatsApp'}</span>
    </a>
  );
}
