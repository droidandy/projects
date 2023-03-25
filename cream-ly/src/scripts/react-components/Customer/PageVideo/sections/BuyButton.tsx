//@ts-nocheck
import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "@Core/i18n";
import Price from "../../../Price";

@translate({}, "PageCustomerVideo")
export default class BuyButton extends Component {
  render = () => {
    return (
      <div className="BuyButton">
        <a className="btn mb-5" href={`/cart/add/${this.props.id}`}>
          {this.t("purchaseButton", {
            price: <Price price={this.props.price} />,
          })}
        </a>
      </div>
    );
  };
}

BuyButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.number,
};
