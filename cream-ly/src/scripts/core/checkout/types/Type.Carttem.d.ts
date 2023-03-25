export {};
declare global {
  interface ICartItem {
    sku: string;
    variantId: number;
    key: string; //needed for quantity change in card

    isOutOfStock: boolean;

    price: number;
    originalPrice: number;
    quantity: number;

    properties?: ICartItemProperties;
    product: ICartItemProduct;
  }

  interface ICartItemProperties {
    skinType?: string;
    skinGoals?: Array<string>;
  }

  interface ICartItemProduct {
    title: string;
    handle: string;
    url: string;
    imageURL: string;
    isShippingRequired: boolean;
  }
}
