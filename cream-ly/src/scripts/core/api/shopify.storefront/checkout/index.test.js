//jest.mock("shopify-buy");
//jest.mock("node-fetch");
//@ts-nocheck
import * as ShopifyStorefrontCheckout from ".";

import * as ShopifyStorefrontAttributes from "./attributes";

const ID_THAT_DOESNTWORK =
  "Z2lkOi8vc2hvcGlmeS9DaGVja291dC9kYjM5MzVhNWJiN2EwYzNkYzFjNmZiYzIwYTAwNGJlNj9rZXk9MmQyY2YzMGNjMzg1YzQ1MTVlYjkwZmI2NTg5NDBkZWY=";

const ID_THAT_WORKS =
  "Z2lkOi8vc2hvcGlmeS9DaGVja291dC82MWI3NTEwOGM1ZWE1MmNlM2JiY2I5ODUzMTRmMjQyOD9rZXk9MDcwN2M4YzkwMjdkOWFmZmFhMGQ4ZGJjMWFkZmYxM2M=";

describe("Shopify Storefront suite", () => {
  it("works", async () => {});

  it.skip("update address", async () => {
    fetchMock.dontMock();

    const id = ID_THAT_WORKS;
    const result = await ShopifyStorefrontCheckout.updateAddress(id, {
      firstName: "Ivan",
      lastName: "Dorn",
      address1: "Moscow street 2",
      address2: "",
      phone: "12345678",
      city: "Moscow",
      zip: "112233",
      company: "",
      countryCode: "RU",
      provinceCode: "MOW",
    });

    console.log("storefront response", JSON.stringify(result, null, 2));
  });

  it.skip("update email", async () => {
    fetchMock.dontMock();

    const newId =
      "Z2lkOi8vc2hvcGlmeS9DaGVja291dC8wZTIzMjFiOTgzNWQzZjg4NjM0NGFjNjRhZWZiNTNmYz9rZXk9OWY2Y2RlYTA0YWFhZTEzMDBjYWY4NGIxNDllNTY2ZTM=";

    const id = newId;
    const result = await ShopifyStorefrontCheckout.updateEmail(
      id,
      "nick+test11@cream.ly"
    );

    console.log("storefront response", JSON.stringify(result, null, 2));
  });

  it.skip("fetch checkout", async () => {
    fetchMock.dontMock();

    //const id = ID_THAT_WORKS;
    const id = ID_THAT_WORKS;

    const result = await ShopifyStorefrontCheckout.fetch(id);

    /* const result = await ShopifyStorefrontAttributes.setAttribute(
      id,
      "some_random_attribute",
      "some random value"
    ); */

    console.log("fetch checkout", JSON.stringify(result, null, 2));
  });

  it.skip("attributes updates", async () => {
    const id =
      "Z2lkOi8vc2hvcGlmeS9DaGVja291dC8zMmJkNjMxZWJiYzY0OTE2OTg2MWJhNWVlM2QyMzY0OT9rZXk9MTNkYjc5ZDZiNjBmMjI2MmYzNTU2OTZiZDU1YzVjMjE=";

    //    const result = await ShopifyStorefront.fetch(id);

    const result = await ShopifyStorefrontAttributes.setAttribute(
      id,
      "storeFrontCheckoutId",
      id
    );
    //console.log("setAttribute response", result2);

    const resultUpdateAttributes = await ShopifyStorefrontAttributes.updateSomeAttributes(
      id,
      {
        checkoutId: 16494328217654,
        isPaid: "true",
      }
    );
    // console.log("result updateSomeAttributes", resultUpdateAttributes);

    const result2 = await ShopifyStorefrontAttributes.fetchAttributes(id);

    // console.log("fetch attributes after update", result2);
  });
});

/**
 

Z2lkOi8vc2hvcGlmeS9DaGVja291dC8wZTIzMjFiOTgzNWQzZjg4NjM0NGFjNjRhZWZiNTNmYz9rZXk9ZTVkMWUyNjgzYzQ3Njg3YjE4ZGMwNmNmZDIzYjBkYWQ=
gid://shopify/Checkout/0e2321b9835d3f886344ac64aefb53fc?key=e5d1e2683c47687b18dc06cfd23b0dad
gid://shopify/Checkout/0e2321b9835d3f886344ac64aefb53fc?key=764f6ede13e2bcd822d2ce851a5e3078


{"query":"\n  mutation checkoutEmailUpdateV2($checkoutId: ID!, $email: String!) {\n    checkoutEmailUpdateV2(checkoutId: $checkoutId, email: $email) {\n      checkout {\n        id\n      }\n      checkoutUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n","variables":{"checkoutId":"Z2lkOi8vc2hvcGlmeS9DaGVja291dC8wZTIzMjFiOTgzNWQzZjg4NjM0NGFjNjRhZWZiNTNmYz9rZXk9NzY0ZjZlZGUxM2UyYmNkODIyZDJjZTg1MWE1ZTMwNzg=","email":"nick+test1@cream.ly"}}

{
    "data": {
        "checkoutEmailUpdateV2": {
            "checkout": {
                "id": "Z2lkOi8vc2hvcGlmeS9DaGVja291dC8wZTIzMjFiOTgzNWQzZjg4NjM0NGFjNjRhZWZiNTNmYz9rZXk9ZTVkMWUyNjgzYzQ3Njg3YjE4ZGMwNmNmZDIzYjBkYWQ="
            },
            "checkoutUserErrors": []
        }
    }
}

 */
