import * as currency from "@shopify/theme-currency";

export function convertPrice(price, rate, quantity = 1) {
  if (!rate) rate = getCurrencyExchange();
  quantity = quantity ? quantity : 1;

  if (rate === 1) return price * quantity;
  return Math.ceil((price * rate) / 100) * 100 * quantity;
}

export function convertSumOfPrices(list) {
  if (!list || !list.length) return 0;

  let sum = 0;

  // cart.items.map(item => convertPrice(item.price) / 100);

  let item = {};
  for (const i in list) {
    item = list[i];
    if (typeof item.quantity === "undefined") item.quantity = 1;
    if (item && typeof item.price !== undefined && item.quantity) {
      sum += convertPrice(item.price, null, item.quantity);
    } else {
      throw new Error("incorrect object for convertSumOfPrices");
    }
  }

  return sum;
}

export function convertSumOfPricesToEUR(list) {
  const price = list
    .map((item) => {
      return isCustomCurrency()
        ? item.price * item.quantity
        : (item.price * item.quantity) / getEURCurrencyExchange();
    })
    .reduce((acc, i) => acc + i, 0);

  return Math.floor(price / 100);
}

export function renderSumOfPrices(list) {
  const sum = convertSumOfPrices(list);
  return renderPrice(sum, 1);
}

export function renderSumOfPricesEUR(list) {
  const sum = convertSumOfEURPrices(list);
  return renderPrice(sum, 1);
}

export function renderPrice(price, rate, quantity = 1, withDecimal = false) {
  return formatPrice(
    price,
    rate ? rate : getCurrencyExchange(),
    quantity,
    withDecimal
  );
}

export function convertPriceInEUR(priceInEUR) {
  const priceSign = priceInEUR >= 0 ? 1 : -1;
  const rate = getEURCurrencyExchange();
  const rateMultiple = Math.abs(priceInEUR) * rate;
  return Math.ceil(rateMultiple) * 100 * priceSign;
}

export function convertSumOfEURPrices(listInEUR) {
  return listInEUR
    .map((item) => ({
      price: convertPriceInEUR(item.price),
      quantity: item.quantity ? item.quantity : 1,
    }))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/*
      When price is in EUR
      */
export function renderEURPrice(priceInEUR, quantity = 1, withDecimal = false) {
  const price = convertPriceInEUR(priceInEUR);

  return renderPrice(price, 1, quantity, withDecimal);
}

export const formatPrice = (
  price,
  currencyExchange,
  quantity,
  withDecimal = false
) => {
  const newprice = convertPrice(price, currencyExchange, quantity);

  const moneyFormat = getMoneyFormat(withDecimal);

  return currency.formatMoney(newprice, moneyFormat);
};

export const getCurrencyExchange = () => {
  if (isCustomCurrency()) return getCustomCurrencyExchange();
  else return 1;
};

export const getCurrencyCode = () => {
  if (typeof window.theme === "undefined") return "EUR";
  return window.theme.currency;
};

export const getEURCurrencyExchange = () => {
  if (isCustomCurrency()) return getCustomCurrencyExchange();
  else return getShopifyCurrencyExchange();
};

export const getCustomCurrencyExchange = () => {
  let rate = 1;
  if (
    typeof window.theme !== "undefined" &&
    window.theme.currencyExchange &&
    window.theme.currencyExchange != 1
  ) {
    rate = window.theme.currencyExchange;
    return rate;
  }

  return rate;
};

export const getShopifyCurrencyExchange = () => {
  let rate = 1;
  if (
    typeof window.theme !== "undefined" &&
    window.theme.eurRateExchange &&
    window.theme.eurRateExchange != 1
  ) {
    rate = window.theme.eurRateExchange / 100;
    return rate;
  }
  return rate;
};

export const convertEURtoShopifyCurrency = (priceInEUR) => {
  return isCustomCurrency()
    ? priceInEUR * 100
    : priceInEUR * 100 * getEURCurrencyExchange(); // converting EUR to cents and converst currency
};

export const convertShopifyCurrencyToEUR = (priceInCents) => {
  return isCustomCurrency()
    ? priceInCents / 100
    : priceInCents / 100 / getEURCurrencyExchange();
};

function isCustomCurrency() {
  if (
    typeof window.theme !== "undefined" &&
    window.theme.currencyExchange &&
    window.theme.currencyExchange != 1
  ) {
    return true;
  }

  return false;
}

function getMoneyFormat(withDecimal = false) {
  const moneyFormat =
    typeof window.theme !== "undefined" && window.theme.moneyFormat
      ? window.theme.moneyFormat
      : "€ {{amount_no_decimals}} EUR";

  return withDecimal
    ? moneyFormat.replace("amount_no_decimals", "amount")
    : moneyFormat;
}
