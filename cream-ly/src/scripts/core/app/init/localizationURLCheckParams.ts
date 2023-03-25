import trimEnd from "lodash/trimEnd";
import { setPreference, getPreference } from "@Core/app/user/preferences";
import { setCurrency } from "@Core/api/shopify.cart/currency";
import * as Router from "@Core/app/router";

interface IProps {
  isReloadNeeded: boolean;
  newURL: string;
}

const LOCALIZATION_PARAMS = ["currencyCode", "regionCode", "lang"];

export const isURLChangeRequested = async (
  urlData: app.IURLData,
  currentCurrencyCode: string
): Promise<IProps> => {
  const params = new URLSearchParams(trimEnd(urlData.search, "/"));
  const newURL = getURLWithoutParams(urlData.href);

  let isReloadNeeded = false;

  const regionCodeRequest = params.get("regionCode");
  if (regionCodeRequest) {
    setPreference("regionCode", String(regionCodeRequest).toUpperCase(), true);
  }

  const newLangRequest = params.get("lang");
  if (newLangRequest && newLangRequest != getPreference("languageCode").value) {
    setPreference("languageCode", String(newLangRequest).toLowerCase(), true);
    isReloadNeeded = true;
  }

  const currencyCodeRequest = params.get("currencyCode");
  if (currencyCodeRequest) {
    if (currentCurrencyCode != currencyCodeRequest) {
      setPreference(
        "currencyCode",
        String(currencyCodeRequest).toUpperCase(),
        true
      );

      isReloadNeeded = true;

      await setCurrency(currencyCodeRequest);
    }
  }

  const urlWithSlash = newURL.endsWith("/") ? newURL : `${newURL}/`;

  if (isReloadNeeded) {
    Router.goTo(urlWithSlash, false, true);
  } else {
    if (urlData.href != urlWithSlash) historyReplace(urlWithSlash);
  }

  return { isReloadNeeded, urlWithSlash };
};

const getURLWithoutParams = (currentURL) => {
  const urlObject = new URL(currentURL);

  LOCALIZATION_PARAMS.map((paramToRemove) => {
    if (urlObject.searchParams.has(paramToRemove))
      urlObject.searchParams.delete(paramToRemove);
  });

  return urlObject.href;
};

const historyReplace = (newURL) => {
  window.history.replaceState("", "", newURL);
};
