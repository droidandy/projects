export {};

declare global {
  interface IProductVariant {
    id: string;
    isOutOfStock: boolean;
    price: string;
    sku: string;
    title: string;
  }

  interface IProductImageNode {
    id: string;
    originalSrc: string;
    transformedSrc: string;
  }

  interface IProductVariantNode {
    id: string;
    price: string;
    sku: string;
    title: string;
  }

  interface IProduct {
    availableForSale: boolean;
    handle: string;
    id: string;
    images: {
      edges: IProductImageNode[];
    };
    sku?: string;
    productType: string;
    tags: string[];
    title: string;
    variants: {
      edges: IProductVariantNode[];
    };
    videos: IProductVideo[];
  }

  interface IProductVideo {
    vimeoId: number;
  }

  interface IQuizProduct {
    handle: string;
    // variants: {
    //   edges: IProductVariantNode[];
    // };
    sku: string;
    variantId: string;
  }
}
