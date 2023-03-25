//@ts-nocheck
import {
  getLocation as getLocationFromIP,
  ILocationData,
} from "@Core/location";

import { KEY_LOCATION } from ".";

/*
 * the goal is to speed up page load by storing location in browser
 * refresh of location is done every 5 min
 *
 * @TODO possible is to reload location after every browser run
 * and if location has changed than do a change
 */
export default async (): Promise<ILocationData> => {
  const locationFromStorage = getLocationFromLocalStorage();

  if (locationFromStorage && locationFromStorage.countryCode)
    return locationFromStorage;

  const locationData = await getLocationFromIP();
  if (locationData && locationData.countryCode)
    saveLocationInLocalStorage(locationData);

  return locationData;
};

export const getLocationFromLocalStorage = (): ILocationData => {
  const storedLocation = localStorage.getItem(KEY_LOCATION);
  if (!storedLocation) return;

  let parsedLocation = null;
  try {
    parsedLocation = JSON.parse(storedLocation);
  } catch (e) {
    return;
  }

  if (!parsedLocation || !parsedLocation.time || !parsedLocation.location)
    return;

  if (
    Date.now() - parsedLocation.time > 5 * 1000 * 60 ||
    Date.now() - parsedLocation.time < 0
  )
    return;

  return parsedLocation.location;
};

export const saveLocationInLocalStorage = (location: ILocationData) => {
  const objectToSave = {
    time: Date.now(),
    location,
  };

  localStorage.setItem(KEY_LOCATION, JSON.stringify(objectToSave));
};
