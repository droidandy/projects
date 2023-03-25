export function phoneTrim(phone: string) {
  return phone.replace(/[^\+\d]/g, '');
}
