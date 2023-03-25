import Config from 'react-native-config';
import { throttle, has } from 'lodash';

export function formatPrice(value, currency, type = 'string') {
  const formattedValue = (value / 100).toFixed(2);

  const toReturn = {
    string: `${currency}${formattedValue}`,
    object: { currency, value, formattedValue }
  };

  return toReturn[type];
}

export const getFormatPrice = price => price && formatPrice(price, '£');

export function throttledAction(fn) {
  return throttle(fn, 1000, { trailing: false });
}

export const filterBySearchValue = (array, params, searchValue) => {
  const searchValues = searchValue.toLowerCase().split(' ').filter(Boolean);

  return array.filter((item) => {
    let itemString = params.map(param => item[param]).join(' ').toLowerCase();

    return searchValues.every((value) => {
      const formattedValue = value.trim();
      const includes = itemString.includes(formattedValue);

      if (includes) itemString = itemString.replace(formattedValue, '').trim();

      return includes;
    });
  });
};

export const isDevMode = has(Config, 'ENV') ? Config.ENV === 'development' : process.env.NODE_ENV === 'development';

export function prepareName({ firstName = '', lastName = '' }) {
  return `${firstName} ${lastName}`;
}

export function prepareInitials({ firstName = '', lastName = '' }) {
  return `${(firstName).charAt(0)}${(lastName).charAt(0)}`.toUpperCase();
}

export function formatPhoneNumber(number) {
  return number ? `+${number.replace(/\D/g, '')}` : '';
}

export function pickWithDefault(obj, paths, value = undefined) {
  return paths.reduce((a, c) => ({ ...a, [c]: obj[c] || value }), {});
}

export function formatETA(eta) {
  const time = eta ? `~ ${eta}` : 'N/A';
  return `${time} min`;
}
