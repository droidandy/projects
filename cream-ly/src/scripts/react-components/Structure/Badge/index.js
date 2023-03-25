import React, { Component } from "react";
import { connect } from "@Components/index";
import { translate } from "@Core/i18n";
import PropTypes from "prop-types";

import "./index.scss";

const getIsOutOfstock = (state, handle) => {
  if (handle === undefined) return false;
  if (!Array.isArray(state.products.list)) return false;
  return (
    state.products.list.filter(
      (product) => product.handle == handle && product.isOutOfStock == true
    ).length > 0
  );
};

const getIsRecommended = (state, handle) => {
  if (handle === undefined) return false;
  if (!Array.isArray(state.quiz.productHandlesList)) return false;
  return state.quiz.productHandlesList.includes(handle);
};

const mapStateToProps = (state, ownProps) => {
  return {
    isOutOfStock:
      ownProps.isOutOfStock !== undefined
        ? ownProps.isOutOfStock
        : getIsOutOfstock(state, ownProps.handle),

    recommended:
      ownProps.recommended !== undefined
        ? ownProps.recommended
        : getIsRecommended(state, ownProps.handle),
  };
};

@translate(
  {
    recommended: "Рекомендованный вам продукт",
    outOfStock: "Временно отсутствует в наличии",
    videoPurchased: "У вас есть доступ",
  },
  "PageProductsList"
)
class ProductBadge extends Component {
  statuses = {
    isOutOfStock: {
      badge: this.t("outOfStock"),
      badgeClassName: "sold-out",
    },
    recommended: {
      badge: this.t("recommended"),
      badgeClassName: "recommended",
    },
    purchased: {
      badge: this.t("videoPurchased"),
      badgeClassName: "purchased",
    },
  };

  getStatus() {
    let status = null;
    if (this.props.isOutOfStock) {
      status = "isOutOfStock";
    } else if (this.props.recommended) {
      status = "recommended";
    } else if (this.props.purchased) {
      status = "purchased";
    }

    return status;
  }
  render() {
    const status = this.getStatus();
    if (!status) return <div className="badge-spacer"></div>;

    const text = this.props.text
      ? this.props.text
      : this.statuses[status].badge;

    return (
      <div className="ProductBadge">
        <div
          className={`badge badge-warning ${this.statuses[status].badgeClassName}`}
        >
          {text}
        </div>
      </div>
    );
  }
}

ProductBadge.propTypes = {
  isOutOfStock: PropTypes.bool,
  recommended: PropTypes.bool,
  purchased: PropTypes.bool,
};
export default connect(mapStateToProps)(ProductBadge);
