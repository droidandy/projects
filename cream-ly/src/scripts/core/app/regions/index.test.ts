import * as configReader from ".";

it("gets matching region", async () => {
  expect(configReader.getRegionByCode("BY").countryCodes).toEqual(["BY"]);
});

it("lookup in regionsConfig", async () => {
  const regionCodeFilter = (region: configReader.ConfigRegion) =>
    region.regionCode == "EU";

  expect(configReader.lookUpInRegionsList(regionCodeFilter).regionCode).toEqual(
    "EU"
  );
});

it("gets default region", async () => {
  expect(configReader.getDefaultRegion().regionCode).toBe("EU");
});

it("gets matching host", async () => {
  expect(
    configReader.getRegionMatchingDefaultDomain("creamly.ru").regionCode
  ).toBe("RU");

  expect(
    configReader.getRegionMatchingDefaultDomain("creamly.by").regionCode
  ).toBe("BY");

  expect(
    configReader.getRegionMatchingDefaultDomain("creamly.lv").regionCode
  ).toBe("LV");

  expect(configReader.getRegionMatchingDefaultDomain("creamly.de")).toBe(null);
});

it("gets matching countryCode", async () => {
  expect(configReader.getRegionMatchingCountryCode("CA").regionCode).toBe("US");

  expect(configReader.getRegionMatchingCountryCode("BY").regionCode).toBe("BY");

  expect(configReader.getRegionMatchingCountryCode("CH").regionCode).toBe("EU");

  expect(configReader.getRegionMatchingCountryCode("LV").regionCode).toBe("LV");
});
