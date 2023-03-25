import * as API from "@Core/api/creamly.firebase";
import * as ShopifyStorefrontCheckout from "@Core/api/shopify.storefront/checkout";

import checkoutCreate from "@Core/api/shopify.storefront/checkout/create";
import * as ShopifyStorefrontCheckoutItems from "@Core/api/shopify.storefront/checkout/items";
import * as ShopifyStorefrontCheckoutDiscount from "@Core/api/shopify.storefront/checkout/discount";
import {
  client,
  number2StorefrontId,
  grahqlFetch,
} from "@Core/api/shopify.storefront";
import { convertSumOfPricesToEUR } from "@Core/currency";

describe("location", () => {
  beforeEach(() => {
    fetchMock.dontMock();
  });

  it.skip("workds", async () => {
    //const storefrontCheckoutId = createViaStorefront();
    //const storefrontCheckoutId = await createCheckoutViaFirebase();
    const storefrontCheckoutId = checkoutIdEUR();

    await addItems(storefrontCheckoutId);
    await addDiscount(storefrontCheckoutId);

    const result = await ShopifyStorefrontCheckout.fetch(storefrontCheckoutId);
    console.log(JSON.stringify(result));
  });
});

const checkoutIdRUB = () => {
  const storefrontCheckoutId =
    "Z2lkOi8vc2hvcGlmeS9DaGVja291dC80YmRmMGVmNjcyM2E5NmEyMjljNTk4ZTE5MzhlZjg4MT9rZXk9OGY2NWI5Y2JhNzI4OTQ5NGM0NmVjYzk0ODgyNWQ4ZjA=";
  //https://creamly.myshopify.com/admin/checkouts/19857017045046
  return storefrontCheckoutId;
};

const checkoutIdEUR = () => {
  const result = {
    checkoutId: 19857356980278,
    storefrontId:
      "Z2lkOi8vc2hvcGlmeS9DaGVja291dC9mNjhlMzZjOTEzNmVmYzkwMDA1MjJkMjQ1NzdlOWViZj9rZXk9ZGQyMjg0MTY2MmQwNDM4N2U1MzY1OTE3OWZjNDU3OTQ=",
  };

  return result.storefrontId;
};

const createViaStorefront = async () => {
  const result = await checkoutCreate("RUB", "test_email@cream.ly");
  console.log(result);
  return result;
};

const createCheckoutViaFirebase = async () => {
  const result = await API.checkoutCreate("unit-test1", "RUB");
  console.log(result);
  //return result;
  /* 
    const result = {
      checkoutId: 19856676323382,
      storefrontId:
        "Z2lkOi8vc2hvcGlmeS9DaGVja291dC8wYjI0YjQzYjc1NjI0YmRiYjU4YmQyYjg3ODIzOTdlMj9rZXk9ODk1NGIyZTEyYzVkODkxN2Q0YTViZjljOGM3MjRhMTM=",
    }; */

  return result.storefrontId;
};

const addItems = async (storefrontCheckoutId) => {
  const cartItems = [
    {
      variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80Njg1OTI0MjA0NTgx", //flower-powder
      quantity: 2,
    },
  ];

  return ShopifyStorefrontCheckoutItems.replaceLineItems(
    cartItems,
    storefrontCheckoutId
  );
};

const addDiscount = async (storefrontCheckoutId) => {
  return ShopifyStorefrontCheckoutDiscount.apply("epam", storefrontCheckoutId);
};
