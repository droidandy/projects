import React, { Component } from "react";
import Button from "@Components/Structure/Button";
import Image from "@Components/SharedComponents/LazyLoadImage";
import Badge from "@Components/Structure/Badge";

import { translate } from "@Core/i18n";
import { connect } from "@Components/index";
import clickAddToCart from "../actions/clickAddToCart";
import { config } from "@Core/quiz/configuration";

const skinGoals = config.skinGoals.options.map(({ key }) => key);

@translate(
  {
    buttonAddToCart: "Повторить и положить в корзину",
  },
  "PageOrderList"
)
class Product extends Component {
  addToCart = () => {
    const properties = this.props.properties.reduce((acc, [key, val]) => {
      if (key === "Skin Type" && typeof val === "string") {
        acc[key] = val.toLowerCase();
      }
      if (key === "Skin Care Goals" && typeof val === "string") {
        const goals = val
          .split(",")
          .map((word) => word.trim().toLowerCase())
          .filter(goal => skinGoals.includes(goal))
          .join(",");
        acc[key] = goals;
      }
      return acc;
    }, {});

    this.props.onClickBuyButton(this.props.variants[this.props.sku].id, properties);
  };

  render() {
    const url = this.props.url;
    let title = this.props.title;

    // this.props.video.type == "master"
    //   ? this.t("common:master")
    //   : this.t("common:videoCourse")
    // }

    if (this.props.handle && this.props.handle.includes("video")) {
      title = `${this.t("common:videoCourse")} ${this.props.title
        .toLowerCase()
        .replace("видео-курс", "")
        .trim()}`;
    }

    const variantIsOutOfStock =
      this.props.variants &&
      this.props.variants[this.props.sku] &&
      this.props.variants[this.props.sku].isOutOfStock;

    return (
      <div
        key={this.props.handle}
        className={`col-xl col-sm-4 col-12 item Product ${this.props.handle}`}
      >
        <div className="text-center product">
          {this.props.image && (
            <div className="product-img">
              <figure>
                <a href={url}>
                  <Image
                    src={this.props.image.big}
                    thumb={this.props.image.small}
                    // width={this.props.imageSize.width}
                    height={this.props.imageSize.height}
                    alt={title}
                  />
                </a>
              </figure>
            </div>
          )}

          <div className="product-content">
            <a href={url}>
              <h3>{title}</h3>
            </a>
            <Badge
              isOutOfStock={variantIsOutOfStock}
              recommended={false}
              lang={this.props.lang}
            />
            {[ // TODO helper
              "cream-my-skin",
              "nourish-my-skin",
              "cream-my-body",
              "cream-my-skin-with-peptides",
              "clean-my-skin",
            ].includes(this.props.handle) && (
              <div className="product-type">
                {this.t(`products:${this.props.handle}.${this.props.sku}.variantType`)}
              </div>
            )}
            <div
              hidden={!this.props.sku || !this.props.variants}
              className="product-price-and-size"
            >
              <div className="product-button">
                <Button
                  greenBorder={true}
                  text={this.t("buttonAddToCart")}
                  onClick={this.addToCart}
                  disabled={variantIsOutOfStock}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, getState) => {
  return {
    onClickBuyButton: (variantId, properties) => dispatch(clickAddToCart(variantId, properties)),
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    rootURL: ownProps.rootURL ? ownProps.rootURL : state.app.route.root,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
