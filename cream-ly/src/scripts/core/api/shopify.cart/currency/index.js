import FormData from "form-data";

export const setCurrency = (currencyCode) => {
  currencyCode = String(currencyCode).toUpperCase();

  const {
    shopifyCurrencyCode,
    nonShopifyCurrencyCode,
  } = getSupportedShopifyCurrency(currencyCode);

  const formData = new FormData();
  formData.append("currency", shopifyCurrencyCode);
  formData.append(
    "attributes[currency]",
    nonShopifyCurrencyCode ? nonShopifyCurrencyCode : shopifyCurrencyCode
  );

  const options = {
    method: "post",
    body: formData,
  };

  const url = "/cart/update.js";

  return fetch(url, options).then((result) => {
    console.log("setCurrency to", currencyCode);
    return result;
  });
};

export const getSupportedShopifyCurrency = (currencyIsoCode) => {
  let shopifyCurrencyCode = currencyIsoCode;
  let nonShopifyCurrencyCode = null;

  if (["BYN"].includes(currencyIsoCode)) {
    shopifyCurrencyCode = "EUR";
    nonShopifyCurrencyCode = currencyIsoCode;
  }

  return { shopifyCurrencyCode, nonShopifyCurrencyCode };
};
