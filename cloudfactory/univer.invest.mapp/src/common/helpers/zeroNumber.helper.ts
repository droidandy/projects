/**
 * Определение равенства float числа нулю
 * см. https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%88%D0%B8%D0%BD%D0%BD%D1%8B%D0%B9_%D0%BD%D0%BE%D0%BB%D1%8C
 */
export function isNumberZero(n: number) {
  return Math.abs(n) < 1E-7;
}

export function ensureNumberZero(n: number) {
  return isNumberZero(n) || !isFinite(n) ? 0 : n;
}
