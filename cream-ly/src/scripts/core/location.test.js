import * as location from "./location";
describe.skip("location", () => {
  beforeEach(() => {
    location.set(null);
  });

  it("getLocationDataByIP", async () => {
    const data = location.getLocation();

    console.log("location data", data);
  });

  it("location is null by default", async () => {
    const verifyData = await location.get();

    // assertion
    expect(verifyData).toBe(null);
  });

  it("get/set location returns currect data object", async () => {
    const data = {
      countryCode: "unknown",
      countryName: "unknown",
      zip: "unknown",
      currency: "EUR",
    };

    // action
    location.set(data);
    const verifyData = await location.get();

    // assertion
    expect(verifyData).toBe(data);
  });

  it("get location by IP stores the object", async () => {
    // action
    const verifyData1 = await location.get(true);
    const verifyData2 = await location.get();

    // assertion
    expect(verifyData1).not.toBe(null);
    expect(verifyData1).toBe(verifyData2);
  });
});
