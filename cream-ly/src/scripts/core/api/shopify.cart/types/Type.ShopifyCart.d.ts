export {};
declare global {
  interface IShopifyCart {
    token: string;
    note: string;
    attributes: { [key: string]: string };

    currency: string;
    original_total_price: number; //in cents of current currency
    total_price: number;
    items_subtotal_price: number;
    total_discount: number;

    total_weight: number;
    requires_shipping: boolean;

    item_count: number;
    items: Array<IShopifyCartItem>;

    cart_level_discount_applications: Array<Object>;
  }
}
