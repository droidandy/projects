import React from "react";
import Cart from ".";

import { action } from "@storybook/addon-actions";

const lang = "ru";

export const getTitleData = (lang = "ru") => {
  return "Pages/CartCheckout/" + lang.toUpperCase() + "/Steps/1-CartFilled";
};

export default {
  title: getTitleData(),
  component: Cart,
  excludeStories: /.*Data$/,
};

const item: ICartItem = {
  sku: "some",
  key: "uniquie_key",
  variantId: 123,
  isOutOfStock: false,
  price: 1000,
  quantity: 1,
  product: {
    handle: "some",
    title: "some product",
    url: "http://web.com/product.url",
    imageURL: "https://via.placeholder.com/150",
  },
};

const itemWithLongTitle: ICartItem = {
  ...item,
  product: {
    ...item.product,
    title: "a very very very long product title which goes on for many lines",
  },
};

const itemWithQuantity: ICartItem = {
  ...item,
  quantity: 4,
  product: {
    ...item.product,
    title: "item with quantity greater than 1",
  },
};

const itemWithProperties: ICartItem = {
  ...item,
  properties: {
    skinType: "normal",
    skinGoals: ["wrinkles", "dehydrated"],
  },
  product: {
    ...item.product,
    title: "item with properties",
  },
};

const itemWithVideo: ICartItem = {
  ...item,
  product: {
    ...item.product,
    title: "video course",
  },
};

const itemGiftCard: ICartItem = {
  ...item,
  product: {
    ...item.product,
    title: "gift card",
  },
};

const itemOutOfStock: ICartItem = {
  ...item,
  isOutOfStock: true,
  product: {
    ...item.product,
    title: "out of stock item",
  },
};

const individualConsultationWithAlena: ICartItem = {
  ...item,
  isOutOfStock: true,
  product: {
    ...item.product,
    handle: "individual-consultation-with-alena",
    title: "out of stock item",
  },
};

export const itemsData: Array<ICartItem> = [
  item,
  itemWithLongTitle,
  itemWithQuantity,
  itemWithProperties,
  itemOutOfStock,
  itemWithVideo,
  itemGiftCard,
  individualConsultationWithAlena,
];

const data = {
  items: itemsData,
  onItemsUpdate: action("onAddressUpdate"),
  onNoteUpdate: action("onNoteUpdate"),
};

export const filled = (props) => <Cart {...data} {...props} />;
