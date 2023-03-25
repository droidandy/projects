//@ts-nocheck

import config from "./config";
const regionsConfig: ConfigRegionsList = config;

export interface ConfigRegionsList {
  [regionCode: string]: ConfigRegion;
}

export interface ConfigRegion {
  regionCode?: string;
  default?: boolean;
  defaultDomain?: string;
  countryCodes?: Array<string>;
  fulfillmentCode: "NL" | "BY" | "UA" | "LV";
  allowedCurrencies: Array<string>;
  languages: Array<string>;
}

export const lookUpInRegionsList = (filterFunction): ConfigRegion => {
  const matchingRegions: ConfigRegionsList = Object.keys(regionsConfig)
    .map((regionCode: string): ConfigRegion => getRegionByCode(regionCode))
    .filter((region: ConfigRegion) => {
      return filterFunction(region);
    });

  return matchingRegions.length ? matchingRegions.shift() : null;
};

export const getDefaultRegion = (): ConfigRegion => {
  const filterDefault = (region: ConfigRegion) => region.default == true;
  return lookUpInRegionsList(filterDefault);
};

export const getRegionByCode = (regionCode: string): ConfigRegion | null => {
  if (regionsConfig[regionCode])
    return { ...regionsConfig[regionCode], regionCode };

  return null;
};

export const getRegionMatchingDefaultDomain = (host: string) => {
  const filterDefaultDomain = (region: ConfigRegion) =>
    region.defaultDomain == host;
  return lookUpInRegionsList(filterDefaultDomain);
};

export const getRegionMatchingCountryCode = (countryCode: string) => {
  const filterByCountryCode = (region: ConfigRegion) =>
    region.countryCodes && region.countryCodes.includes(countryCode);

  return lookUpInRegionsList(filterByCountryCode);
};

export const getRegionCodesList: Array<string> = () => {
  return Object.keys(regionsConfig);
};
