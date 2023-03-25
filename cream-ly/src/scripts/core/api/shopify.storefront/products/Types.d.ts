export {};
declare global {
  namespace Shopify {
    namespace Storefront {
      interface IResponseProducts {
        products: {
          edges: [
            {
              node: {
                id: string;
                title: string;
                handle: string;
                availableForSale: boolean;
                productType: string;
                tags: string[];
                images: {
                  edges: IProductImageNode[];
                };
                variants: {
                  edges: IProductVariantNode[];
                };
              };
            }
          ];
        };
      }

      interface IProductImageNode {
        id: string;
        originalSrc: string;
        transformedSrc: string;
      }

      interface IProductVariantNode {
        id?: string;
        price?: string;
        sku?: string;
        title?: string;
        presentmentPrices?: {
          edges: IPresentementPricesNode[];
        };
      }

      interface IPresentementPricesNode {
        price: IPricePair;
        compareAtPrice?: IPricePair | null;
      }

      interface IPricePair {
        amount: string;
        currencyCode: string;
      }
    }
  }
}
