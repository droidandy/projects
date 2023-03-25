//@ts-nocheck

export const getPresentmentPricePairs = (
  productVariant: Shopify.Storefront.IProductVariantNode
): Shopify.Storefront.IPresentementPricesNode[] => {
  if (
    !productVariant ||
    !productVariant.presentmentPrices ||
    !productVariant.presentmentPrices.edges
  )
    return [];

  return productVariant.presentmentPrices.edges.map((edge) => edge.node.price);
};

export const getVariantPriceForCurrency = (
  productVariant: Shopify.Storefront.IProductVariantNode,
  requiredCurrencyCode: string = "EUR"
): number | undefined => {
  if (requiredCurrencyCode == "BYN") requiredCurrencyCode = "EUR";

  const mathingPair: Shopify.Storefront.IProductVariantNode | null = getPresentmentPricePairs(
    productVariant
  ).find((pair) => pair.currencyCode == requiredCurrencyCode);

  if (mathingPair) return Number(mathingPair.amount);
  return;
};
