import * as Pages from "./pages";

describe("Router.Pages", () => {
  it("config with string", async () => {
    const config = "string";
    const result = Pages.standardizeOptionConfig(config);
    expect(result).toEqual({ pageOptionKey: "string", getParam: "string" });
  });

  it("config with key:getParam pair", async () => {
    const config = { explicitOptionNameForConvinience: "short_url_param" };
    const result = Pages.standardizeOptionConfig(config);
    expect(result).toEqual({
      pageOptionKey: "explicitOptionNameForConvinience",
      getParam: "short_url_param",
    });
  });

  it("generateURIfromOptionsConfig", async () => {
    const configOfAcceptedPageOptions = [
      "string",
      { someKey: "param" },
      "keyNotInOptions",
      { arrayKey: "arrayKey[]" },
    ];
    const options = {
      string: "someValue",
      someKey: "someValue2",
      keyNotInConfig: "someValue3",
      arrayKey: ["arrayValue1", "arrayValue2"],
    };

    const result = Pages.generateURIpartFromOptions(
      options,
      configOfAcceptedPageOptions
    );

    expect(result).toBe(
      "string=someValue&param=someValue2&arrayKey[]=arrayValue1&arrayKey[]=arrayValue2"
    );
  });

  it("getURL", () => {
    expect(Pages.getURLForPageType(Pages.PAGE_CUSTOMER_ACCOUNT)).toBe(
      "/account/"
    );
    expect(
      Pages.getURLForPageType(Pages.PAGE_PRODUCT_DETAILS, {
        handle: "flower-powder",
        lang: "ru",
        variantId: 2,
      })
    ).toBe("/products/flower-powder/?variantId=2");
  });

  it.skip("extractOptionsFromURL", () => {
    /*  expect(Pages.getURLForPageType(Pages.PAGE_CUSTOMER_ACCOUNT)).toBe(
      "/account/"
    ); */

    const result = Pages.extractOptionsFromURL(
      "/products/flower-powder/?variantId=2",
      Pages.PAGE_PRODUCT_DETAILS,
      {
        handle: "flower-powder",
      }
    );

    expect(result).toStrictEqual({
      handle: "flower-powder",
      variantId: "2",
    });
  });

  it.skip("findPageTypeByURL", () => {
    expect(
      Pages.findPageTypeByURL("/products/flower-powder/?variantId=2")
    ).toBe(Pages.PAGE_PRODUCT_DETAILS);
  });
});
