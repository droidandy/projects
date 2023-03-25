import { setLang } from "@Core/redux/lang";
import { setFulfillmentCountryCode } from "@Core/products/fulfillmentLocation";
import store from "@Core/redux";

import { getFromStorageOrLoadAPI } from "@Core/app/user/storage";
import * as UserPreferences from "@Core/app/user/preferences";
import getPricesPairs from "@Core/api/shopify.storefront/products/getPricesInCurrency";
import { getOutOfStockData } from "@Core/api/creamly.firebase";

import loadCartData from "@Core/app/init/cart";
import loadArticles from "@Core/app/init/blog";

export const convertBYNCurrency = (
  skuPricesPairs,
  currencyCode,
  currencyExchangeBYN
) => {
  if (currencyCode != "BYN") return skuPricesPairs;

  const convertedSkuPricePairs = {};
  Object.keys(skuPricesPairs).map((sku) => {
    convertedSkuPricePairs[sku] = Math.ceil(
      skuPricesPairs[sku] * currencyExchangeBYN
    );
  });
  return convertedSkuPricePairs;
};

export const getSKUPrices = async (currencyCode, currencyExchangeBYN) => {
  const shopifyCurrencyCode = currencyCode === "BYN" ? "EUR" : currencyCode;

  return getFromStorageOrLoadAPI(
    `presentmentCurrency.${currencyCode}`,
    async () => {
      return getPricesPairs(shopifyCurrencyCode).then((skuPricesPairs) =>
        convertBYNCurrency(skuPricesPairs, currencyCode, currencyExchangeBYN)
      );
    },
    15
  );
};

export const getInventory = async () => {
  return getFromStorageOrLoadAPI("inventoryOutOfStock", getOutOfStockData, 10);
};

export const loadProduct = async (currencyCode, currencyExchangeBYN) => {
  const skuPricesPairs = await getSKUPrices(currencyCode, currencyExchangeBYN);
  store.dispatch({
    type: "ACTION_SET_PRODUCTS",
    currencyCode,
    currencyExchangeBYN,
    skuPricesPairs,
  });
};

export const dispatchIsRegionSelectedByUser = () => {
  const userPreferredRegionCode = UserPreferences.getPreference(
    UserPreferences.KEY_REGION
  );

  store.dispatch({
    type: "ACTION_IS_REGION_SELECTED",
    isSelectedByUser: userPreferredRegionCode.isSelectedByUser,
  });
};
export default async (locationData, settings, shopifyLocaleRoot) => {
  setLang(settings.languageCode);
  setFulfillmentCountryCode(settings.fulfillmentCode);

  store.dispatch({ type: "ACTION_SET_THEME", theme: window.theme });

  window.theme.currency.rateExchange.EUR =
    window.theme.currency.rateExchange.EUR / 100;
  store.dispatch({
    type: "ACTION_SET_CURRENCY",
    currency: {
      ...window.theme.currency,
    },
  });

  store.dispatch({
    type: "ACTION_SET_ROUTE",
    url: window.location.href,
    root: shopifyLocaleRoot,
  });

  store.dispatch({ type: "ACTION_SET_LOCATION", location: locationData });
  store.dispatch({ type: "ACTION_SET_LOCALIZATION_SETTING", settings });

  dispatchIsRegionSelectedByUser();

  await getInventory();

  await loadProduct(
    settings.currencyCode,
    window.theme.currency.rateExchange.BYN
  );

  store.dispatch({
    type: "ACTION_SET_CUSTOMER",
    customer: {
      ...window.theme.customer,
      defaultCountryCode: locationData.countryCode,
    },
  });
  store.dispatch({ type: "ACTION_SET_QUIZ", quiz: window.theme.quiz });

  loadCartData();

  loadArticles();
};
