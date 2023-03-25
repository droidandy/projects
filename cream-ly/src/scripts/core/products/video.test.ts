import * as Video from "./video";

describe("Products Video", () => {
  it("isVideoProduct", async () => {
    expect(Video.isVideoProduct("cream-my-body")).toBe(false);
    expect(Video.isVideoProduct("video-aging")).toBe(true);
  });

  it("getList", () => {
    const list = Video.getVideosList("ru", "RUB", undefined, undefined);
    expect(list.length > 0).toBe(true);
  });

  it("getsTranslations", () => {
    const result3 = Video.getTranslations("video-2-limfa");
    // console.log(JSON.stringify(result3, null, 2));

    const result2 = Video.getTranslations("video-2-limfa", "dev");
    // console.log(JSON.stringify(result2, null, 2));
  });
});
