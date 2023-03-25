import React from "react";
import LazyLoadImage from ".";

export default {
  title: "@Components/Structure/LazyLoadImage",
  component: LazyLoadImage,
};

const img1Props = {
  src:
    "https://cdn.shopify.com/s/files/1/2367/5871/products/cream-my-body_1000x.png",
  thumb:
    "https://cdn.shopify.com/s/files/1/2367/5871/products/cream-my-body_200x.png",
};

const img2Props = {
  src:
    "https://cdn.shopify.com/s/files/1/2367/5871/products/cream_-_3000px_-_with_patern_png_8edf4f5f-3a00-4a6b-8e76-66872ccabf3c_1000x.png",

  thumb:
    "https://cdn.shopify.com/s/files/1/2367/5871/products/cream_-_3000px_-_with_patern_png_8edf4f5f-3a00-4a6b-8e76-66872ccabf3c_1000x.png",
};

const img3Props = {
  src:
    "https://cdn.shopify.com/s/files/1/2367/5871/products/FLOWER_small_5cac56e6-a4a0-4a66-9702-1c2ba12be3e3_1000x.png",
  thumb:
    "https://cdn.shopify.com/s/files/1/2367/5871/products/FLOWER_small_5cac56e6-a4a0-4a66-9702-1c2ba12be3e3_1000x.png",
};

export const defaultPage = (extraProps) => {
  return (
    <div>
      <div
        className="row align-items-center align-items-middle"
        style={{ height: "400px", backgroundColor: "blue" }}
      >
        <div className="col-3 text-center">
          <LazyLoadImage {...img1Props} height={400} />

          <div className="text-center">text</div>
        </div>

        <div className="col-3 text-center">
          <LazyLoadImage {...img2Props} height={400} />

          <div className="text-center">text</div>
        </div>

        <div className="col-3 text-center">
          <LazyLoadImage {...img3Props} height={400} />

          <div className="text-center">text</div>
        </div>
      </div>
    </div>
  );
};
