import { useEffect, useRef, useState } from 'react';

/**
 * Aylantirganda paydo bo'lish (kutubxonasiz).
 *
 * `IntersectionObserver` bo'lmasa (juda eski brauzer) element darhol
 * ko'rinadigan qilib belgilanadi — matn hech qachon yo'qolmaydi.
 */
export function useReveal({ threshold = 0.12, rootMargin = '0px 0px -8% 0px', delay = 0 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (delay) el.style.transitionDelay = `${delay}ms`;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          setVisible(true);
          observer.unobserve(entry.target);
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  return [ref, visible];
}

export default useReveal;
