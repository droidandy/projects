import React, { Component } from "react";
import { translate } from "@Core/i18n/";
import Price from "../../Price";
import Image from "@Components/SharedComponents/LazyLoadImage";
import VideoReview from "./VideoReview";

import ProductFeedback from "@Components/SharedComponents/ProductFeedbacks";
import { getFeedbacks } from "@Core/products";
import { isVideoProduct } from "@Core/products/video";

@translate(
  {
    detailsVisibility: {
      hide: "Скрыть описание",
      show: "Подробнее",
    },
    usage: "ПРИМЕНЕНИЕ",
    ingredients: "СОСТАВ",
    materials: "МАТЕРИАЛЫ",
  },
  "PageQuizResult"
)
class ProductItem extends Component {
  showHideRef = React.createRef();

  toggleVisibility = (event) => {
    const { toggleProductDescriptionVisibilityCb, product } = this.props;

    event.preventDefault();
    this.showHideRef.current.scrollIntoView();
    toggleProductDescriptionVisibilityCb(product.sku);
  };
  render() {
    const {
      product,
      handleSelect,
      isSelected,
      isShowProductDetails,
    } = this.props;

    const sku = product.sku;

    const description = isVideoProduct(product.handle)
      ? `${this.t(`products:${product.handle}.description`)}`
      : `${this.t(`products:${product.handle}.${sku}.shortDescription`)}`;

    const ingredients = this.t(`products:${product.handle}.${sku}.ingredients`);

    const usageTime = this.t(`products:${product.handle}.usageTime`);
    const usage = this.t(`products:${product.handle}.usage`);

    const labelId = "checkbox_" + this.props.product.sku;

    const feedbacks = getFeedbacks(product.handle, this.props.lang);

    return (
      <div
        className="productItem physical"
        ref={this.showHideRef}
        id={"product_" + this.props.product.sku}
      >
        <div className="item-catalog--top">
          <label className="checkbox-custom" hidden={product.isOutOfStock}>
            <input
              id={labelId}
              className="item_checkbox"
              type="checkbox"
              defaultChecked={!product.isOutOfStock && isSelected}
              onChange={() => handleSelect(product.sku)}
            />
            <span></span>
          </label>
          <div className="item-catalog--name">
            <label htmlFor={labelId}>{product.title}</label>
          </div>
          <div className="item-catalog--info">
            <span>
              <Price price={product.price} />{" "}
              {product.sizeInMl &&
                `| ${product.sizeInMl} ${this.t(
                  "PageProductsList:sizeMl"
                )}`}{" "}
            </span>
          </div>
          {product.isOutOfStock && (
            <div className="sold-out badge badge badge-pill badge-warning">
              {this.t("PageProductsList:outOfStock")}
            </div>
          )}
        </div>
        <div className="item-catalog--image" onClick={this.toggleVisibility}>
          {product.image && product.image.big && (
            <Image
              src={product.image.big}
              thumb={product.image.small}
              alt={product.title}
            />
          )}
        </div>
        <div
          className={`item-catalog--description ${isShowProductDetails && "open"}`}
        >
          {this.props.isDisplaySKU && <div>{product.sku}</div>}
          <div
            className="small-description"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
          {isShowProductDetails ? (
            <div className="content-hide">
              <div className="row">
                <VideoReview product={product} lang={this.props.lang} />
                <div className="col-12">
                  <h4>{this.t("usage")}</h4>
                  <div
                    className="item-catalog--time"
                    dangerouslySetInnerHTML={{
                      __html: usageTime,
                    }}
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: usage,
                    }}
                  />
                </div>
                {/* 
                  <Gallery product={product} />
                   */}
                {Array.isArray(feedbacks) && feedbacks.length > 0 && (
                  <div className="col-12">
                    <h4>
                      {this.t("common:feedbacksTitle", {
                        product: product.title,
                      })}
                    </h4>

                    <ProductFeedback
                      noHeader
                      feedbacks={feedbacks}
                      limit={1}
                      lang={this.props.lang}
                    />
                  </div>
                )}
                <div className="col-12">
                  <h4>
                    {product.handle == "brush-my-body"
                      ? this.t("materials")
                      : this.t("ingredients")}
                  </h4>

                  <div
                    className="ingredients"
                    dangerouslySetInnerHTML={{ __html: ingredients }}
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div
            className={
              isShowProductDetails
                ? "btn--show-hide" + " " + "active"
                : "btn--show-hide"
            }
            onClick={this.toggleVisibility}
          >
            <span>
              {isShowProductDetails
                ? this.t("detailsVisibility.hide")
                : this.t("detailsVisibility.show")}{" "}
              <i></i>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default ProductItem;
