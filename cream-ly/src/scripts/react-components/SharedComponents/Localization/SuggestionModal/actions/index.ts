import * as UserPreferences from "@Core/app/user/preferences";
import store from "@Core/redux";
import regionConfig from '@Core/app/regions/config';
import { redirectIfNeeded } from '@Core/app/localization'
import actionSaveUserPreferences from '../../PreferencesModal/sections/Form/actions/actionSaveUserPreferences';

export const checkIfWasRejected = () => {
  try {
    const isSaveDefaultRegionRejected =
      sessionStorage.getItem("isSaveDefaultRegionRejected") || null;
    return JSON.parse(isSaveDefaultRegionRejected) || false;
  } catch (err) {
    return false;
  }
};

export const onClose = () => {
  sessionStorage.setItem("isSaveDefaultRegionRejected", "true");
};

const checkIfLangForRegionExist = (lang: string, regionCode: string) =>
  regionConfig[regionCode] && regionConfig[regionCode].languages.includes(lang);

export const saveLocalizationSetting = (lang: string) => {
  sessionStorage.removeItem("isSaveDefaultRegionRejected");

  const { localizationSettings } = store.getState().app;
  const { regionCode, languageCode, currencyCode } = localizationSettings;

  const isLangExistForRegion = checkIfLangForRegionExist(lang, regionCode);

  if (languageCode && lang && isLangExistForRegion && lang !== languageCode) {
    actionSaveUserPreferences(regionCode, currencyCode, lang);
  } else {
    store.dispatch({
      type: "ACTION_IS_REGION_SELECTED",
      isSelectedByUser: true,
    });
    UserPreferences.setPreference("regionCode", regionCode, true);
  }
};

export const redirectToDefaultRegion = (lang: string, autoMatchedRegion) => {
  sessionStorage.removeItem("isSaveDefaultRegionRejected");
  const { localizationSettings } = store.getState().app;
  const { languageCode, currencyCode } = localizationSettings;

  const newLanguageCode = checkIfLangForRegionExist(lang, autoMatchedRegion)
    ? lang
    : languageCode;

  const newSettings = {
    languageCode: newLanguageCode,
    currencyCode,
    regionCode: autoMatchedRegion,
  };

  // before redirect save in LS that regioncode is selected by user
  UserPreferences.setPreference("regionCode", autoMatchedRegion, true);

  redirectIfNeeded(
    languageCode,
    currencyCode,
    window.location.hostname, // current hostname
    window.location.href, // currentURL,
    newSettings,
  );
};

export default {
  checkIfWasRejected,
  onClose,
  saveLocalizationSetting,
  redirectToDefaultRegion,
};
