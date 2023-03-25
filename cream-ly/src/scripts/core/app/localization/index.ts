//@ts-nocheck
import * as RegionsConfig from "@Core/app/regions";
import * as UserPreferences from "@Core/app/user/preferences";
import * as Router from "@Core/app/router";
import { getLanguageCodes as getBrowserLanguageCodes } from "@Core/app/user/browserSettings";
import { getCodeForCountry } from "@Core/app/currency";
import * as ShopifyCartCurrency from "@Core/api/shopify.cart/currency";

export interface LocalizationSettings {
  regionCode: string;
  languageCode: string;
  currencyCode: string;
  fulfillmentCode?: string;
}

export default async (
  windowNavigator,
  currentLanguageCode,
  currentCurrencyCode,
  currentHost,
  currentURL,
  countryCodeBasedOnIPLocation
) => {
  console.log(
    "initial settings",
    windowNavigator,
    currentLanguageCode,
    currentCurrencyCode,
    currentHost,
    currentURL,
    countryCodeBasedOnIPLocation
  );

  const newSettings: LocalizationSettings = getLocalizatonSettings(
    windowNavigator,
    currentLanguageCode,
    currentCurrencyCode,
    currentHost,
    countryCodeBasedOnIPLocation
  );

  console.log("new settings", newSettings);

  const isGoogleBot = Router.isGoogleBot(windowNavigator.userAgent);
  if (isGoogleBot) return newSettings;

  const isRedirect: boolean = await redirectIfNeeded(
    currentLanguageCode,
    currentCurrencyCode,
    currentHost,
    currentURL,
    newSettings
  );

  return isRedirect ? null : newSettings;
};

export const getLocalizatonSettings = (
  windowNavigator,
  currentLanguageCode,
  currentCurrencyCode,
  currentHost,
  countryCodeBasedOnIPLocation
): LocalizationSettings => {
  const region = identifyRegion(currentHost, countryCodeBasedOnIPLocation);

  const languageCode = identifyLanguageCode(
    region.languages,
    currentLanguageCode,
    windowNavigator
  );

  const currencyCode = identifyCurrencyCode(
    region.allowedCurrencies,
    currentCurrencyCode,
    countryCodeBasedOnIPLocation
  );

  const fulfillmentCode = region.fulfillmentCode;

  return {
    regionCode: region.regionCode,
    languageCode,
    currencyCode,
    fulfillmentCode,
  };
};

export const redirectIfNeeded = async (
  currentLanguageCode: string,
  currentCurrencyCode: string,
  currentHost: string,
  currentURL: string,
  newSettings: LocalizationSettings
): boolean => {
  const redirectHost = getRedirectDomainIfRegionRequires(
    currentHost,
    newSettings
  );

  if (
    redirectHost ||
    currentCurrencyCode != newSettings.currencyCode ||
    currentLanguageCode != newSettings.languageCode
  ) {
    if (!redirectHost && currentCurrencyCode != newSettings.currencyCode) {
      await ShopifyCartCurrency.setCurrency(newSettings.currencyCode);
    }

    Router.reloadWithNewLocalizationSettings(
      currentURL,
      redirectHost,
      newSettings.languageCode,
      redirectHost ? newSettings.currencyCode : null, //to avoid second reload
      redirectHost ? newSettings.regionCode : null
    );
    return true;
  }

  return false;
};

export const getRegionDomain = (regionCode) => {
  const region = RegionsConfig.getRegionByCode(regionCode);
  return region.defaultDomain;
};

export const getRedirectDomainIfRegionRequires = (
  currentHost: string,
  localizationSettings: LocalizationSettings
): string | null => {
  const nonRedirectHosts = ["localhost"];
  const DEFAULT_DOMAIN = "cream.ly";

  if (nonRedirectHosts.includes(currentHost)) return null;

  const regionDomain = getRegionDomain(localizationSettings.regionCode);

  if (regionDomain && regionDomain != currentHost) return regionDomain;
  if (!regionDomain && currentHost != DEFAULT_DOMAIN) return DEFAULT_DOMAIN;
  return null;
};

export const identifyRegion = (
  host: string,
  countryCode: string
): RegionsConfig.ConfigRegionsList => {
  //if userPreference.regionCode is assigned and allowed use it
  const userPreferredRegionCode = UserPreferences.getPreference(
    UserPreferences.KEY_REGION
  );
  if (userPreferredRegionCode && userPreferredRegionCode.value) {
    const region = RegionsConfig.getRegionByCode(userPreferredRegionCode.value);
    if (!region)
      throw Error(
        "no region is found for regionCode " + userPreferredRegionCode.value
      );
    return region;
  }

  //if there is a matchingDomain for region - use it
  const regionWithMatchingDomain = RegionsConfig.getRegionMatchingDefaultDomain(
    host
  );
  if (regionWithMatchingDomain) return regionWithMatchingDomain;

  //if countryCode is matcing for region - use it
  const regionWithMatchingCountryCode = RegionsConfig.getRegionMatchingCountryCode(
    countryCode
  );
  if (regionWithMatchingCountryCode) return regionWithMatchingCountryCode;

  //otherwise use default region code
  return RegionsConfig.getDefaultRegion();
};

export const identifyLanguageCode = (
  allowedLanguages: Array<string>,
  currentLanguageCode: string,
  navigator: object
) => {
  /* if (allowedLanguages.includes(currentLanguageCode))
    return currentLanguageCode; */

  //if userPreference.languageCode is assigned and allowed - use it
  const userPreferredLanguageCode = UserPreferences.getPreference(
    UserPreferences.KEY_LANGUAGE
  );

  //console.log("userPreferredLanguageCode", userPreferredLanguageCode);

  if (
    userPreferredLanguageCode &&
    userPreferredLanguageCode.value &&
    allowedLanguages.includes(userPreferredLanguageCode.value)
  )
    return userPreferredLanguageCode.value;

  //If browser lang is in allowed list use it
  const browserLanguagesList = getBrowserLanguageCodes(navigator);
  const intersection = browserLanguagesList.filter((lang) =>
    allowedLanguages.includes(lang)
  );
  //console.log("browserLanguagesList", browserLanguagesList, intersection);

  if (intersection.length) return intersection[0];

  //otherwise use first allowed lang
  return allowedLanguages[0];
};

export const identifyCurrencyCode = (
  allowedCurrencies: Array<string>,
  currentCurrencyCode: string,
  countryCode: string
): string => {
  //if userPreference.currencyCode is assigned and allowed use it
  const userPreferredCurrencyCode = UserPreferences.getPreference(
    UserPreferences.KEY_CURRENCY
  );
  if (
    userPreferredCurrencyCode &&
    userPreferredCurrencyCode.value &&
    allowedCurrencies.includes(userPreferredCurrencyCode.value)
  )
    return userPreferredCurrencyCode.value;

  //if countryCode matches assigne currencyCode - use it
  const currencyCodeForCountry = getCodeForCountry(countryCode);
  if (
    currencyCodeForCountry &&
    allowedCurrencies.includes(currencyCodeForCountry)
  )
    return currencyCodeForCountry;

  //otherwise use the first allowed currency
  return allowedCurrencies[0];
};
