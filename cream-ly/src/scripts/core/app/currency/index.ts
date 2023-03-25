//@ts-nocheck

import config from "./countryCodeToCurrencyCodeMapping";
const countriesMapping: ICurrencyCodeMapping = config;

export interface ICurrencyCodeMapping {
  [countryCode: string]: string;
}

export const getCodeForCountry = (countryCode: string): string | null => {
  if (countriesMapping[countryCode]) return countriesMapping[countryCode];

  return null;
};
