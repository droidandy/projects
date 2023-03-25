import React from "react";

import Gallery from "./Gallery";

export default {
  title: "Pages/ProductDetails/Gallery",
  component: Gallery,
  excludeStories: /.*Data$/,
};

export const noImages = (extraProps) => <Gallery {...extraProps} />;

export const oneImagesoData = {
  altText: "name of product",
  images: [
    { big: require("./cream1big.png"), small: require("./cream1small.png") },
  ],
};

export const oneImage = (extraProps) => (
  <Gallery {...oneImagesoData} {...extraProps} />
);

export const oneVideoData = {
  altText: "name of product",
  videos: [{ vimeoId: 401635269 }],
};

export const oneVideo = (extraProps) => (
  <Gallery {...oneVideoData} {...extraProps} />
);

export const fewImagesoData = {
  altText: "name of product",
  images: [
    { big: require("./cream1big.png"), small: require("./cream1small.png") },
    { big: require("./cream2big.jpg"), small: require("./cream2small.jpg") },
    { big: require("./cream3big.jpg"), small: require("./cream3small.jpg") },
  ],
};

export const fewImages = (extraProps) => (
  <Gallery {...fewImagesoData} {...extraProps} />
);

export const fewImagesAndVideoData = {
  altText: "name of product",
  videos: [{ vimeoId: 401635269 }, { vimeoId: 401635269 }],
  images: [
    { big: require("./cream1big.png"), small: require("./cream1small.png") },
    { big: require("./cream2big.jpg"), small: require("./cream2small.jpg") },
    { big: require("./cream3big.jpg"), small: require("./cream3small.jpg") },
  ],
};

export const fewImagesAndVideo = (extraProps) => (
  <Gallery {...fewImagesAndVideoData} {...extraProps} />
);
