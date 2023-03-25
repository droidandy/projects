import * as browserSettings from "./browserSettings";

it("parseLanguageCodeFromNavigatorString", async () => {
  const strings = ["en", "en-US"];
  const expectedResults = ["en", "en"];

  strings.map((langString, index) => {
    const result = browserSettings.parseLanguageCodeFromNavigatorString(
      langString
    );
    expect(result).toBe(expectedResults[index]);
  });
});

it("parseLanguagesFromNavigator", async () => {
  const strings = ["en-US", "zh-CN", "ja-JP"];
  const expectedResults = ["en", "zh", "ja"];

  const result = browserSettings.parseLanguagesFromNavigator(strings);
  expect(result).toEqual(expectedResults);
});
