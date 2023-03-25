//@ts-nocheck
import gql from "graphql-tag";
import { grahqlFetch } from "..";

export default (currencyCode: string): Promise<skuPricePair> => {
  return grahqlFetch(
    queryGetProductVariantsPrices(currencyCode)
  ).then((response) => transformResponseToKeyValuePair(response.data));
};

export const transformResponseToKeyValuePair = (
  responseData: IResponseProductVariantsPrices
): skuPricePair => {
  if (
    !responseData ||
    !responseData.products ||
    !Array.isArray(responseData.products.edges)
  )
    throw Error("not correct input " + JSON.stringify(responseData));

  return responseData.products.edges.reduce((allVariants, productEdge) => {
    const variantsObject = productEdge.node.variants.edges.reduce(
      (productVariants, variantEdge) => {
        const variant = variantEdge.node;

        if (!variant.sku) return productVariants;

        productVariants[variant.sku] = Number(
          variant.presentmentPrices.edges[0].node.price.amount
        );
        return productVariants;
      },

      {}
    );

    return { ...allVariants, ...variantsObject };
  }, {});
};

const queryGetProductVariantsPrices = (currencyCode: string) => gql`
{
  products(first: 50) {
    edges {
      node {
        variants(first: 20) {
          edges {
            node {
              sku
              presentmentPrices(first: 1, presentmentCurrencies: ${currencyCode}) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

interface IResponseProductVariantsPrices {
  products: {
    edges: [
      {
        node: {
          variants: {
            edges: [
              {
                node: {
                  sku: string;
                  presentmentPrices?: {
                    edges: [
                      {
                        node: {
                          price: Shopify.Storefront.IPricePair;
                        };
                      }
                    ];
                  };
                };
              }
            ];
          };
        };
      }
    ];
  };
}

interface skuPricePair {
  [sku: string]: number;
}
