import * as ShopifyCart from "@Core/api/shopify.cart";
import * as ShopifyCartAttributes from "@Core/api/shopify.cart/attributes";
import * as ShopifyCartItems from "@Core/api/shopify.cart/items";

import * as ShopifyStorefrontCheckoutAttributes from "@Core/api/shopify.storefront/checkout/attributes";
import * as ShopifyStorefrontCheckout from "@Core/api/shopify.storefront/checkout";

import * as CreamlyBackend from "@Core/api/creamly.firebase";
import reduxStore from "@Core/redux";

export default async ({ storefrontCheckoutId, note, items, attributes }) => {
  let checkoutStateUpdate = {};
  let attributesToUpdate = {};

  console.log("afterStepCartFilled", storefrontCheckoutId);

  const isNewStorefrontCheckout = await isNewCheckoutNeeded(
    storefrontCheckoutId
  );

  console.log("isNewStorefrontCheckout", isNewStorefrontCheckout);

  if (isNewStorefrontCheckout) {
    console.log("createStorefrontCheckout");

    checkoutStateUpdate = await createStorefrontCheckout();

    console.log("created checkout", checkoutStateUpdate);

    if (
      !checkoutStateUpdate.storefrontCheckoutId ||
      !checkoutStateUpdate.checkoutId
    )
      throw Error(
        "storefront and checkout id is not set. " +
          JSON.stringify(checkoutStateUpdate)
      );

    storefrontCheckoutId = checkoutStateUpdate.storefrontCheckoutId;

    attributesToUpdate = {
      storefrontCheckoutId: checkoutStateUpdate.storefrontCheckoutId,
      checkoutId: checkoutStateUpdate.checkoutId,
    };
  }

  const promise1Cart = saveShopifyCart({
    note,
    items,
    attributesToUpdate,
  }).then((response) => {
    console.log("promise1Cart resolved", response);
  });
  const promise2Storefront = saveStorefront({
    storefrontCheckoutId,
    note,
    items,
    attributes,
  }).then((response) => {
    console.log("promise2Storefront resolved", response);
  });

  await Promise.all([promise1Cart, promise2Storefront]);
  return checkoutStateUpdate;
};

export const isNewCheckoutNeeded = async (storefrontCheckoutId) => {
  if (!storefrontCheckoutId) return true;

  return ShopifyStorefrontCheckout.fetch(storefrontCheckoutId)
    .then((response) => {
      console.log("checkout fetch", response);
      return response;
    })
    .then(ShopifyStorefrontCheckout.isCheckoutPaid);
};

export const getCurrencyCodeForNewCheckout = () => {
  const currencyCode = reduxStore.getState().theme.currency.isoCode;
  return currencyCode == "BYN" ? "EUR" : currencyCode;
};

export const createStorefrontCheckout = async () => {
  const cartToken = await ShopifyCart.getToken();

  return CreamlyBackend.checkoutCreate(
    cartToken,
    getCurrencyCodeForNewCheckout()
  ).then((response) => {
    return {
      storefrontCheckoutId: response.storefrontId,
      checkoutId: response.checkoutId,
    };
  });
};

export const mapItems2ShopifyCartUpdate = (items) => {
  return items.reduce(
    (acc, item) => ({ ...acc, [item.variantId]: item.quantity }),
    {}
  );
};

export const saveShopifyCart = async ({ note, items, attributesToUpdate }) => {
  const promise1Attributes = ShopifyCartAttributes.setAttributesAndNote(
    attributesToUpdate,
    note
  );
  await Promise.all([promise1Attributes]);

  // we should not use bulkUpdate here as someItems could have custom properties and we want to preserve it
  const promise2Items = ShopifyCartItems.updateMultipleItems(
    mapItems2ShopifyCartUpdate(items)
  );

  return Promise.all([promise2Items]);
};

export const saveStorefront = async ({
  storefrontCheckoutId,
  note,
  items,
  attributes,
}) => {
  const promise1Note = ShopifyStorefrontCheckoutAttributes.updateNote(
    storefrontCheckoutId,
    note
  );

  attributes = { ...attributes, storefrontCheckoutId };
  //console.log("storefront attributes replace", attributes);

  const promise2Attributes = ShopifyStorefrontCheckoutAttributes.updateSomeAttributes(
    storefrontCheckoutId,
    attributes
  ).then((response) => {
    //console.log("promise2Attributes response", response);
  });

  const promise3Items = ShopifyStorefrontCheckout.updateItems(
    storefrontCheckoutId,
    items
  );

  return Promise.all([promise1Note, promise2Attributes, promise3Items]);
};
