import React, { Component } from "react";
import "./HomeFreeVideo.scss";
import Header from "@Components/Structure/Header";
import { translate } from "@Core/i18n";
import PageLink from "@Components/Structure/PageLink";

@translate(
  {
    title: "Мастер-класс Типы Старения",
    saleLabel: "до {{date}}",
    currenecyPrice: " бесплатно",
    addToCartText: "Получить бесплатный доступ",
    link: "Узнать подробности",
  },
  "HomeFreeVideo"
)
export default class HomeFreeVideo extends Component {
  getDate() {
    const now = new Date();
    const event = new Date(
      Date.UTC(now.getYear(), now.getMonth(), now.getDate() + 1)
    );
    const options = {
      month: "long",
      day: "numeric",
    };

    const saleEndDate = event.toLocaleDateString("ru", options);

    return saleEndDate;
  }

  render() {
    return (
      <div className="HomeFreeVideo" data-nosnippet>
        <Header isPageHeader text={this.t("title")} />
        <div className="pro_price">
          <span className="product-price__price">
            <span className="product-price__sale-label">
              {this.t("saleLabel", { date: this.getDate() })}
            </span>
            <span className="currencyPrice EUR">
              {this.t("currenecyPrice")}
            </span>
          </span>
        </div>

        <form
          className="mt-3"
          action="/cart/add?id=32193484390454&amp;locale=ru"
          method="post"
        >
          <div className="product-form__item product-form__item--submit text-center mt-md-3 mt-lg-0">
            <button
              className="btn product-form__cart-submit"
              type="submit"
              name="add"
            >
              <span id="AddToCartText">{this.t("addToCartText")}</span>
            </button>
          </div>
        </form>

        <p className="mt-3">
          <PageLink pageType="PAGE_PRODUCT_DETAILS" handle="video-aging">
            {this.t("link")}
          </PageLink>
        </p>
      </div>
    );
  }
}
