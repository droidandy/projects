import getLocationDataByIP from "@Core/api/ip-api";
let locationDataSingleton;

export const setLocation = (props): ipAPI.ILocationData => {
  locationDataSingleton = props;
  return locationDataSingleton;
};

export const getLocation = async (
  attemptToIdentifyByIP = true
): Promise<ipAPI.ILocationData | null> => {
  if (locationDataSingleton) return locationDataSingleton;

  if (attemptToIdentifyByIP) {
    const data = await getLocationDataByIP();
    if (!data) return null;

    setLocation(data);
    return data;
  }

  return null;
};

export const get = getLocation;
