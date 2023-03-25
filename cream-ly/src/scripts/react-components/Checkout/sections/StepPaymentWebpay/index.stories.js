import React from "react";

import { action } from "@storybook/addon-actions";

import CheckoutStepPayment from ".";

export default {
  title: "Pages/CartCheckout/RU/Steps/4-Payment",
  component: StepPaymentWebpay,
};

const state = { paymentMethod: { handle: "test" } };

const actionsData = {
  onUpdate: action("onUpdate"),
};

export const defaultState = (extraProps) => (
  <StepPaymentWebpay {...actionsData} {...extraProps} />
);
