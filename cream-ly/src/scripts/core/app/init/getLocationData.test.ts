//@ts-nocheck

import * as getLocationData from "./getLocationData";

it("getDefaultCountryCodeFromHost", async () => {
  expect(getLocationData.getDefaultCountryCodeFromHost("creamly.lv")).toEqual(
    "LV"
  );
  expect(getLocationData.getDefaultCountryCodeFromHost("creamly.de")).toEqual(
    "NL"
  );
  expect(getLocationData.getDefaultCountryCodeFromHost("cream.ly")).toEqual(
    "NL"
  );
  expect(getLocationData.getDefaultCountryCodeFromHost("creamly.ua")).toEqual(
    "UA"
  );
});
