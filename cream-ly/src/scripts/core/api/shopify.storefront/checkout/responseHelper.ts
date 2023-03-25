//@ts-nocheck
import IStorefrontResponse from "./types/Type.IShopifyStorefrontCheckoutResponse";
import ICheckout from "./types/Type.ICheckout";

export const response2Checkout = (
  checkoutFetchResponse: IStorefrontResponse
): ICheckout => {
  const checkout = {
    id: checkoutFetchResponse.checkout.data.node.id,
    email: checkoutFetchResponse.checkout.data.node.email,
    webUrl: checkoutFetchResponse.checkout.data.node.webUrl,
    isShippingRequired:
      checkoutFetchResponse.checkout.data.node.requiresShipping,
    attributes: {
      isPaid: isPaid(checkoutFetchResponse),
      skinType: getAttributeValue(checkoutFetchResponse, "skinType"),
      skinGoals: getAttributeValue(checkoutFetchResponse, "skinGoals", []),
      videoGoals: getAttributeValue(checkoutFetchResponse, "videoGoals", []),
    },
  };

  //const attributes = checkoutFetchResponse.checkout.data.node.customAttributes;

  return checkout;
};

export const getAttributeValue = (
  checkoutFetchResponse: IStorefrontResponse,
  attributeName: string,
  defaultValueIfNotAttribute: any = null
) => {
  const attribute = checkoutFetchResponse.checkout.data.node.customAttributes.find(
    ({ key }) => key == attributeName
  );

  if (attribute == undefined) return defaultValueIfNotAttribute;

  if (Array.isArray(defaultValueIfNotAttribute)) {
    try {
      return JSON.parse(attribute.value);
    } catch (e) {
      return defaultValueIfNotAttribute;
    }
  }

  return attribute.value;
};

export const isPaid = (checkoutFetchResponse: IStorefrontResponse) => {
  const attribute = getAttributeValue(checkoutFetchResponse, "isPaid");
  return attribute ? true : false;
};
