import React, { Component } from "react";
import BrushMySkin from './img_brush';
import CleanMySkin from './img_clean';
import CreamMyBody from './img_cream_body';
import ExfoliateMySkin from './img_exfoliate';
import CreamMySkin from './img_cream';
import NourishMySkin from './img_oil';
import FlowerPowderMySkin from './img_flower';

import { translate } from "@Core/i18n/";
import "./index.scss";

const productHandle2imageMapping = {
  "flower-powder-my-skin": "flower",
  "nourish-my-skin": "oil",
  "exfoliate-my-skin": "exfoliate",
  "cream-my-skin": "cream",
  "cream-my-skin-with-peptides": "cream",
  "cream-my-body": "cream_body",
  "brush-my-body": "brush",
  "clean-my-skin": "clean",
};

const productSvgComponents = {
  "flower-powder-my-skin": FlowerPowderMySkin,
  "nourish-my-skin": NourishMySkin,
  "exfoliate-my-skin": ExfoliateMySkin,
  "cream-my-skin": CreamMySkin,
  "cream-my-skin-with-peptides": CreamMySkin,
  "cream-my-body": CreamMyBody,
  "brush-my-body": BrushMySkin,
  "clean-my-skin": CleanMySkin,
};

const prepareHandle = (handle) => {
  return productHandle2imageMapping[handle] !== undefined
    ? productHandle2imageMapping[handle]
    : null;
};

@translate({}, "PageQuizResult")
export default class ProductsSummaryImages extends Component {
  static defaultProps = {
    productsList: [],
  };

  render() {
    const images = Object.keys(productHandle2imageMapping)
      .map((imageHandle) => {
        const product = this.props.recommendedProducts.find((product) => {
          return product.handle == imageHandle;
        });
        if (product)
          return {
            sku: product.sku,
            handle: imageHandle,
            imageClass: productHandle2imageMapping[imageHandle],
          };
      })
      .filter((el) => el != null);

    if (images.length == 0) return null;

    const version = this.props.isSVG ? "svg_image" : "image";

    const showNotes =
      images.find((image) => image.imageClass == "cream_body") != undefined &&
      images.find((image) => image.imageClass == "cream") != undefined;

    return (
      <div className="componentProductsSummaryImages">
        <div className="images">
          {showNotes && (
            <div className="handwrittenNote skinCare">
              <div className="arrowBlock">
                <div className="arrow" />
                <div className="text">
                  {this.t("PageProductsList:collection.face")}
                </div>
              </div>
            </div>
          )}
          {images.map(({ sku, handle, imageClass }) => {
            const selectedClass = this.props.selectedProductsSKU.includes(sku)
              ? null
              : "notSelected";

            const ProductImage = productSvgComponents[handle] || null;
            if (ProductImage) {
              return (
                <a href={"#product_" + sku}>
                  <ProductImage className={`${imageClass} ${selectedClass} ${version}`} />
                </a>
              );
            }
            return null;
          })}

          {showNotes && (
            <div className="handwrittenNote bodyCare">
              <div className="arrowBlock">
                <div className="text">
                  {this.t("PageProductsList:collection.body")}
                </div>
                <div className="arrow" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
