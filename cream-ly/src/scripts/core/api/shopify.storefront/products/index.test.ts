//jest.mock("shopify-buy");
//@ts-nocheck
import * as ShopifyStorefrontProducts from ".";
describe("Shopify Storefront Products", () => {
  it.skip("Products Fetch", async () => {
    const result = await ShopifyStorefrontProducts.fetch();
    /* console.log(
      "fetch attributes after update",
      JSON.stringify(
        result.products.edges.filter(
          (product) => product.node.handle == "cream-my-body"
        )
      )
    ); */

    console.log(JSON.stringify(result));
  });
});
