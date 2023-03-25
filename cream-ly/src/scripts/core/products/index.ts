// @ts-nocheck
import * as i18n from "@Core/i18n";
import * as Storefront from "../api/shopify.storefront";
import { getVariantPriceForCurrency } from "../api/shopify.storefront/products/helper";

import { isProductAvailable, isSKUAvailable } from "./inventory";

import storeFrontProductsData from "@Core/api/shopify.storefront/products/cache/products.list";
// import * as Router from "../app/router";

export const PRODUCT_HANDLE_CREAM = "cream-my-skin";
export const PRODUCT_HANDLE_FLOWER_POWDER = "flower-powder-my-skin";
export const PRODUCT_HANDLE_OIL = "nourish-my-skin";
export const PRODUCT_HANDLE_EXFOLIATE = "exfoliate-my-skin";
export const PRODUCT_HANDLE_CREAM_BODY = "cream-my-body";
export const PRODUCT_HANDLE_BRUSH = "brush-my-body";
export const PRODUCT_HANDLE_CONSULTATION = "individual-consultation";
export const PRODUCT_HANDLE_CONSULTATION_MASSAGE = "individual-face-massage";
export const PRODUCT_HANDLE_GIFT_CARD = "gift-card";

function convertVariantsArrayToObject(
  array: IProductVariant[],
  key: string = "sku"
) {
  const initialValue = {};
  return array.reduce((obj, variant) => {
    return {
      ...obj,
      [variant[key]]: variant,
    };
  }, initialValue);
}

const STOREFRONT_ENTITY_TYPE_PRODUCT_VARIANT = "ProductVariant";
// const STOREFRONT_ENTITY_TYPE_PRODUCT = "Product";

export const PRODUCT_TAG_QUIZ = "quizProduct";
export const PRODUCT_TAG_VIDEO = "videoProduct";

export function getVariantIdBySKU(sku: string): string | null {
  const list = storeFrontProductsData.products.edges.map(
    (element) => element.node
  );

  const variant = list
    .map((product) => {
      if (!product.variants || !product.variants.edges) return [];
      return product.variants.edges.map((element) => element.node);
    })
    .flat()
    .filter((variant) => variant.sku == sku)
    .shift();

  if (!variant) return null;

  return Storefront.storefrontId2number(
    variant.id,
    STOREFRONT_ENTITY_TYPE_PRODUCT_VARIANT
  );
}

const shopifyImageResize = (
  originalURL: string,
  targetSize: string
): string => {
  const pattern = /(.+)(\.[a-z]{3})\?v=\d+$/;
  const match = originalURL.match(pattern);
  if (!match || !match[1] || !match[2]) return originalURL;
  return match[1] + targetSize + match[2];
};

export const getFeedbacks = (handle: string, lang = "ru") => {
  if (handle == "cream-my-skin-with-peptides") handle = "cream-my-skin";

  const stringFeedback = i18n.getTranslation({
    key: `${handle}.feedbacks`,
    namespace: "products",
    lang,
  });

  const feedbacks = stringFeedback.includes("[")
    ? stringFeedback
        .replace("[", "")
        .replace("]", "")
        .split('",')
        .map((item) => item.replace('"', "").trim())
        .filter((item) => !!item.length)
    : [];

  return feedbacks;
};

const productSizeInMl = (handle: string): number | null => {
  switch (handle) {
    case "flower-powder-my-skin":
      return 150;
    case "cream-my-skin":
    case "cream-my-skin-with-peptides":
      return 50;
    case "nourish-my-skin":
      return 30;
    case "exfoliate-my-skin":
      return 30;
    case "cream-my-body":
      return 200;
    case "clean-my-skin":
      return 150;
  }
  return null;
};

export function isProductHiddenInLang(product, lang: string): boolean {
  if (lang == "en") {
    const filterHandles = [
      "videos",
      "individual-skincare-consultation",
      "individual-face-massage",
    ];

    return (
      product.handle.includes("video") || filterHandles.includes(product.handle)
    );
  }

  return false;
}

export const getStorefrontProductByHandle = (productHandle: string) => {
  return storeFrontProductsData.products.edges
    .map((element) => element.node)
    .filter((product) => product.handle == productHandle)
    .shift();
};

export function getList(
  filterTag = null,
  presentmentCurrency = "EUR",
  currencyRateExchange = 1,
  skuPricesPairs: Object = {}
) {
  let list = storeFrontProductsData.products.edges.map(
    (element) => element.node
  );

  if (filterTag)
    list = list.filter((product) => product.tags.includes(filterTag));

  return list.map((product) => {
    const images = product.images.edges
      .map((element) => element.node)
      // .filter((image, index) => index != 1) this removes duplicated images
      .map((image) => ({
        big: image.transformedSrc, // TODO ADD target size
        big_original: shopifyImageResize(image.originalSrc, "_1000x"),
        small: image.transformedSrc,
        small_original: shopifyImageResize(image.originalSrc, "_200x"),
      }));

    const image = images.length ? images[0] : null;

    const variants = product.variants.edges
      .map((element) => element.node)
      .map((variant) => ({
        ...variant,
        image: variant.image
          ? {
              small: shopifyImageResize(variant.image.src, "_200x"),
              big: shopifyImageResize(variant.image.src, "_1000x"),
            }
          : null,
        sizeInMl: productSizeInMl(product.handle),
        isOutOfStock: !isSKUAvailable(variant.sku),
        id: Storefront.storefrontId2number(
          variant.id,
          STOREFRONT_ENTITY_TYPE_PRODUCT_VARIANT
        ),
        price: getVariantPrice(
          variant,
          presentmentCurrency,
          currencyRateExchange,
          skuPricesPairs
        ),
      }));

    const prices = variants.map((variant) => variant.price);

    const [priceMin, priceMax] = [
      Math.min.apply(null, prices),
      Math.max.apply(null, prices),
    ];
    const sizes = variants.map((item) => item.sizeInMl);
    const [sizeMin, sizeMax] = [
      Math.min.apply(null, sizes),
      Math.max.apply(null, sizes),
    ];
    const sizeRange = sizeMax !== sizeMin ? `${sizeMin} - ${sizeMax}` : null;

    return {
      ...product,
      image,
      images,

      priceRange: { min: priceMin, max: priceMax },
      price: priceMax,
      sizeInMl: sizeRange || productSizeInMl(product.handle),
      isOutOfStock: !isProductAvailable(product.handle),
      isHiddenInLang: { en: isProductHiddenInLang(product, "en") },
      variants: convertVariantsArrayToObject(variants, "sku"),
    };
  });
}

export function getQuizProducts(): IQuizProduct[] {
  const list = getList(PRODUCT_TAG_QUIZ);

  return list.map((product) => ({
    handle: product.handle,
    variants: product.variants,
    sku: product.variants[Object.keys(product.variants)[0]].sku,
    variantId: product.variants[Object.keys(product.variants)[0]].id,
  }));
}

export const getVariantPrice = (
  variant: IProductVariant,
  presentmentCurrency,
  currencyRateExchange,
  skuPricesPairs
) => {
  if (!skuPricesPairs || !skuPricesPairs[variant.sku])
    return (
      Number(getVariantPriceForCurrency(variant, presentmentCurrency)) *
      currencyRateExchange
    );

  return skuPricesPairs[variant.sku];
};
