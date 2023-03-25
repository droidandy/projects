import * as UserPreferences from "@Core/app/user/preferences";
import * as Localization from "@Core/app/localization";
import { LocalizationSettings } from "@Core/app/localization";
import * as ShopifyCartCurrency from "@Core/api/shopify.cart/currency";
import * as Router from "@Core/app/router";
import store from "@Core/redux";

export default async (regionCode, currencyCode, languageCode) => {
  console.log("actionSave", regionCode, currencyCode, languageCode);
  const newSettings: LocalizationSettings = {
    regionCode,
    currencyCode,
    languageCode,
  };

  if (!didSettingsChanged(newSettings)) return;

  saveNewSettingsInLocalStorage(newSettings);
  await setNewCurrencyIfNeeded(newSettings);
  return redirect(newSettings);
};

const saveNewSettingsInLocalStorage = (newSettings: LocalizationSettings) => {
  UserPreferences.setPreference("regionCode", newSettings.regionCode, true);
  UserPreferences.setPreference("currencyCode", newSettings.currencyCode, true);
  UserPreferences.setPreference("languageCode", newSettings.languageCode, true);
};

const getCurrentSettings = (): LocalizationSettings => {
  const state = store.getState();
  const currentSettings: LocalizationSettings = state.app.localizationSettings;

  return currentSettings;
};

const getCurrentURL = () => {
  const state = store.getState();
  return state.app.route.url;
};

const getCurrentHost = () => {
  const state = store.getState();
  return state.app.route.hostname;
};

const didSettingsChanged = (newSettings: LocalizationSettings) => {
  const currentSettings = getCurrentSettings();
  return (
    currentSettings.currencyCode != newSettings.currencyCode ||
    currentSettings.languageCode != newSettings.languageCode ||
    currentSettings.regionCode != newSettings.regionCode
  );
};

const setNewCurrencyIfNeeded = (newSettings: LocalizationSettings) => {
  const currentSettings = getCurrentSettings();
  if (currentSettings.currencyCode == newSettings.currencyCode) return;

  return ShopifyCartCurrency.setCurrency(newSettings.currencyCode);
};

export const redirect = async (newSettings: LocalizationSettings) => {
  const redirectHost = Localization.getRedirectDomainIfRegionRequires(
    getCurrentHost(),
    newSettings
  );

  Router.reloadWithNewLocalizationSettings(
    getCurrentURL(),
    redirectHost,
    newSettings.languageCode,
    redirectHost ? newSettings.currencyCode : null, //to avoid second reload
    newSettings.regionCode
  );
  return true;
};
