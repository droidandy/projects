//@ts-nocheck
import * as CreamlyFirebase from "./shopify.checkout";

describe("CreamlyFirebase suite", () => {
  it("works", async () => {});

  it.skip("create checkout", async () => {
    //fetchMock.dontMock();

    const token = "some_tokent123";
    const checoutId =
      "Z2lkOi8vc2hvcGlmeS9DaGVja291dC8wYmJlMjAzMjU2MDI1NmZlNThkNmM5ZWRkNzdkYmZmZT9rZXk9ZTlkZmU2YzE3MDdmMDE5NzU1MTRhYTQ4NWI4MDA5YzQ=";
    const email = "nick+test2@cream.ly";

    const result = await CreamlyFirebase.checkoutUpdateEmail(
      token,
      checoutId,
      email
    );

    console.log("checkout updated", JSON.stringify(result, null, 2));
  });
});
