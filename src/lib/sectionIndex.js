import settings from '../data/settings.json';

/**
 * Bo'lim raqami (01, 02, ...).
 *
 * Raqamlar qo'lda yozilmaydi: admin panelda biror bo'lim o'chirilsa,
 * qolganlari o'zi qayta sanaladi va 01-02-04 kabi uzilish bo'lmaydi.
 */
const ORDER = ['problem', 'work', 'features', 'reviews', 'process', 'pricing', 'faq'];

const visible = ORDER.filter((id) => settings.sections?.[id]);

export const sectionIndex = (id) => {
  const place = visible.indexOf(id);
  return place === -1 ? '' : String(place + 1).padStart(2, '0');
};

export default sectionIndex;
