import React from "react";
import store from "@Core/redux";

import PageProductsList from ".";

export default {
  title: "Pages/ProductsList/RU",
  component: PageProductsList,
  excludeStories: /.*Data$/,
};
const defaultStateData = {
  lang: "ru",
};
export const defaultPage = (extraProps) => {
  return <PageProductsList {...defaultStateData} {...extraProps} />;
};


export const fulfillmentCodeNL = (props) => {
  
  return <PageProductsList {...props} fulfillmentCode="NL" />;
};

export const outOfStock = (props) => {
  const storeProducts = store.getState().products.list;

  const products = storeProducts.map((item) => {
    return {
      ...item,
      isOutOfStock: true,
    };
  });

  return <PageProductsList {...props} products={products} />;
};

export const recommendedProducts = (props) => {
  const storeProducts = store.getState().products.list;

  const products = storeProducts.map((item) => {
    return {
      ...item,
      recommendedVariant: true,
    };
  });

  return <PageProductsList {...props} products={products} />;
};
