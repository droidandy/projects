import "core-js/stable";
import "core-js/stable/string";
import "core-js/stable/array";

import "regenerator-runtime/runtime";

import "../../../../styles/theme.scss";

import LocalizationInitOrRedirect from "@Core/app/localization";
import { isURLChangeRequested } from "@Core/app/init/localizationURLCheckParams";
import { setFulfillmentCountryCode } from "@Core/products/fulfillmentLocation";
import { setShopifyCartLanguageIfNeeded } from "@Core/api/shopify.cart/attributes";

import "../../../vendors/fontawesome";

document.documentElement.className = document.documentElement.className.replace(
  "no-js",
  "js"
);
if ("ontouchstart" in document) {
  const body = document.getElementsByTagName("BODY")[0];
  body.className = body.className.replace("no-touch", "touch"); // needed for hover logic reduction in touch devices
}

const getCurrentLocaleRoot = () => {
  //https://shopify.dev/docs/themes/liquid/reference/objects/shop-locale

  const root = window.locale && window.locale.root ? window.locale.root : "/";

  return root;
};

const initApplication = async () => {
  isInitiated = true;

  const currentCurrencyCode = window.theme.currency.code
    ? window.theme.currency.code
    : "EUR";

  const { isReloadNeeded, newURL } = await isURLChangeRequested(
    window.location,
    currentCurrencyCode
  );
  console.log(newURL);
  if (isReloadNeeded) return;

  const defaultDataIfLocationDataIsNotRecived = {
    countryCode: getDefaultCountryCode(window.location.hostname),
  };
  const locationData = await LocalStorage.getLocation()
    .catch(() => {
      return defaultDataIfLocationDataIsNotRecived;
    })
    .finally((data) => (data ? data : defaultDataIfLocationDataIsNotRecived));

  const settings = await LocalizationInitOrRedirect(
    window.navigator,
    window.locale.iso_code ? window.locale.iso_code : "ru", //currentLanguageCode
    currentCurrencyCode, //currentCurrencyCode
    window.location.hostname, //currentHost
    window.location.href, //currentURL
    locationData.countryCode //countryCodeBasedOnIPLocation
  );

  if (!settings) return; //perform redirect

  setShopifyCartLanguageIfNeeded(settings.languageCode);
};
