import * as Storefront from "@Core/api/shopify.storefront/checkout";
import * as Location from "@Core/location";

export default async function onAddressUpdate(
  checkoutId,
  address,
  isShippingRequired
) {
  if (!isShippingRequired) {
    // unfortunatelly API requires country info - required attributes are city, province, country and zip.
    // https://shopify.dev/docs/storefront-api/reference/mutation/checkoutattributesupdatev2?api[version]=2020-04

    const location = await Location.get(true);
    address.address1 = location.city;
    address.countryCode = location.countryCode;
    address.city = location.city;
    address.provinceCode = location.region;
    address.zip = location.zip ? location.zip : "12345";
  }

  return Storefront.updateAddress(checkoutId, address);
}
