import * as api from "./api.locize";

describe("api.locize", () => {
  it.skip("fetch all", async () => {
    const result = await api.fetchTranslations("en");

    console.log(result);
  });
});
