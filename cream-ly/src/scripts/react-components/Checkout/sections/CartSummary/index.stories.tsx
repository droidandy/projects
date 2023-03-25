import React from "react";
import { action } from "@storybook/addon-actions";

import CartSummary, { Props } from ".";

import { itemsData } from "../StepCartFilled/index.stories";

export default {
  title: "Pages/CartCheckout/RU/Sections/CartSummary",
  component: CartSummary,
};

const propsData: Props = {
  items: itemsData,
  isShippingRequired: true,

  onDiscountCodeUpdate: action("onDiscountCodeUpdate"),
};
export const cartSummary = () => <CartSummary {...propsData} />;

const discountIsLoadingData: Props = {
  ...propsData,
  isDiscountLoading: true,
};
export const discountIsLoading = () => (
  <CartSummary {...discountIsLoadingData} />
);

export const withDiscount = () => (
  <CartSummary
    {...propsData}
    discountInPresentmentCurrency="testCode"
    discountInEUR={25}
  />
);
