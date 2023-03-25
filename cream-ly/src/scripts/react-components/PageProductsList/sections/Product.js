import React, { Component } from "react";
import Badge from "@Components/Structure/Badge";
import Price from "../../Price";
import Image from "@Components/SharedComponents/LazyLoadImage";
import { connect } from "@Components/index";
import { translate } from "@Core/i18n";
import * as Router from "@Core/app/router";

@translate({ sizeMl: "мл" }, "PageProductsList")
class Product extends Component {
  render() {
    const isPriceRangeOn =
      this.props.priceRange &&
      this.props.priceRange.max != this.props.priceRange.min;

    const url =
      this.props.handle != "videos"
        ? Router.getURLForPage("PAGE_PRODUCT_DETAILS", {
            handle: this.props.handle,
            lang: this.props.lang,
          })
        : this.props.url;

    const shortSection = ["headband", "robe", "cream-my-body", "brush-my-body"].includes(this.props.handle);
    const size = `col-xl-3 col-sm-${shortSection ? 4 : 3} col-6`;

    return (
      <div
        key={this.props.handle}
        className={`${size} item Product ${this.props.handle}`}
      >
        <div className="text-center product">
          {this.props.image && (
            <div className="product-img">
              <figure>
                <a href={url}>
                  <Image
                    src={this.props.image.big_original}
                    thumb={this.props.image.small_original}
                    height={this.props.imageSize.height}
                    alt={this.props.title}
                  />
                </a>
              </figure>
            </div>
          )}

          <div className="product-content">
            <Badge
              lang={this.props.lang}
              isOutOfStock={this.props.isOutOfStock}
              recommended={this.props.recommendedVariant}
            />
            <a href={url}>
              <h3>
                {this.t(
                  "products:" + this.props.handle + ".title",
                  null,
                  this.props.title
                )}
              </h3>
            </a>
            <div className="product-price-and-size">
              {isPriceRangeOn && (
                <span className="product-quantity">
                  <Price price={this.props.priceRange.min} />
                  {" - "}
                  <Price price={this.props.priceRange.max} />
                </span>
              )}

              {!isPriceRangeOn && this.props.price && (
                <span className="product-quantity">
                  <Price price={this.props.price} />
                </span>
              )}

              {this.props.sizeInMl && (
                <>
                  <span className="product-quantity">
                    {this.props.sizeInMl} {this.t("sizeMl")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    rootURL: ownProps.rootURL ? ownProps.rootURL : state.app.route.root,
  };
};

export default connect(mapStateToProps)(Product);
