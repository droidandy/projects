import React from "react";

import { action } from "@storybook/addon-actions";

import { text } from "@storybook/addon-knobs";

import CheckoutStepPaymentYandex from "./";

export default {
  title: "Pages/CartCheckout/RU/Steps/4-Payment-Yandex",
  component: CheckoutStepPaymentYandex,
};

const actionsData = {};

export const defaultState = (extraProps) => {
  return (
    <CheckoutStepPaymentYandex
      yandexCheckoutToken={text(
        "yandexCheckoutToken",
        "ct-26cefb59-000f-5000-9000-17074cc88190"
      )}
      returnURL={text("returnURL", "https://cream.ly/order_success")}
      {...actionsData}
      {...extraProps}
    />
  );
};
