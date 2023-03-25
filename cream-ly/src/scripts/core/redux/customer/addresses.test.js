/*

customer={{
    ...customerWithOnePreviousAddress,
    addresses: [
      { ...addressBYData, firstName: "Ivan", lastName: "Ivan", id: 1231 },

      { ...addressBYData, city: "Podolks", address1: "Podolks", id: 12312 },

      { ...addressBYData },
    ],
  }}

  */

import * as addresses from "./addresses";

describe("redux/customer/addresses", () => {
  it("address which has the same name is digital", () => {
    const address = { firstName: "Ivan", lastName: "Ivan" };
    const result = addresses.isDigitalAddress(address);
    expect(result).toBe(true);
  });
  it("address which has the street and city is digital", () => {
    const address = { city: "Podolks", address1: "Podolks" };
    const result = addresses.isDigitalAddress(address);
    expect(result).toBe(true);
  });
  it("address with different name, city and street is not digital", () => {
    const address = {
      firstName: "ivan",
      lastName: "not ivan",
      city: "Podolks",
      address1: "streat1",
    };
    const result = addresses.isDigitalAddress(address);
    expect(result).toBe(false);
  });

  it("list with digital addresses is filtered", () => {
    const address1 = { firstName: "Ivan", lastName: "Ivan" };
    const address2 = { city: "Podolks", address1: "Podolks" };

    const result = addresses.default([address1, address2]);
    expect(result).toStrictEqual([]);
  });
});
