/**
 * GitHub xatosini odam tushunadigan gapga aylantiradi.
 *
 * Xom javob (`GitHub 422: {"message":"Update is not a fast forward"...}`)
 * panelning yuqori qatorida chiqqanda hech narsa anglatmaydi va nima
 * qilishni ham aytmaydi. Bu yerda har bir holat uchun aniq keyingi qadam
 * yoziladi.
 */
export function explain(error) {
  const text = String(error?.message ?? '');

  if (/not a fast forward/i.test(text)) {
    return 'Repozitoriy shu orada o‘zgardi. Yana bir marta «Saqlash» bosing.';
  }
  if (/Bad credentials|GitHub 401/i.test(text)) {
    return 'GITHUB_TOKEN noto‘g‘ri yoki muddati tugagan. Vercel sozlamalarida yangilang.';
  }
  if (/GitHub 403/.test(text)) {
    return 'Tokenda yozish huquqi yo‘q. GitHub’da tokenga «Contents: Read and write» bering.';
  }
  if (/GitHub 404/.test(text)) {
    return 'Repozitoriy topilmadi. GITHUB_REPO «egasi/nomi» ko‘rinishida yozilganini tekshiring.';
  }
  if (/GitHub 5\d\d/.test(text)) {
    return 'GitHub javob bermayapti. Bir daqiqadan keyin qayta urinib ko‘ring.';
  }

  // «Vercel sozlamalarida ... yo'q» kabi o'z xabarlarimiz shundayligicha qoladi
  return text || 'Noma’lum xato';
}

export default explain;
