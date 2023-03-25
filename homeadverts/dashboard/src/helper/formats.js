export const roomDateFormat = {
  lastDay: 'ddd',
  sameDay: 'HH:mm',
  sameElse: 'DD.MM.YYYY',
  nextDay: 'ddd',
  lastWeek: 'ddd',
  nextWeek: 'ddd',
};

export const dateFormatMessage = {
  lastDay: '[Yesterday] [at] LT',
  sameDay: 'LT',
  lastWeek: 'dddd [at] LT',
  nextWeek: 'dddd [at] LT',
  sameElse: 'LL [at] LT',
};

export const formatPrice = (number, currency) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  return formatter.format(number);
};
