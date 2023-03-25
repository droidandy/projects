// import { getOutOfStockData } from "@Core/api/creamly.firebase";
import outOfStockConfig from "./outOfStockConfig";
import { getFulfillmentCountryCode } from "../fulfillmentLocation";
import { getStorefrontProductByHandle } from "../";
import { getFromLocalStorage } from "@Core/app/user/storage";

// use from LS or cache
let outOfStockSingleton = outOfStockConfig;

// : Record<string, string[]>
export const setOutOfStockConfig = (newConfig) => {
  outOfStockSingleton = newConfig;
};

// export const reloadOutOfStockconfig = () => {
//   return getOutOfStockData().then((outOfStockData) => {
//     setOutOfStockConfig(outOfStockData);
//     return outOfStockData;
//   });
// };

export const getOutOfStockConfig = () => {
  const lsConfig = getFromLocalStorage("inventoryOutOfStock");
  if (lsConfig && lsConfig.value) {
    return lsConfig.value;
  }
  return outOfStockSingleton;
};

export const isSKUAvailable = (productSKU, fulfillmentCode = null) => {
  const config = getOutOfStockConfig();
  if (!config[productSKU]) return true;

  if (!fulfillmentCode) fulfillmentCode = getFulfillmentCountryCode();
  if (config[productSKU].includes(fulfillmentCode)) return false;

  return true;
};

export const isProductAvailable = (productHandle, fulfillmentCode = null) => {
  return (
    getStorefrontProductByHandle(
      productHandle
    ).variants.edges.filter((productVariant) =>
      isSKUAvailable(productVariant.node.sku, fulfillmentCode)
    ).length > 0
  );
};
