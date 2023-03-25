import * as deliveryCalculator from "./deliveryCostCalculator";

describe("checkout.deliveryCalculator", () => {
  it("getZonesBasedOnAddress BY", async () => {
    const address = {
      countryCode: "BY",
    };
    const zone = deliveryCalculator.getShippingZoneBasedOnAddress(address);
    expect(zone.countries[0].code).toBe("BY");
  });

  it("getZonesBasedOnAddress KZ", async () => {
    const address = {
      countryCode: "KZ",
    };
    const zone = deliveryCalculator.getShippingZoneBasedOnAddress(address);
    expect(zone.countries[1].code).toBe("KZ");
  });

  it("getZonesBasedOnAddress RU without region throw error ", async () => {
    const address = {
      countryCode: "RU",
    };

    // expect.assertions(1);

    try {
      deliveryCalculator.getShippingZoneBasedOnAddress(address);
    } catch (e) {
      /* expect(e.message).toEqual(
        "regionCode is missing to filter country shipping zones"
      ); */
    }
  });

  it("getZonesBasedOnAddress RU with region", async () => {
    const address = {
      countryCode: "RU",
      provinceCode: "AMU",
    };
    const zone = deliveryCalculator.getShippingZoneBasedOnAddress(address);
    expect(zone.name).toBe("russia 20");
  });

  it.skip("getZonesBasedOnAddress for rest of the world", async () => {
    const address = {
      countryCode: "SA",
    };
    const zone = deliveryCalculator.getShippingZoneBasedOnAddress(address);
    expect(zone.countries[0].code).toBe("*");
  });

  it("calculateDeliveryCostInEURForShippingZone ", async () => {
    const zone = {
      price_based_shipping_rates: [
        {
          price: 0,
          min_order_subtotal: 50,
          max_order_subtotal: 0,
        },
        {
          price: 3,
          min_order_subtotal: 0,
          max_order_subtotal: 50,
        },
      ],
    };

    expect(
      deliveryCalculator.getRatePriceAndHandleForShippingZone(zone, 50).price
    ).toBe(0);
    expect(
      deliveryCalculator.getRatePriceAndHandleForShippingZone(zone, 60).price
    ).toBe(0);
    expect(
      deliveryCalculator.getRatePriceAndHandleForShippingZone(zone, 45).price
    ).toBe(3);
  });

  it("calculatesRate for BY address", async () => {
    const amount = 10;

    const options = deliveryCalculator.getRatesForShippingZone(
      deliveryCalculator.getShippingZoneBasedOnAddress({
        countryCode: "BY",
      }),
      amount
    );

    expect(options[0].price).toBe(3);
  });

  it("calculatesRate for BY address free", async () => {
    const amount = 60;

    const options = deliveryCalculator.getRatesForShippingZone(
      deliveryCalculator.getShippingZoneBasedOnAddress({
        countryCode: "BY",
      }),
      amount
    );
    expect(options[0].price).toBe(0);
  });

  it("calculates delivery based on address", async () => {
    const amount = 27;
    const address = {
      countryCode: "RU",
      provinceCode: "AMU",
    };

    const { price, handle } = deliveryCalculator.default(address, amount);
    expect(price).toBe(20);
    expect(handle).toBe(
      "shopify-доставка курьером или почтовой службой с трекинг-номером (5-10 раб дней)-20.00"
    );
  });

  it("mathces shopify shippingRateHandle encoding ", async () => {
    const name =
      "доставка курьером или почтовой службой с трекинг-номером (5-10 раб дней)";
    const price = 10;
    const encodedExample =
      "shopify-%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0%20%D0%BA%D1%83%D1%80%D1%8C%D0%B5%D1%80%D0%BE%D0%BC%20%D0%B8%D0%BB%D0%B8%20%D0%BF%D0%BE%D1%87%D1%82%D0%BE%D0%B2%D0%BE%D0%B9%20%D1%81%D0%BB%D1%83%D0%B6%D0%B1%D0%BE%D0%B9%20%D1%81%20%D1%82%D1%80%D0%B5%D0%BA%D0%B8%D0%BD%D0%B3-%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%D0%BE%D0%BC%20(5-10%20%D1%80%D0%B0%D0%B1%20%D0%B4%D0%BD%D0%B5%D0%B9)-10.00";

    expect(
      encodeURI(deliveryCalculator.getShippingRateHandle({ name, price }))
    ).toBe(encodedExample);
  });
});
