import React, { Component } from "react";
import Header from "@Components/Structure/Header";
import Badge from "@Components/Structure/Badge";

import "./ProductHeader.scss";
import { translate } from "@Core/i18n";

@translate(
  {
    size: "мл",
  },
  "PageProductDetails"
)
class ProductHeader extends Component {
  render() {
    return (
      <div className={`ProductHeader ${this.props.className}`}>
        <Header isPageHeader>
          {this.props.lang === "ru" ? (
            <>
              <div className="type">
                {this.t(`products:${this.props.handle}.productType`, {}, "")}
              </div>
              <div className="title">{this.props.text}</div>
            </>
          ) : (
            this.props.text
          )}
        </Header>
        {
          <Badge
            isOutOfStock={this.props.isOutOfStock}
            recommended={this.props.isRecommended}
            lang={this.props.lang}
          />
        }
        {this.props.price && (
          <div className="pro_price">
            <div className="product-price__price">
              {this.props.size &&
                `${this.props.size}${this.t(
                  "PageProductsList:sizeMl"
                )} | `}{" "}
              {this.props.price}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ProductHeader;
