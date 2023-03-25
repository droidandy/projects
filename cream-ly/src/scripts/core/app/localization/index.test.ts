import * as localization from ".";

import * as UserPreferences from "@Core/app/user/preferences";
jest.mock("@Core/app/user/preferences");

import * as Router from "@Core/app/router";
jest.mock("@Core/app/router");

//import { getLanguageCodes as getBrowserLanguageCodes } from "@Core/app/user/browserSettings";

describe("localization", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("localization default return null on redirect", async () => {
    const windowNavigator = { language: "fr" };
    const currentLanguageCode = "de";
    const currentCurrencyCode = "BYN";
    const currentHost = "cream.ly";
    const currentURL = `https:/${currentHost}/`;
    const countryCodeBasedOnIPLocation = "NL";

    const result = await localization.default(
      windowNavigator,
      currentLanguageCode,
      currentCurrencyCode,
      currentHost,
      currentURL,
      countryCodeBasedOnIPLocation
    );

    expect(result).toBe(null);
    expect(Router.reloadWithNewLocalizationSettings).toHaveBeenCalledWith(
      currentURL,
      null,
      "ru",
      null,
      null
    );
  });

  it("getLocalizatonSettings", async () => {
    const windowNavigator = { language: "de", languages: ["fr", "ru"] };
    const currentLanguageCode = "dev";
    const currentCurrencyCode = "BYN";
    const currentHost = "cream.ly";
    const countryCodeBasedOnIPLocation = "NL";

    const result = localization.getLocalizatonSettings(
      windowNavigator,
      currentLanguageCode,
      currentCurrencyCode,
      currentHost,
      countryCodeBasedOnIPLocation
    );

    expect(result).toEqual({
      regionCode: "EU",
      languageCode: "ru",
      currencyCode: "EUR",
      fulfillmentCode: "NL",
    });
  });

  it("redirectTo RU", async () => {
    const currentLanguageCode = "en";
    const currentCurrencyCode = "EUR";
    const currentHost = "cream.ly";
    const currentURL = `https://${currentHost}/`;

    const result = await localization.redirectIfNeeded(
      currentLanguageCode,
      currentCurrencyCode,
      currentHost,
      currentURL,
      {
        regionCode: "RU",
        languageCode: "ru",
        currencyCode: "RUB",
      }
    );

    expect(result).toBe(true);
    expect(Router.reloadWithNewLocalizationSettings).toHaveBeenCalledWith(
      "https://cream.ly/",
      "creamly.ru",
      "ru",
      "RUB",
      "RU"
    );
  });

  it("no redirect needed", async () => {
    const currentLanguageCode = "en";
    const currentCurrencyCode = "EUR";
    const currentHost = "cream.ly";
    const currentURL = `https://${currentHost}/`;

    const result = await localization.redirectIfNeeded(
      currentLanguageCode,
      currentCurrencyCode,
      currentHost,
      currentURL,
      {
        regionCode: "EU",
        languageCode: currentLanguageCode,
        currencyCode: currentCurrencyCode,
      }
    );

    expect(result).toBe(false);
    expect(Router.reloadWithNewLocalizationSettings).toHaveBeenCalledTimes(0);
  });
});
