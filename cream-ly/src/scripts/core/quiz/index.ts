// @ts-nocheck
import * as Products from "@Core/products";

export const allSkinTypeGoals = [
  "wrinkles",
  "acne",
  "sensitive",
  "dehydrated",
  "pimple",
  "lighten",
  "antioxidant",
];

export function quiz2skuList(skinType: string, skinGoals) {
  const prefferedOrder = [
    "cream-my-skin",
    "cream-my-skin-with-peptides",
    "flower-powder-my-skin",
    "nourish-my-skin",
    "exfoliate-my-skin",
    "SKU-clean-my-skin",
    "cream-my-body",
    "brush-my-body",
  ];

  const products = Products.getQuizProducts()
    .filter((product) =>
      isProductHandleRecommended(product.handle, skinType, skinGoals)
    )
    .sort((productA, productB) => {
      if (
        prefferedOrder.indexOf(productA.handle) == -1 &&
        prefferedOrder.indexOf(productB.handle) == -1
      )
        return 0;
      if (prefferedOrder.indexOf(productA.handle) == -1) return 1;
      if (prefferedOrder.indexOf(productB.handle) == -1) return -1;

      return (
        prefferedOrder.indexOf(productA.handle) -
        prefferedOrder.indexOf(productB.handle)
      );
    })
    .map((product) => {
      // set correct sku variant based on quiz
      if (product.handle === "cream-my-skin")
        return getCreamSKU(product, skinType, skinGoals).sku;
      if (product.handle === "cream-my-body")
        product.sku = getBodyCreamSKU(skinGoals).sku;
      if (product.handle === "nourish-my-skin")
        return getOilSKU(product, skinType, skinGoals).sku;

      return product.sku;
    });

  return products;
}

export function recommendedProductsList(skinType, skinGoals) {
  // window.theme.quiz is defined in layout/theme.liquid
  if (!skinType || !skinGoals) {
    if (window && window.theme)
      (skinType = window.theme.quiz.skinType),
        (skinGoals = window.theme.quiz.skinCareGoals);
  }

  if (!skinType || !skinGoals) return {};

  const products = quiz2Products(skinType, skinGoals);
  const list = {};

  let product;
  for (const key in products) {
    product = products[key];

    if (product.count) {
      delete product.count;
      delete product.price;

      list[product.handle] = product;
    }
  }

  return list;
}

export function isProductRecommended(productHandle, useAliases) {
  const recommendedProducts = recommendedProductsList();
  if (recommendedProducts[productHandle]) return true;

  if (useAliases) {
    // products page don't display all products, but so we want to show recommendations

    let aliases = [];

    if (
      productHandle === "cream-my-skin" ||
      productHandle === "cream-my-skin-with-peptides"
    ) {
      aliases = ["cream-my-skin", "cream-my-skin-with-peptides"];
      for (const i in aliases) if (recommendedProducts[aliases[i]]) return true;
    }

    if (productHandle === "video-1") {
      aliases = ["video-1", "video-2-limfa", "video-3-osanka"];
      for (const i in aliases) {
        if (recommendedProducts[aliases[i]]) return true;
      }
    }
  }

  return false;
}

function getSkinGoalsList() {
  const allowedGoals = [
    "wrinkles",
    "acne",
    "sensitive",
    "dehydrated",
    "pimple",
    "lighten",
    "edema",
    "capillaries",
    "neck_wrinkles",
    "breast_shape",
    "antioxidant",
    "body",
    "body_atopic",
    "cellulite",
    "cleansing",
  ];

  return allowedGoals;
}

function isProductHandleRecommended(productHandle, skinType, skinGoals) {
  const goalsInclude = (targetGoals) =>
    targetGoals.some((goal) => skinGoals.includes(goal));

  if (productHandle === "exfoliate-my-skin") {
    if (
      skinGoals.includes("sensitive") ||
      (skinType === "dry" && goalsInclude(["lighten"])) ||
      (skinType === "normal" &&
        !goalsInclude(["lighten", "wrinkles", "acne", "pimple"]))
    )
      return false;

    if (
      goalsInclude([
        "wrinkles",
        "acne",
        "dehydrated",
        "pimple",
        "lighten",
        "antioxidant",
      ])
    )
      return true;
  }

  if (
    productHandle === "nourish-my-skin" ||
    productHandle === "flower-powder-my-skin"
  ) {
    if (goalsInclude(allSkinTypeGoals)) return true;
  }

  if (
    productHandle === "cream-my-skin" ||
    productHandle === "cream-my-skin-with-peptides"
  ) {
    if (goalsInclude(["antioxidant"]) && skinType === "dry") {
      if (productHandle === "cream-my-skin") return false;
      if (productHandle === "cream-my-skin-with-peptides") return true;
    }

    if (productHandle === "cream-my-skin") {
      if (goalsInclude(["acne", "pimple", "antioxidant"])) return true;
      if (goalsInclude(["wrinkles"]) || skinType === "dry") return false;

      return true;
    }

    if (productHandle === "cream-my-skin-with-peptides") {
      if (goalsInclude(["antioxidant"])) return false;
      if (goalsInclude(["acne", "pimple"])) return false;
      if (goalsInclude(["wrinkles"]) || skinType === "dry") return true;
    }
  }

  if (productHandle === "clean-my-skin") {
    if (goalsInclude(["cleansing"])) return true;
  }

  if (productHandle === "cream-my-body" || productHandle === "brush-my-body") {
    if (goalsInclude(["body", "body_atopic"])) return true;
  }

  /* if (productHandle === "video-1") {
    if (goalsInclude(["wrinkles", "capillaries"])) return true;
  }

  if (productHandle === "video-2-limfa") {
    if (goalsInclude(["edema", "capillaries"])) return true;
  }

  if (productHandle === "video-3-osanka") {
    if (goalsInclude(["neck_wrinkles", "breast_shape"])) return true;
  }

  if (productHandle === "video-6-cellulite") {
    if (goalsInclude(["cellulite"])) return true;
  }

  if (productHandle === "video-7-mewing") {
    if (goalsInclude(["wrinkles", "edema", "capillaries"])) return true;
  }

  if (productHandle === "video-8-taping") {
    if (goalsInclude(["wrinkles", "edema"])) return true;
  } */

  return false;
}

export const getCreamSKU = (product, skinType, skinGoals) => {
  const goalsInclude = (targetGoals) =>
    targetGoals.some((goal) => skinGoals.includes(goal));
  const goalsForSku = skinGoals.filter(goal => allSkinTypeGoals.includes(goal));

  //Если человек выбирает антиоксидантную защиту, добавляем этот крем всегда, кроме чувствительной кожи
  if (!goalsInclude(["sensitive"]) && goalsInclude(["antioxidant", "acne"]))
    return {
      sku: "SKU-cream-antioxidant",
      goals: goalsForSku,
      skinType,
    };

  if (goalsInclude(["sensitive"])) {
    return {
      sku: "SKU-cream-sensitive",
      goals: goalsForSku,
      skinType,
    };
  }

  return {
    sku: "SKU-cream-normal-mixed-oily",
    goals: goalsForSku,
    skinType,
  };
};

export const getBodyCreamSKU = (skinGoals: string[]) => {
  if (skinGoals.includes("body_atopic")) {
    return {
      sku: "SKU-cream-my-body-atopic",
      goals: ["body_atopic"],
      skinType: "",
    };
  }

  return {
    sku: "SKU-cream-my-body",
    goals: ["body"],
    skinType: "",
  };
};

export const getOilSKU = (product, skinType, skinGoals) => {
  const goalsInclude = (targetGoals) =>
    targetGoals.some((goal) => skinGoals.includes(goal));
  const goalsForSku = skinGoals.filter(goal => allSkinTypeGoals.includes(goal));

  if (skinType === "dry") {
    return {
      sku: "SKU-oil-dry-aged",
      goals: goalsForSku,
      skinType,
    };
  }

  if (skinType === "normal" && goalsInclude(["wrinkles", "dehydrated"])) {
    return {
      sku: "SKU-oil-dry-aged",
      goals: goalsForSku,
      skinType,
    };
  }

  if (skinType === "normal" && skinGoals.includes("sensitive") && !skinGoals.includes("acne")) {
    return {
      sku: "SKU-oil-dry-aged",
      goals: goalsForSku,
      skinType,
    };
  }

  return {
    sku: "SKU-oil-normal-mixed-oily",
    goals: goalsForSku,
    skinType,
  };
};

export function quiz2Products(skinType, skinGoals) {
  const products = Products.getQuizProducts();

  return products.map((product) => {
    if (isProductHandleRecommended(product.handle, skinType, skinGoals)) {
      product.count = 1;

      // set correct sku variant based on quiz
      if (product.handle === "cream-my-skin") {
        product.sku = getCreamSKU(product, skinType, skinGoals).sku;
        product.skinType = getCreamSKU(product, skinType, skinGoals).skinType;
        product.goals = getCreamSKU(product, skinType, skinGoals).goals;
      }
      if (product.handle === "cream-my-body") {
        product.sku = getBodyCreamSKU(skinGoals).sku;
        product.skinType = getBodyCreamSKU(skinGoals).skinType;
        product.goals = getBodyCreamSKU(skinGoals).goals;
      }
      if (product.handle === "nourish-my-skin") {
        product.sku = getOilSKU(product, skinType, skinGoals).sku;
        product.skinType = getOilSKU(product, skinType, skinGoals).skinType;
        product.goals = getOilSKU(product, skinType, skinGoals).goals;
      }

      product.variantId = product.variants[product.sku].id;
    }
    return product;
  });
}

export function trimSkinGoalsList(unfilterdGoalsList) {
  const allowedGoals = getSkinGoalsList();
  const selectedGoals = [];

  try {
    if (typeof unfilterdGoalsList === "string") {
      unfilterdGoalsList = unfilterdGoalsList.replace(/\u0026quot;/g, '"');
      unfilterdGoalsList = JSON.parse(unfilterdGoalsList);
    }
  } catch (e) {
    unfilterdGoalsList = [];
  }

  for (const i in allowedGoals) {
    for (const j in unfilterdGoalsList) {
      if (unfilterdGoalsList[j] == allowedGoals[i])
        selectedGoals.push(unfilterdGoalsList[j]);
    }
  }

  return selectedGoals;
}
