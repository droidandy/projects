const locale = 'ru-RU';

export const DecimalFormatter = new Intl.NumberFormat(locale);
export const CurrencyFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'RUB' });

export const formatNumber = (value: number) => DecimalFormatter.format(value);
export const formatCurrency = (value: number) => CurrencyFormatter.format(value);
