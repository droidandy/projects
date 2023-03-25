//@ts-nocheck
import getLocationFromStorageOrIP from "./location";
import getLanguageFromStorage from "../preferences/language";

export const KEY_PREFIX = "creamly.app.user.";
export const KEY_LOCATION = "creamly.app.user.location";
export const KEY_LANGUAGE = "creamly.app.user.lang";

export const getLocation = async () => {
  return getLocationFromStorageOrIP();
};

export const getCountryCode = (): string => {
  const locationData = getLocation();
  return locationData && locationData.countryCode
    ? locationData.countryCode
    : null;
};

export const getLanguage = (newLang = null) => {
  return getLanguageFromStorage(newLang);
};

export const getKeyForLocalStorage = (key) => {
  return KEY_PREFIX + key;
};

export const saveInLocalStorage = (key, value, isSelectedByUser = false) => {
  const objectToSave = {
    updateTime: Date.now(),
    value,
    isSelectedByUser,
  };

  const fullKey = getKeyForLocalStorage(key);

  localStorage.setItem(fullKey, JSON.stringify(objectToSave));
};

export const getFromLocalStorage = (key) => {
  const fullKey = getKeyForLocalStorage(key);

  const storedObject = localStorage.getItem(fullKey);
  if (!storedObject) return null;

  let parsedObject = null;
  try {
    parsedObject = JSON.parse(storedObject);
  } catch (e) {
    return null;
  }

  if (!parsedObject || !parsedObject.updateTime || !parsedObject.value)
    return null;

  return parsedObject;
};

export const getFromStorageOrLoadAPI = async (
  key: string,
  apiCallPromise: Promise,
  maxTimeToStoreInMinutes?: number | null = null
) => {
  const storedValue = getFromLocalStorage(key);
  if (
    storedValue &&
    isStorageWithinMaxLimit(storedValue.updateTime, maxTimeToStoreInMinutes)
  )
    return storedValue.value;

  const apiCallResult = await apiCallPromise();
  if (!apiCallResult) throw Error("no results from api call to store");

  saveInLocalStorage(key, apiCallResult);
  return apiCallResult;
};

export const isStorageWithinMaxLimit = (
  timeStampOfStoredValue: numer,
  maxTimeToStoreInMinutes: number | null
) => {
  if (maxTimeToStoreInMinutes === null) return true;

  return (
    Date.now() - timeStampOfStoredValue < maxTimeToStoreInMinutes * 1000 * 60
  );

  //check for manipulation with timestamp in the future
  //Date.now() - parsedLocation.time < 0
};
