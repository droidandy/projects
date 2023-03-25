import * as ShopifyCartAttributes from "@Core/api/shopify.cart/attributes";

export const setNewQuizAnswers = async (skinType: string, goals: string[]) => {
  return ShopifyCartAttributes.setAttributes({
    skinType,
    skinCareGoals: goals,
    selectedSKU: [],
  });
};

export const changeNote = async (customerComment: string) => {
  return ShopifyCartAttributes.setNote(String(customerComment));
};

export const changeVideoGoals = async (goals: string[]) => {
  return ShopifyCartAttributes.setAttributes({
    videoGoals: goals,
  });
};

export const changeSelectedSKU = async (skuList: string[]) => {
  return ShopifyCartAttributes.setAttributes({
    selectedSKU: skuList,
  });
};
