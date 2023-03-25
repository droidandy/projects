import React, {FunctionComponent} from "react";
import store from "@Core/redux";
import {useTranslate} from "@Core/i18n";

export const formats = {
  BYN: "{{amount_no_decimals}} р.",
  RUB: "{{amount_no_decimals}} ₽",
  USD: "${{amount_no_decimals}}",
  UAH: "{{amount_no_decimals}} ₴",
  GBP: "£ {{amount_no_decimals}}",
  CAD: "${{amount_no_decimals}} CAD",
  CHF: "CHF {{amount_no_decimals}}",
  EUR: "€ {{amount_no_decimals}}"
};

// € {{amount}}
// руб{{amount_with_comma_separator}} RUB
// ${{amount}} USD
// ₴{{amount}} UAH
// £{{amount}} GBP
// ${{amount}} CAD
// CHF {{amount}}

const getThemeCurrency = () => {
  const {
    isoCode,
    format,
    exchangeBYN,
    exchangeEUR
  } = store.getState().theme.currency;
  return {
    currencyCode: isoCode,
    defaultFormat: format,
    exchangeBYN,
    exchangeEUR
  };
};

const formatWithDelimiters = (
  number,
  precision = 2,
  thousands = ",",
  decimal = "."
) => {
  if (isNaN(number) || number == null) {
    return 0;
  }

  number = (number / 100.0).toFixed(precision);

  const parts = number.split(".");
  const dollarsAmount = parts[0].replace(
    /(\d)(?=(\d\d\d)+(?!\d))/g,
    `$1${thousands}`
  );
  const centsAmount = parts[1] ? decimal + parts[1] : "";

  return dollarsAmount + centsAmount;
};

export const formatPrice = price => {
  const { currencyCode, defaultFormat } = getThemeCurrency();
  const format = formats[currencyCode] || defaultFormat;
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const amount = formatWithDelimiters(price, 2);
  const amountNoDecimals = formatWithDelimiters(price, 0);
  const value = {
    BYN: amountNoDecimals,
    UAH: amountNoDecimals,
    EUR: amountNoDecimals
  };

  return format.replace(placeholderRegex, value[currencyCode] || amount);
};

export const convertEURtoCurrentCurrency = priceInEUR => {
  const { currencyCode, exchangeBYN, exchangeEUR } = getThemeCurrency();
  const exchange = {
    BYN: exchangeBYN
  };
  const rate = exchange[currencyCode] || exchangeEUR;

  const price = priceInEUR * rate * 100;
  return Math.round(price * 100) / 100;
};

export const renderPriceInEUR = priceInEUR =>
  formatPrice(convertEURtoCurrentCurrency(priceInEUR));

const positionTotal = ({ price, quantity = 1 }) => (price || 0) * quantity;
const total = (sum, price) => sum + price;

export interface TypeProps {
  prices?: Array<ICartItem>;
  priceInEUR?: any;
  price?: any;
  quantity?: any;
  lang?: string;
}
const Price: FunctionComponent<TypeProps> = ({
  lang,
  priceInEUR,
  prices,
  price,
  quantity = 1
}) => {
  const t = useTranslate("common", lang);
  let products = prices ? prices.map(positionTotal) : [];
  if (price != undefined) {
    products = [(price || 0) * quantity];
  }

  if (products.length > 0) {
    const sum = products.reduce(total, 0);
    return sum === 0 ? t("free") : formatPrice(sum * 100);
  }

  if (priceInEUR) {
    return priceInEUR === 0 ? t("free") : renderPriceInEUR(Number(priceInEUR));
  }

  return "";
};

export default Price;
