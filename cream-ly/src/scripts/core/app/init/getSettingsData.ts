//@ts-nocheck
import { isURLChangeRequested } from "@Core/app/init/localizationURLCheckParams";
import LocalizationInitOrRedirect from "@Core/app/localization";

export default async (
  locationData: app.ILocation,
  currentCurrencyCode,
  shopifyLanguageCode
) => {
  const { isReloadNeeded, newURL } = await isURLChangeRequested(
    window.location,
    currentCurrencyCode
  );

  if (isReloadNeeded) {
    console.log("reloadIsNeeded. redirect after settings check to ", newURL);
    return;
  }

  const settings = await LocalizationInitOrRedirect(
    window.navigator,
    shopifyLanguageCode, //currentLanguageCode
    currentCurrencyCode, //currentCurrencyCode
    window.location.hostname, //currentHost
    window.location.href, //currentURL
    locationData.countryCode //countryCodeBasedOnIPLocation
  );

  return settings;
};
