//@ts-nocheck
import { STEPS } from ".";
import actionAfterStepCartFilled from "./actions/actionAfterStepCartFilled";
import actionAfterStepContactInfromation from "./actions/actionAfterStepContactInfromation";

import actionBeforeStepContactInformation from "./actions/actionBeforeStepContactInformation";
import actionBeforeStepPaymentYandexKassaWidget from "./actions/actionBeforeStepPaymentYandexKassaWidget";
import actionBeforeStepPaymentRedirectShopifyDefaultCheckout from "./actions/actionBeforeStepPaymentRedirectShopifyDefaultCheckout";

import actionUpdateItems from "./actions/actionUpdateItems";
import actionUpdateNote from "./actions/actionUpdateNote";
import actionUpdateDiscountCode from "./actions/actionUpdateDiscountCode";
import actionUpdateEmail from "./actions/actionUpdateEmail";
import actionUpdateAddress from "./actions/actionUpdateAddress";
import actionBeforeStepPaymentRedirectWebpay from "./actions/actionBeforeStepPaymentRedirectWebpay";

const PAYMENT_SHOPIFY_DEFAULT = "default";
const PAYMENT_WEBPAY = "webpay";
const PAYMENT_YANDEX_KASSA = "yandex";
const PAYMENT_FREE = "free";

export const PAYMENT_METHODS = {
  PAYMENT_SHOPIFY_DEFAULT,
  PAYMENT_WEBPAY,
  PAYMENT_YANDEX_KASSA,
  PAYMENT_FREE,
};

export const isShippingRequired = (checkoutState: ICheckoutState) => {
  const isShippingRequired = () => {
    const filtered = checkoutState.items.filter(
      (item: ICartItem) => item.product.isShippingRequired
    );
    return filtered.length > 0;
  };

  if (
    !checkoutState ||
    !checkoutState.items ||
    !Array.isArray(checkoutState.items)
  )
    return false;

  return isShippingRequired();
};

export const definePaymentMethod = (checkoutState) => {
  const isFree = () => {
    if (!checkoutState.items || !Array.isArray(checkoutState.items))
      return true;

    const filtered = checkoutState.items.filter((item) => item.price > 0);
    return filtered.length === 0;
  };

  if (isFree()) return PAYMENT_SHOPIFY_DEFAULT; //return PAYMENT_FREE;

  switch (checkoutState.regionCode) {
    case "BY":
      return PAYMENT_WEBPAY;
    case "RU":
      //return PAYMENT_WEBPAY;
      return PAYMENT_YANDEX_KASSA;
  }

  return PAYMENT_SHOPIFY_DEFAULT;
};

export const defineSteps = (checkoutState) => {
  const steps = [];

  if (!checkoutState.items || !checkoutState.items.length)
    return [STEPS.STEP_CART_EMPTY];

  steps.push(STEPS.STEP_CART_FILLED);

  const paymentMethod = definePaymentMethod(checkoutState);

  if (paymentMethod == PAYMENT_METHODS.PAYMENT_SHOPIFY_DEFAULT) {
    steps.push(STEPS.STEP_PAYMENT_SHOPIFY_DEFAULT_REDIRECT);
    return steps;
  }

  steps.push(STEPS.STEP_CONTACT);

  if (paymentMethod == PAYMENT_METHODS.PAYMENT_FREE) {
    steps.push(STEPS.STEP_PAYMENT_FREE_REDIRECT);
    return steps;
  }

  if (
    isShippingRequired(checkoutState) &&
    checkoutState.shippingCostInEUR > 0
  ) {
    steps.push(STEPS.STEP_SHIPPING);
  }

  if (paymentMethod == PAYMENT_METHODS.PAYMENT_WEBPAY) {
    steps.push(STEPS.STEP_PAYMENT_WEBPAY_REDIRECT);
  }

  if (paymentMethod == PAYMENT_METHODS.PAYMENT_YANDEX_KASSA) {
    steps.push(STEPS.STEP_PAYMENT_YANDEX_KASSA);
  }

  return steps;
};

function resolveAfter1Second(checkoutState) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ stepChangeResolve: true });
    }, 1);
  });
}

export const onAfterStepChange = (currentStep, checkoutState, nextStep) => {
  switch (currentStep) {
    case STEPS.STEP_CART_FILLED:
      if (nextStep == STEPS.STEP_CONTACT)
        return actionAfterStepCartFilled(checkoutState);
      break;
    case STEPS.STEP_CONTACT:
      if (nextStep != STEPS.STEP_CART_FILLED)
        return actionAfterStepContactInfromation(checkoutState);
  }

  return resolveAfter1Second();
};

export const onBeforeStepChange = (newStep, checkoutState) => {
  switch (newStep) {
    case STEPS.STEP_CONTACT:
      return actionBeforeStepContactInformation(checkoutState);
    case STEPS.STEP_PAYMENT_YANDEX_KASSA:
      return actionBeforeStepPaymentYandexKassaWidget(checkoutState);
    case STEPS.STEP_PAYMENT_SHOPIFY_DEFAULT_REDIRECT:
      return actionBeforeStepPaymentRedirectShopifyDefaultCheckout();
    case STEPS.STEP_PAYMENT_WEBPAY_REDIRECT:
      return actionBeforeStepPaymentRedirectWebpay(checkoutState);
  }

  return resolveAfter1Second();
};

export const onStateChange = (
  field,
  data,
  storefrontCheckoutId,
  checkoutId,
  isShippingRequired
) => {
  switch (field) {
    case "note":
      return actionUpdateNote(data);
    case "items":
      return actionUpdateItems(data);
    case "discountCode":
      return actionUpdateDiscountCode(storefrontCheckoutId, data);
    case "email":
      return actionUpdateEmail(storefrontCheckoutId, checkoutId, data);
    case "address":
      return actionUpdateAddress(
        storefrontCheckoutId,
        data,
        isShippingRequired
      );
  }

  return async () => {};
};

export function checkIsShippingCostReady(checkoutState) {
  if (
    !checkoutState ||
    !checkoutState.shippingAddress ||
    !checkoutState.shippingAddress.countryCode
  )
    return false;

  if (!isShippingRequired(checkoutState)) return false;

  if (!["RU", "BY", "KZ"].includes(checkoutState.shippingAddress.countryCode))
    return false;

  if (
    checkoutState.shippingAddress.countryCode == "RU" &&
    !checkoutState.shippingAddress.provinceCode
  )
    return false;

  return true;
}
