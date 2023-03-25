import * as Router from ".";

describe("Router.Index", () => {
  it("transforms RU url to EN", async () => {
    const url = "http://localhost/pages/products?all=1#hashtag";
    const lang = "en";
    const result = Router.transformCurrentURLtoLocale(url, lang);
    expect(result.toString()).toEqual(
      "http://localhost/en/pages/products?all=1#hashtag"
    );
  });

  it("keep EN url to EN", async () => {
    const url = "http://localhost/en/pages/products?all=1#hashtag";
    const lang = "en";
    const result = Router.transformCurrentURLtoLocale(url, lang);
    expect(result.toString()).toEqual(
      "http://localhost/en/pages/products?all=1#hashtag"
    );
  });

  it("transorm EN url to LV", async () => {
    const url = "http://localhost/en/?all=1#hashtag";
    const newLang = "lv";
    const result = Router.transformCurrentURLtoLocale(url, newLang);
    expect(result.toString()).toEqual("http://localhost/lv/?all=1#hashtag");
  });

  it("transorm RU url to LV", async () => {
    const url = "http://localhost/";
    const newLang = "lv";
    const result = Router.transformCurrentURLtoLocale(url, newLang);
    expect(result.toString()).toEqual("http://localhost/lv/");
  });

  it("transforms EN url to RU, with change of url and currency", async () => {
    const url = "http://localhost:3030/en/pages/products?all=1#hashtag";
    const lang = "ru";
    const result = Router.transformCurrentURLtoLocale(
      url,
      lang,
      "RUB",
      "creamly.ru"
    );
    expect(result.toString()).toEqual(
      "http://creamly.ru:3030/pages/products?all=1&currencyCode=RUB&lang=ru#hashtag"
    );
  });
});
