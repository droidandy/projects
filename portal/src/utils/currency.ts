import numeral from 'numeral';

export const formatCurrency = (value: string | number) => numeral(value).format('$0,0.00');
