import React from "react";
import { connect } from "@Components/index";

import "./VideoTitle.scss";

import Price from "../../Price";
import Button from "@Components/Structure/Button";
import Header from "@Components/Structure/Header"

import * as Actions from "../actions";
import Badge from "@Components/Structure/Badge";

const i18 = {
  ru: {
    buttonBuy: "Добавить в Корзину",
    buttonView: "Перейти к просмотру",
    textPurchased: "У вас уже есть доступ к этому видео",
  },
};

const mapDispatchToProps = (dispatch, getState) => {
  return {
    onClickBuyButton: (variantId) =>
      dispatch(Actions.clickAddToCart(variantId)),
  };
};
class VideoTitle extends React.Component {
  render() {
    const { discountUntil, lang } = this.props;

    return (
      <div className="componentVideoTitle">
        <h1>
          <div className="type">{this.props.type}</div>
          <div className="title">{this.props.title}</div>
        </h1>

        <div className="price">
          {discountUntil && (
            <div>
              <s className="product-price__price">
                <Price lang={lang} price={discountUntil.comparePrice} />
              </s>
              <br />
              <span className="product-price__sale-label">
                {discountUntil.text}
              </span>
            </div>
          )}
          {!this.props.isPurchased && <Price lang={lang} price={this.props.price} />}
          {this.props.isPurchased && (
            <div className="isPurchased" data-test="purchased-video-badge">
              {i18.ru.textPurchased}
            </div>
          )}
        </div>

        {!this.props.isNotReady && this.props.isPurchased && (
          <Button
            green={true}
            text={i18.ru.buttonView}
            href={this.props.pageURL}
          />
        )}
        {!this.props.isNotReady && !this.props.isPurchased && (
          <Button
            green={true}
            text={i18.ru.buttonBuy}
            onClick={() => {
              this.props.onClickBuyButton(this.props.variantId);
            }}
          />
        )}

        {this.props.isNotReady && (
          <Badge isOutOfStock text="Видео в производстве" />
        )}
      </div>
    );
  }
}

VideoTitle.defaultProps = {
  isPurchased: false,
};

export default connect(null, mapDispatchToProps)(VideoTitle);
