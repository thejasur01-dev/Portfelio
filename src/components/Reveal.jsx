import { useReveal } from '../hooks/useReveal';

/**
 * Aylantirganda yumshoq paydo bo'ladigan o'rov.
 *
 *   <Reveal delay={120}>…</Reveal>
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div', ...rest }) {
  const [ref, visible] = useReveal({ delay });

  return (
    <Tag ref={ref} className={`reveal ${className} ${visible ? 'is-visible' : ''}`} {...rest}>
      {children}
    </Tag>
  );
}
