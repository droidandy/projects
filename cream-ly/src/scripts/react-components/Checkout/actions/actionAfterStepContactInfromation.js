import * as ShopifyStorefront from "@Core/api/shopify.storefront/checkout";
import * as ShopifyStorefrontAttributes from "@Core/api/shopify.storefront/checkout/attributes";
import { convertEURtoCurrentCurrency } from "@Components/Price";
import redux from "@Core/redux";

export default async ({
  storefrontCheckoutId,
  email,
  items,
  itemsCostInEUR,
  shippingCostInEUR,
  discountInPresentmentCurrency,
  shippingAddress,
  shippingRateHandle,
}) => {
  return saveStorefront({
    storefrontCheckoutId,
    email,
    items,
    itemsCostInEUR,
    shippingCostInEUR,
    discountInPresentmentCurrency,
    shippingAddress,
    shippingRateHandle,
  });

  //use backend to get checkoutId ->

  // CheckoutComponent -> Storefront : Shipping Method update / Shipping cost update
};

export const saveStorefront = async ({
  storefrontCheckoutId,
  email,
  itemsCostInEUR,
  items,
  shippingCostInEUR,
  discountInPresentmentCurrency,
  shippingAddress,
  shippingRateHandle,
}) => {
  /* const promise1Email = ShopifyStorefront.updateEmail(
    storefrontCheckoutId,
    email
  ); */

  const promise2Address = ShopifyStorefront.updateAddress(
    storefrontCheckoutId,
    shippingAddress
  );

  const reduxState = redux.getState();
  const currencyCode = reduxState.theme.currency.isoCode;
  const attributes = {
    currencyCode,
    currencyRate:
      currencyCode == "BYN" ? reduxState.theme.currency.exchangeBYN : 1,
    currencyItemsPrice: items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ),
    currencyShippingCost: convertEURtoCurrentCurrency(shippingCostInEUR / 100),
    shippingRateHandle,
    currencyDiscount:
      currencyCode == "BYN"
        ? convertEURtoCurrentCurrency(discountInPresentmentCurrency / 100)
        : discountInPresentmentCurrency,
  };

  const promise3Attributes = ShopifyStorefrontAttributes.updateSomeAttributes(
    storefrontCheckoutId,
    attributes
  );

  await Promise.all([promise2Address, promise3Attributes]);

  //update line after address
  //shipping update
  if (!shippingRateHandle) return;
  const promise4ShippingLine = ShopifyStorefront.updateShippingLine(
    storefrontCheckoutId,
    shippingRateHandle
  );
  await Promise.all([promise4ShippingLine]);
};

const isAddressValid = (shippingAddress) => {
  return (
    shippingAddress.countryCode != "" &&
    shippingAddress.address1 != "" &&
    (shippingAddress.countryCode != "RU" ||
      shippingAddress.provinceCode == "") &&
    shippingAddress.city != "" &&
    shippingAddress.zip != "" &&
    shippingAddress.firstName != "" &&
    shippingAddress.lastName != "" &&
    shippingAddress.phone != ""
  );
};
