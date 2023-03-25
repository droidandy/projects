import { getFromLocalStorage, saveInLocalStorage } from "../storage";

export interface Preference {
  value: any;
  updateTime: number; //timestamp in milliseconds
  isSelectedByUser: boolean;
}

export interface UserPreferences {
  regionCode?: Preference;
  languageCode?: Preference;
  currencyCode?: Preference;
  cookies?: Preference;
}

const getDefaultValue = (key: string): string | boolean => {
  switch (key) {
    case KEY_REGION:
      return "EU";
    case KEY_LANGUAGE:
      return "ru";
    case KEY_CURRENCY:
      return "EUR";
    case KEY_COOKIES:
      return false;
  }
};

export const KEY_REGION = "regionCode";
export const KEY_LANGUAGE = "languageCode";
export const KEY_CURRENCY = "currencyCode";
export const KEY_COOKIES = "cookies";

export const PREFERENCES_KEYS = [
  KEY_REGION,
  KEY_LANGUAGE,
  KEY_CURRENCY,
  KEY_COOKIES,
];

export const getListOfPreferences = (): UserPreferences => {
  return PREFERENCES_KEYS.reduce((obj, preference) => {
    return { ...obj, [preference]: getPreference(preference) };
  }, {});
};

export const setPreference = (
  key: string,
  value: any,
  isSelectedByUser: boolean = false
) => {
  saveInLocalStorage(key, value, isSelectedByUser);
};

export const getPreference = (key: string): Preference => {
  const localStorageValue: Preference = getFromLocalStorage(key);

  return localStorageValue
    ? localStorageValue
    : {
        value: null,
        updateTime: null,
        isSelectedByUser: false,
      };
};
