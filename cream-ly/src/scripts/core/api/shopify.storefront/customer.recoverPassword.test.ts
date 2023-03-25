import * as ShopifyStorefrontCustomerRecover from "./customer.recoverPassword";

import * as ShopifyStorefront from ".";
jest.mock(".");

const FIXTURE_RESPONSE_ERRORS: ShopifyStorefrontCustomerRecover.StorefrontCustomerMutationRecoverPassword = {
  data: {
    customerRecover: {
      customerUserErrors: [
        {
          code: "UNIDENTIFIED_CUSTOMER",
          field: ["email"],
          message: "Could not find customer",
        },
      ],
    },
  },
};

const FIXTURE_RESPONSE_SUCCESS: ShopifyStorefrontCustomerRecover.StorefrontCustomerMutationRecoverPassword = {
  data: {
    customerRecover: {
      customerUserErrors: [],
    },
  },
};

describe("Shopify Storefront Customer suite", () => {
  it("recovers password", async () => {
    const email = "email@email.com";

    //@ts-ignore
    ShopifyStorefront.grahqlFetch = jest
      .fn()
      .mockResolvedValue(FIXTURE_RESPONSE_SUCCESS);

    const result = await ShopifyStorefrontCustomerRecover.default(email);

    expect(result).toBe(FIXTURE_RESPONSE_SUCCESS);
    expect(result.data.customerRecover.customerUserErrors.length == 0).toBe(
      true
    );
  });

  it("errors on request", async () => {
    const email = "email@email.com";

    //@ts-ignore
    ShopifyStorefront.grahqlFetch = jest
      .fn()
      .mockResolvedValue(FIXTURE_RESPONSE_ERRORS);

    const result = await ShopifyStorefrontCustomerRecover.default(email);

    expect(result).toBe(FIXTURE_RESPONSE_ERRORS);
    expect(result.data.customerRecover.customerUserErrors.length > 0).toBe(
      true
    );
  });
});
