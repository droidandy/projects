//@ts-nocheck
import * as ShopifyStorefront from "@Core/api/shopify.storefront/checkout";
import { IStorefrontCheckout } from "@Core/api/shopify.storefront/checkout/types/Type.IShopifyStorefrontCheckoutResponse";

export default async ({ storefrontCheckoutId }) => {
  return storefrontFetch(storefrontCheckoutId);
};

export const storefrontFetch = async (
  storefrontCheckoutId,
  attemptsLeft = 10
) => {
  //console.log("storefrontFetch", storefrontCheckoutId);

  const checkout = await ShopifyStorefront.fetch(storefrontCheckoutId);
  if (!isNumericCheckoutIdExist(checkout)) {
    if (attemptsLeft == 0) {
      throw Error("can't get checkoutId from storefront checkout");
    }

    await new Promise((r) => setTimeout(r, 1000));
    return storefrontFetch(storefrontCheckoutId, attemptsLeft - 1);
  }

  return parseCheckoutData(checkout);
};

export const parseCheckoutData = (checkout: IStorefrontCheckout) => {
  const storefrontData = {
    checkoutId: getCheckoutIdFromStorefrontAttributes(checkout),
    itemsCostInEUR: checkout.subtotalPrice,
    discountCode: getDiscountCode(checkout),
    discountInPresentmentCurrency: ShopifyStorefront.calculateDiscountAmount(
      checkout
    ),
  };

  if (checkout.shippingAddress) {
    /* if (isDigitalAddress(checkout.shippingAddress)) {
      storefrontData.shippingAddress = {
        firstName: checkout.shippingAddress.firstName,
        lastName: checkout.shippingAddress.lastName,
      };
    } else { */
    storefrontData.shippingAddress = {
      firstName: checkout.shippingAddress.firstName,
      lastName: checkout.shippingAddress.lastName,
      countryCode: checkout.shippingAddress.countryCode,
      provinceCode: checkout.shippingAddress.provinceCode,
      city: checkout.shippingAddress.city,
      address1: checkout.shippingAddress.address1,
      address2: checkout.shippingAddress.address2,
      company: checkout.shippingAddress.company,
      zip: checkout.shippingAddress.zip,
      phone: checkout.shippingAddress.phone,
    };
  }

  //console.log("parseCheckoutData", storefrontData, checkout);

  if (checkout.email && checkout.email != "test_email@cream.ly") {
    //this is a workaround for shopify API - this email is used as temp email for checkoutId mapping as without email we can't see checkout...
    storefrontData.email = checkout.email;
  }

  return storefrontData;
};

export const isDigitalAddress = (address) => {
  if (!address) return false;

  if (address.address1 && address.address1 == address.city) return true;
};

export function getDiscountCode(checkout: ShopifyStorefront.ICheckout) {
  return checkout.discountApplications &&
    checkout.discountApplications.edges &&
    checkout.discountApplications.edges[0]
    ? checkout.discountApplications.edges[0].node.code
    : null;
}

export const isNumericCheckoutIdExist = (checkout: IStorefrontCheckout) => {
  return !(
    !checkout ||
    !checkout.customAttributes ||
    !Array.isArray(checkout.customAttributes) ||
    checkout.customAttributes.filter((a) => a.key == "checkoutId").length == 0
  );
};

export const getCheckoutIdFromStorefrontAttributes = (
  checkout: IStorefrontCheckout
) => {
  return checkout.customAttributes
    .filter((a) => a.key == "checkoutId")
    .map((a) => a.value)
    .shift();
};
