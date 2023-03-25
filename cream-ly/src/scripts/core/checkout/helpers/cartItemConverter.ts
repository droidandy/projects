import { isSKUAvailable } from "@Core/products/inventory";

const convert = (item: IShopifyCartItem): ICartItem => {
  return {
    sku: item.sku,
    variantId: item.variant_id,
    key: item.key,

    isOutOfStock: !isSKUAvailable(item.sku),

    price: Number(item.price) / 100, //convert from cents
    originalPrice: Number(item.price),

    quantity: item.quantity,

    properties: convertProperties(item.properties),

    product: {
      title: converProductTitle(item), // @todo probably use translation here?
      handle: item.handle,
      url: item.url,
      imageURL: item.featured_image.url,
      isShippingRequired: item.requires_shipping,
    },
  };
};
export default convert;

export const converProductTitle = (item: IShopifyCartItem): string => {
  if (item.handle == "gift-card")
    return item.product_title + " " + item.variant_title;

  return item.product_title;
};

export const convertProperties = (properties: {
  [key: string]: string;
}): ICartItemProperties => {
  const converted: ICartItemProperties = {};

  if (!properties) return converted;

  if (properties["Skin Type"]) converted.skinType = properties["Skin Type"];

  if (properties["Skin Care Goals"]) {
    try {
      converted.skinGoals = properties["Skin Care Goals"]
        .split(",")
        .map((word) => word.trim());
    } catch (e) {}
  }

  return converted;
};
