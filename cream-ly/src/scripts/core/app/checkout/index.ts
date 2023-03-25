import * as ShopifyCartItems from "@Core/api/shopify.cart/items";

interface IProductToAdd {
  sku: string;
  variantId?: number;
  properties?: object;
  quantity?: number;
}

export const mapItems2ShopifyCartUpdate = (items) => {
  return items.reduce(
    (acc, item) => ({ ...acc, [item.variantId]: item.quantity }),
    {}
  );
};

export const addItem = async (product: IProductToAdd) => {};

export const updateMultipleItems = async (products: IProductToAdd[]) => {
  ShopifyCartItems.updateMultipleItems(mapItems2ShopifyCartUpdate(items));
};

export const changeQuantity = async (cartLine: number, quantity: number) => {
  ShopifyCartItems.changeItemQuanity(cartLine, quantity);
};
