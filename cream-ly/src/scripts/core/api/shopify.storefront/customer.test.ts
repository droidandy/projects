import * as ShopifyStorefrontCustomer from "./customer";

import * as ShopifyStorefront from ".";
jest.mock(".");

export const FIXTURE_RESPONSE_ERRORS: ShopifyStorefrontCustomer.StorefrontCustomerMutationCreateResponse = {
  data: {
    customerCreate: {
      customer: null,
      customerUserErrors: [
        {
          code: "CUSTOMER_DISABLED",
          field: null,
          message:
            "Мы отправили электронное письмо на адрес nick+test@cream.ly. Перейдите по ссылке, чтобы подтвердить адрес электронной почты.",
        },
        {
          code: "TAKEN",
          field: ["input", "email"],
          message: "Email has already been taken",
        },
        {
          code: "TOO_SHORT",
          field: ["input", "password"],
          message:
            "пароль слишком короткое (должно содержать по крайней мере 5 симв.)",
        },
      ],
    },
  },
};

const FIXTURE_RESPONSE_SUCCESS: ShopifyStorefrontCustomer.StorefrontCustomerMutationCreateResponse = {
  data: {
    customerCreate: {
      customer: {
        id: "Z2lkOi8vc2hvcGlmeS9DdXN0b21lci8zNTI1NjYwNTQwOTgy",
      },
      customerUserErrors: [],
    },
  },
};

describe("Shopify Storefront Customer suite", () => {
  it("throws on wrong input param ", async () => {
    const input = {
      email: "email6@cream.ly",
      password: "12312",
      fakeInput: null,
    };

    expect.assertions(1);

    return expect(ShopifyStorefrontCustomer.create(input)).rejects.toThrow(
      "input has wrong key fakeInput"
    );
  });

  it("creates customer", async () => {
    const input = {
      email: "nick@cream.ly",
      password: "12312",
      firstName: "Nick",
      lastName: "Fro",
      acceptsMarketing: true,
    };

    const response = {
      customer: { id: 12345 },
    };
    //@ts-ignore
    ShopifyStorefront.grahqlFetch = jest.fn().mockResolvedValue(response);

    const result = await ShopifyStorefrontCustomer.create(input);

    return expect(result).toBe(response);
  });
});
