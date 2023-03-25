import * as Inventory from ".";

import * as Fulfillment from "../fulfillmentLocation";
jest.mock("../fulfillmentLocation");

describe("Inventory", () => {
  it("isProductAvailable", async () => {
    Inventory.setOutOfStockConfig({
      "SKU-cream-my-body": ["NL", "UA"],
      "SKU-cream-sensitive": ["NL"],
    });

    expect(Inventory.isProductAvailable("cream-my-body", "BY")).toBe(true);
    // expect(Inventory.isProductAvailable("cream-my-body", "NL")).toBe(false);
    //expect(Inventory.isProductAvailable("cream-my-body", "UA")).toBe(false);
    expect(Inventory.isProductAvailable("cream-my-skin", "NL")).toBe(true);
  });

  it("isProductAvailable no countryCode set", async () => {
    Inventory.setOutOfStockConfig({
      "SKU-cream-my-body": ["NL", "UA"],
    });

    /*  Fulfillment.getFulfillmentCountryCode = jest.fn().mockReturnValue("BY");
    expect(Inventory.isProductAvailable("cream-my-body")).toBe(true);

    Fulfillment.getFulfillmentCountryCode = jest.fn().mockReturnValue("UA");
    expect(Inventory.isProductAvailable("cream-my-body")).toBe(false); */
  });
});
