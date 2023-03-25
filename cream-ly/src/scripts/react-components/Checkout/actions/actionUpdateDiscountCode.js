import * as Storefront from "@Core/api/shopify.storefront/checkout";

export default async function onDiscountCodeUpdate(
  storefrontCheckoutId,
  discountCode
) {
  return Storefront.updateDiscount(storefrontCheckoutId, discountCode);
}
