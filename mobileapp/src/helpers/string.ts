const mailCheckRegexp = /[\da-z]+@[a-z]/;
const mailRegexp = /^[^@\s]*[^.@\s]@[^.@\s]+(?:\.[^.@\s]+)*$/;
const notNumberRegexp = /[^\d]/g;

/**
 * Различает почту от номера телефона. Правило проверки совпадает с серверным.
 * @param {string} login - почта или номер телефона
 * @returns {boolean} true, если логин является почтой и false, если логин является номером телефона
 */
export function isMail(login: string): boolean {
  return mailCheckRegexp.test(login.toLowerCase());
}

/**
 * Проверяет номер телефона на валидность.
 * @param {string} phone - номер телефона
 * @returns {boolean} валиден ли номер телефона
 */
export function isPhoneValid(phone?: string): boolean {
  // Проверяем, чтобы количество цифр в номере телефона было равно 11
  return !phone ? false : phone.replace(notNumberRegexp, '').length === 11;
}

/**
 * Проверяет почту на валидность.
 * @param {string} mail - почта
 * @returns {boolean} валидна ли почта
 */
export function isMailValid(mail = ''): boolean {
  return mailRegexp.test(mail);
}

/**
 * Проверяет логин (почту и номер телефона) на валидность.
 * @param {string} login - почта или номер телефона
 * @returns {boolean} валиден ли логин
 */
export function isLoginValid(login?: string): boolean {
  if (!login) {
    return false;
  }

  return isMail(login) ? isMailValid(login) : isPhoneValid(login);
}

/**
 * Очищает логин (почту и номер телефона) от лишних символов: возвращает почту как есть, а из
 * номера телефона удаляет все нецифровые символы.
 * @param {string} login - почта или номер телефона
 * @returns {string} очищенный логин
 */
export function clearLogin(login: string): string {
  if (isMail(login)) {
    return login;
  }

  return login.replace(notNumberRegexp, '');
}

/**
 * Убирает теги, заменяет nbsp на пробел, убирает пустоту по краям
 * @param text
 */
export function removeTags(text: string): string {
  return text
    .replace(/(<[^>]+>)/gi, '')
    .replace('&nbsp;', ' ')
    .replace(/&[a-z]+;/gi, '')
    .trim();
}
