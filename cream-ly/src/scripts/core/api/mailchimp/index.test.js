import * as API from ".";
import fixtureResponseSuccess from "./fixtures/success";
import fixtureResponseFail from "./fixtures/fail";

describe("location", () => {
  beforeEach(() => {
    fetchMock.dontMock();
  });

  it.skip("works", async () => {
    const result = await API.default({ email: "nick+test22@cream.ly" });
    console.log("result", result);
  });

  /*   it("success response", async () => {
    fetchMock.once(JSON.stringify(fixtureResponseSuccess));
    const data = await API.default();
    expect(data.status).toBe("success");
    expect(data.city).toBe("Amsterdam");
  });

  it("response status failed", async () => {
    fetchMock.once(JSON.stringify(fixtureResponseFail));
    const data = await API.default();
    expect(data).toBe(undefined);
  }); */
});
