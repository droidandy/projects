import * as CreamlyFirebase from "@Core/api/creamly.firebase/shopify.checkout";
import * as ShopifyCart from "@Core/api/shopify.cart";
import * as ShopifyCartAttributes from "@Core/api/shopify.cart/attributes";

export default async function onEmailUpdate(
  storefrontCheckoutId,
  checkoutId,
  email
) {
  const cartToken = await ShopifyCart.getToken();

  const {
    dbId,
    newStorefrontCheckoutId,
  } = await CreamlyFirebase.checkoutUpdateEmail(
    cartToken,
    storefrontCheckoutId,
    email
  );

  if (dbId != checkoutId)
    throw Error(
      "checkoutId on emailUpdate is not matching. checkoutId " +
        checkoutId +
        ". dbId " +
        dbId
    );

  await ShopifyCartAttributes.setAttributes({
    storefrontCheckoutId: newStorefrontCheckoutId,
  });

  return newStorefrontCheckoutId;
}
