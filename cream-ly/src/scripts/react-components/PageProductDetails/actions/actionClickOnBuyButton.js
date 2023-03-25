import { add } from "@Core/api/shopify.cart/items";
import * as Router from "@Core/app/router";

const prepareProperties = (skinType, skinGoals = []) => {
  const properties = {};

  if (skinType) {
    properties["Skin Type"] = skinType;
  }

  if (Array.isArray(skinGoals) && skinGoals.length > 0) {
    const skinGoalsString = Object.keys(skinGoals)
      .map((k) => {
        return skinGoals[k];
      })
      .join(",");
    properties["Skin Care Goals"] = skinGoalsString;
  }

  return properties;
};

export default (variantId, skinType = null, skinGoals = []) => {
  if (!variantId) return;
  return add(variantId, prepareProperties(skinType, skinGoals)).then(
    Router.goToCart
  );
};
