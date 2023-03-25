import { isNaN, isNil } from 'lodash';
import numeral from 'numeral';

const DOT_SYMBOL = '.';

type PlaidUrlParams = {
  account_id: string;
  account_mask: string;
  account_name: string;
  account_subtype: string;
  account_type: string;
  account_verification_status: string;
  institution_name: string;
  public_token: string;
};

export const getUrlParams = (search: string): PlaidUrlParams => {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const params = {};

  hashes.map((hash) => {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });

  return params as PlaidUrlParams;
};

export const isNumber = (value) =>
  // isNumber returns true for things like "", [], etc - NOT just numbers
  !isNil(value) && !isNaN(Number(value));

export const toCurrency = (value: number): string | null => (isNumber(value) ? numeral(value).format('$0,0.00') : null);

export const getValidPriceString = (price: string, value: string | number): string | undefined => {
  const strValue = `${value}`;

  if (price.length > strValue.length) {
    return strValue;
  }

  if (strValue.includes(DOT_SYMBOL)) {
    return strValue.match(/^[0-9]{1,6}\.[0-9]{0,2}/g)?.[0];
  }

  return strValue.match(/^[0-9]{0,6}/g)?.[0];
};

export const getValidPercentString = (percent: string, value: string | number): string | undefined => {
  const strValue = `${value}`;

  if (percent.length > strValue.length) {
    return strValue;
  }

  if (strValue.includes(DOT_SYMBOL)) {
    return strValue.match(/^-?[0-9]{1,3}\.[0-9]{0,2}/g)?.[0];
  }

  return strValue.match(/^-?[0-9]{0,3}/g)?.[0];
};

export const getRightFractionatedValue = (value: string | number): string | undefined =>
  value.toString().match(/^[-]?([0-9][0-9]*[.]?)?[0-9]{0,2}/g)?.[0];
