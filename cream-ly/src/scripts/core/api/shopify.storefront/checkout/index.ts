//@ts-nocheck
import { number2StorefrontId, grahqlFetch } from "../";
import getConfig from "../config";
import checkoutFragment from "./gql";

import mutationUpdateShippingAddress from "./gql/updateShippingAddress";
import mutationUpdateEmail from "./gql/updateEmail";

import gql from "graphql-tag";

import IStorefrontResponseCheckout, {
  IStorefrontCheckout,
} from "./types/Type.IShopifyStorefrontCheckoutResponse";

import Client from "shopify-buy";
export const getClient = () => {
  const config = getConfig();
  const shopifyClient = Client.buildClient({
    domain: config.domain,
    apiVersion: config.apiVersion,
    storefrontAccessToken: config.apiToken,
  });

  return shopifyClient;
};

export function isCheckoutPaid(checkout) {
  console.log("check isCheckoutPaid", checkout);

  if (
    !checkout ||
    !checkout.id ||
    !checkout.customAttributes ||
    !Array.isArray(checkout.customAttributes) ||
    checkout.customAttributes.filter((a) => a.key == "isPaid").length == 0
  )
    return false;

  return checkout.customAttributes.find(
    (a) => a.key == "isPaid" && a.value == "true"
  )
    ? true
    : false;
}

export const fetch = (storefrontCheckoutId: string): IStorefrontCheckout => {
  return grahqlFetch(checkoutFragment, { id: storefrontCheckoutId }).then(
    (response: IStorefrontResponseCheckout) => {
      if (!response)
        throw Error(
          "no response from graphql. check if fetch method is mocked maybe"
        );
      if (response.errors)
        throw Error(
          "errors in graphql request " + JSON.stringify(response.errors)
        );

      return response.data.node as IStorefrontCheckout;
    }
  );
};

export function updateItems(checkoutId, cartItems: ICartItem[]) {
  // documentation https://shopify.dev/docs/storefront-api/reference/mutation/checkoutlineitemsreplace?api[version]=2020-04
  const mapItemProperties = (properties) => {
    if (!properties) return [];
    return Object.keys(properties).reduce((acc, key) => {
      acc.push({ key, value: JSON.stringify(properties[key]) });
      return acc;
    }, []);
  };
  const items = cartItems.map((item) => ({
    quantity: Number(item.quantity),
    variantId: number2StorefrontId(item.variantId, "ProductVariant"),
    customAttributes: mapItemProperties(item.properties),
  }));

  return getClient().checkout.replaceLineItems(checkoutId, items);
}

export function calculateDiscountAmount(checkout) {
  if (
    !checkout ||
    !checkout.lineItemsSubtotalPrice ||
    !checkout.subtotalPriceV2
  )
    return 0;

  /*  console.log(
    "checkout.lineItemsSubtotalPrice",
    checkout.lineItemsSubtotalPrice.amount
  );
  console.log("checkout.subtotalPriceV2", checkout.subtotalPriceV2.amount);
 */
  const discountDiff =
    checkout.lineItemsSubtotalPrice.amount - checkout.subtotalPriceV2.amount;
  const amount = Number(Number.parseFloat(discountDiff).toFixed(1));
  //const amount = Math.round(discountDiff);

  return amount;
}

export function updateDiscount(checkoutId, discountCode) {
  // documentation https://shopify.dev/docs/storefront-api/reference/mutation/checkoutdiscountcodeapplyv2?api[version]=2020-04
  return getClient()
    .checkout.removeDiscount(checkoutId)
    .then(() => getClient().checkout.addDiscount(checkoutId, discountCode))
    .then(calculateDiscountAmount);
}

export function updateEmail(checkoutId, email) {
  // documentation https://shopify.dev/docs/storefront-api/reference/mutation/checkoutemailupdatev2?api[version]=2020-04
  return grahqlFetch(mutationUpdateEmail, {
    checkoutId,
    email,
  });
}

export function updateAddress(storefrontCheckoutId, shippingAddress) {
  const address = {
    address1: shippingAddress.address1,
    address2: shippingAddress.address2,
    city: shippingAddress.city,
    company: shippingAddress.company,
    phone: shippingAddress.phone,
    zip: shippingAddress.zip,
    firstName: shippingAddress.firstName,
    lastName: shippingAddress.lastName,
    country: shippingAddress.countryCode,
    province: shippingAddress.provinceCode ? shippingAddress.provinceCode : "",
  };

  return grahqlFetch(mutationUpdateShippingAddress, {
    checkoutId: storefrontCheckoutId,
    shippingAddress: address,
  });
}

export function completeFree(storefrontCheckoutId) {
  // https://shopify.dev/docs/storefront-api/reference/mutation/checkoutcompletefree

  const query = gql`
    mutation checkoutCompleteFree($checkoutId: ID!) {
      checkoutCompleteFree(checkoutId: $checkoutId) {
        checkout {
          id
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    checkoutId: storefrontCheckoutId,
  };

  return grahqlFetch(query, variables);
}

export function updateShippingLine(checkoutId, shippingRateHandle) {
  const query = gql`
    mutation checkoutShippingLineUpdate(
      $checkoutId: ID!
      $shippingRateHandle: String!
    ) {
      checkoutShippingLineUpdate(
        checkoutId: $checkoutId
        shippingRateHandle: $shippingRateHandle
      ) {
        checkout {
          id
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    checkoutId,
    shippingRateHandle: encodeURI(shippingRateHandle),
  };

  return grahqlFetch(query, variables).then((response) => {
    if (response.data.checkoutShippingLineUpdate.checkoutUserErrors.length)
      throw Error(
        "checkoutShippingLineUpdate error " +
          JSON.stringify(
            response.data.checkoutShippingLineUpdate.checkoutUserErrors
          )
      );

    //console.log("checkoutShippingLineUpdate response", response);

    return response;
  });
}
