const Intl = process.browser ? window.Intl : global.Intl;

const numberFormatter = new Intl.NumberFormat();

const ratingFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const priceFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatNumber = (...args) => numberFormatter.format(...args);
export const formatRating = (...args) => ratingFormatter.format(...args);
export const formatPrice = (...args) => priceFormatter.format(...args);
export const formatPercent = (...args) => percentFormatter.format(...args);
