// @flow
import type { Currency } from 'context/types';

export default (currency: Currency): string => {
  switch (currency) {
    case 'USD':
      return '$';

    case 'EUR':
      return '€';

    default:
      return '';
  }
};
