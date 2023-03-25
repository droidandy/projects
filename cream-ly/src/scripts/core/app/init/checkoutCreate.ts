import createCheckoutAndGetId from "@Core/api/shopify.storefront/checkout/create";
import { setPreference, getPreference } from "@Core/app/user/preferences";

export default (): Promise<string> => {
  /* return createCheckoutAndGetId().then((storefrontCheckoutId) => {
    setPreference("storefrontCheckoutId", storefrontCheckoutId);
  }); */

  return createCheckoutAndGetId();
};
