//@ts-nocheck
import gql from "graphql-tag";
import { grahqlFetch } from "../";

const queryGetProducts = gql`
  {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle

          tags
          availableForSale
          images(first: 30) {
            edges {
              node {
                id
                transformedSrc
                originalSrc
              }
            }
          }
          productType

          variants(first: 20) {
            edges {
              node {
                id
                sku
                title
                image {
                  src
                }
                presentmentPrices(first: 20) {
                  edges {
                    node {
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
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

export const fetch = (): Shopify.Storefront.IResponseProducts => {
  return grahqlFetch(queryGetProducts).then((response) => {
    if (!response)
      throw Error(
        "no response from products graphql. check if fetch method is mocked maybe"
      );
    if (response.errors)
      throw Error(
        "errors in graphql request " + JSON.stringify(response.errors)
      );

    return response.data as Shopify.Storefront.IResponseProducts;
  });
};
