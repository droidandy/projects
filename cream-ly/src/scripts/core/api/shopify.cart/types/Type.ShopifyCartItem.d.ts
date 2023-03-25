export {};
declare global {
  interface IShopifyCartItem {
    id: number;
    properties?: { [key: string]: string };
    quantity: number;
    variant_id: number;

    product_id: number;
    product_has_only_default_variant: boolean;
    gift_card: boolean;

    sku: string;
    key: string; //key is a defined a combination of <variant_id>:<properties md5 hash>
    title: string; //title of product variant
    url: string; //url of product variant

    handle: string;
    requires_shipping: boolean;
    product_type: string;
    product_title: string;
    product_description: string;
    variant_title: string;
    variant_options: Array<string>;
    options_with_values: Array<{ name: string; value: string }>;

    grams: number;
    vendor: string;
    taxable: boolean;

    price: number; //in cents in current currency
    original_price: number;
    discounted_price: number;
    line_price: number;
    original_line_price: number;
    total_discount: number;
    discounts: Array<Object>;
    line_level_discount_allocations: Array<any>;
    line_level_total_discount: number;

    final_price: number;
    final_line_price: number;

    featured_image: {
      aspect_ratio: number;
      height: number;
      width: number;
      alt: string; //product title
      url: string; // cdn.shopify.com image url
    };
    image: string; //cdn.shopify.com image url
  }
}
