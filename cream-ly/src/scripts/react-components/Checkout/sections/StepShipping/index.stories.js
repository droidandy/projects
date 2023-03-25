import React from "react";

import { action, actions } from "@storybook/addon-actions";

import CheckoutStepShipping from ".";

export default {
  title: "Pages/CartCheckout/RU/Steps/3-Shipping",
  component: CheckoutStepShipping,
};

const props = {
  subtotal: 10 * 100, //in cents
  address: { countryCode: "BY" },
  onUpdate: action("onUpdate"),
};

export const BelarusPaid = () => <CheckoutStepShipping {...props} />;

export const BelarusFree = () => (
  <CheckoutStepShipping {...props} subtotal={60 * 100} />
);

export const Russia = () => (
  <CheckoutStepShipping
    {...props}
    address={{ countryCode: "RU", provinceCode: "AMU" }}
  />
);

export const Kazahstan = () => (
  <CheckoutStepShipping {...props} address={{ countryCode: "KZ" }} />
);

export const Netherlands = () => (
  <CheckoutStepShipping {...props} address={{ countryCode: "NL" }} />
);
