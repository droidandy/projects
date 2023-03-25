const cashFormatRegExp = new RegExp(/(\d)(?=(\d{3})+([^\d]|$))/g);
/**
 * Конвертирует число в строку формата 1 000 000,82
 * @param cash - число для форматирования
 */
export const getCashFormat = (cash: number): string => {
  const str = (Number.isInteger(cash) ? cash : cash.toFixed(2)) + '';
  return str.replace(cashFormatRegExp, '$1 ');
};
