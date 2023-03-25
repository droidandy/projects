//@ts-nocheck

import * as LocalStorage from "@Core/app/user/storage";
import * as Regions from "@Core/app/regions";

export default async (hostname) => {
  const defaultDataIfLocationDataIsNotRecived: app.ILocation = {
    countryCode: getDefaultCountryCodeFromHost(hostname),
    status: "fail",
  };
  return LocalStorage.getLocation()
    .catch(() => {
      return defaultDataIfLocationDataIsNotRecived;
    })
    .finally((data) => (data ? data : defaultDataIfLocationDataIsNotRecived));
};

export const getDefaultCountryCodeFromHost = (hostname: string): string => {
  const matchingRegion = Regions.getRegionMatchingDefaultDomain(hostname);
  return matchingRegion ? matchingRegion.regionCode : "NL";
};
