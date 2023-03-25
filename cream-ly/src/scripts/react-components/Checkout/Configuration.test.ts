import * as CheckoutConfiguration from "./Configuration";

describe("CheckoutConfiguration", () => {
  it("isShippingRequired - digital if all items don't require shipping", async () => {
    const checkoutState = {
      items: [
        { product: { isShippingRequired: false } },
        { product: { isShippingRequired: false } },
      ],
    };
    const result = CheckoutConfiguration.isShippingRequired(checkoutState);

    expect(result).toBe(false);
  });
  it("isShippingRequired -  physical if one items require shipping", async () => {
    const checkoutState = {
      items: [
        { product: { isShippingRequired: true } },
        { product: { isShippingRequired: false } },
      ],
    };
    const result = CheckoutConfiguration.isShippingRequired(checkoutState);

    expect(result).toBe(true);
  });

  it.skip("PaymentMethod - by default is free", async () => {
    const checkoutState = {};
    const type = CheckoutConfiguration.definePaymentMethod(checkoutState);

    expect(type).toBe(CheckoutConfiguration.PAYMENT_METHODS.PAYMENT_FREE);
  });

  it.skip("PaymentMethod - if country is BY and items have price  - webpay", async () => {
    const checkoutState = {
      defaultCountryCode: "BY",
      items: [{ price: 1, product: {} }],
    };
    const type = CheckoutConfiguration.definePaymentMethod(checkoutState);

    expect(type).toBe(CheckoutConfiguration.PAYMENT_METHODS.PAYMENT_WEBPAY);
  });

  it.skip("PaymentMethod - if country is RU and items have price - yandex", async () => {
    const checkoutState = {
      defaultCountryCode: "RU",
      items: [{ price: 1, product: {} }],
    };
    const type = CheckoutConfiguration.definePaymentMethod(checkoutState);

    expect(type).toBe(
      CheckoutConfiguration.PAYMENT_METHODS.PAYMENT_YANDEX_KASSA
    );
  });

  it("PaymentMethod - if items have price and no special country ", async () => {
    const checkoutState = {
      items: [{ price: 1, product: {} }],
    };
    const type = CheckoutConfiguration.definePaymentMethod(checkoutState);

    expect(type).toBe(
      CheckoutConfiguration.PAYMENT_METHODS.PAYMENT_SHOPIFY_DEFAULT
    );
  });
});
