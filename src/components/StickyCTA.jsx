import { useEffect, useState } from 'react';
import { InstagramIcon } from './BrandIcons';
import { useLanguage } from '../i18n/useLanguage';

/**
 * Telefonda pastda turadigan tugma.
 *
 * Birinchi ekranda ko'rinmaydi (u yerda tugma allaqachon bor) va oxirgi
 * «Bog'lanish» bo'limi ekranga kirganda yashiriladi — ikkita bir xil tugma
 * yonma-yon turmasligi uchun. `body`ning pastki bo'shlig'i `index.css`da
 * berilgan, shuning uchun u matnni bosib qolmaydi.
 */
export default function StickyCTA() {
  const { tr, site } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const contact = document.getElementById('contact');

    const update = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.75;
      const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      setShow(pastHero && !atContact);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pt-3 transition-[opacity,transform] duration-400 md:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Perda yo'q: sayt bo'limlari goh qorong'i, goh qog'oz rangda bo'ladi,
          shuning uchun qora gradient yorug' bo'limda dog' bo'lib qolardi.
          Tugmaning o'z soyasi uni matndan yetarlicha ajratib turadi. */}

      <a
        href={site.contacts.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        className="btn btn-coral w-full"
      >
        <InstagramIcon size={18} />
        {tr(site.hero.primary)}
      </a>
    </div>
  );
}
