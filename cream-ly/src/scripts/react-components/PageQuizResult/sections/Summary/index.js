import React from "react";

import "./index.scss";
import Button from "@Components/Structure/Button";
import Price from "../../../Price";
import ProductsSummaryImages from "./ProductImages";
import { translate } from "@Core/i18n/";

@translate({}, "PageQuizResult")
class ProductsSummary extends React.Component {
  render() {
    const selectedProducts = this.props.products.filter((product) =>
      this.props.selectedProductsSKU.includes(product.sku)
    );

    const monthsCount = 4;

    const selectedProductsPrice = selectedProducts.reduce(
      (acc, { price }) => acc + price,
      0
    );
    const oneMonthPrice = selectedProductsPrice / monthsCount;

    return (
      <div className="componentProductsSummary">
        <ProductsSummaryImages
          selectedProductsSKU={this.props.selectedProductsSKU}
          recommendedProducts={this.props.products}
          isSVG
          lang={this.props.lang}
        />

        <div className="order-detail text-center">
          <div className="products-cost">
            {this.props.products.length != selectedProducts.length && (
              <div>
                {this.t("summary.selectedProductsCount", {
                  selected: selectedProducts.length,
                  total: this.props.products.length,
                })}
              </div>
            )}

            <div
              dangerouslySetInnerHTML={{
                __html: this.t("summary.totalTreatmentCost", {
                  price: (
                    <span className="selected-products-price">
                      <Price price={selectedProductsPrice} convert={false} />
                    </span>
                  ),
                }),
              }}
            />

            <div
              dangerouslySetInnerHTML={{
                __html: this.t("summary.costPerMonth", {
                  months: `${monthsCount}`,
                  price: (
                    <span className="monthly-price">
                      <Price price={oneMonthPrice} convert={false} />
                    </span>
                  ),
                }),
              }}
            />
          </div>
          <div className="order-detail--buttons">
            <Button
              isLoading={this.props.isLoading}
              green={true}
              extra={{ "data-test": "linkCart" }}
              text={`${this.t("summary.buttonAddToCart")} (${this.props.selectedProductsSKU.length})`}
              onClick={this.props.handleAddToCartClick}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default ProductsSummary;
