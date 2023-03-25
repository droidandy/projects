import React from "react";

import { connect } from "@Components/index";

import "./ProductsList.scss";

import changeSelectedProducts from "../actions/changeSelectedProducts";
import { translate } from "@Core/i18n/";
import ProductItem from "./ProductItem";
import Header from "@Components/Structure/Header";
//import { initTimer } from "@Core/app/analytics/timer";

@translate({}, "PageQuizResult")
class ProductsList extends React.Component {
  state = {
    toggledIdProduct: "",
  };
  ref = React.createRef();

  componentDidMount() {
    /* initTimer(this.ref, (type, time) => {
      // console.log(type, time);
    }); */
  }

  toggleProductDescriptionVisibilityCb = (id) => {
    this.setState({
      toggledIdProduct: this.state.toggledIdProduct !== id ? id : "",
    });
  };

  render() {
    const faceProducts = this.props.products.filter(
      (item) => !item.handle.includes("video") && !item.handle.includes("body")
    );
    const bodyProducts = this.props.products.filter(
      (item) => !item.handle.includes("video") && item.handle.includes("body")
    );

    return (
      <div ref={this.ref} className="componentQuizResultsProductsList">
        {faceProducts.length > 0 && (
          <React.Fragment>
            <Header text={this.t("PageProductsList:collection.face")} />
            <div>{this.t("recommendationPromo")}</div>
            <div className="quiz-results">
              {faceProducts.map((product) => (
                <ProductItem
                  key={product.sku}
                  product={product}
                  isShowProductDetails={
                    product.sku === this.state.toggledIdProduct
                  }
                  isDisplaySKU={this.props.isDisplaySKU}
                  handleSelect={this.props.handleSelect}
                  lang={this.props.lang}
                  isSelected={this.props.selectedProductsSKU.includes(
                    product.sku
                  )}
                  toggleProductDescriptionVisibilityCb={
                    this.toggleProductDescriptionVisibilityCb
                  }
                />
              ))}
            </div>
          </React.Fragment>
        )}

        {bodyProducts.length > 0 && (
          <React.Fragment>
            <Header text={this.t("PageProductsList:collection.body")} />
            <div className="quiz-results">
              {bodyProducts.map((product) => (
                <ProductItem
                  key={product.sku}
                  product={product}
                  isShowProductDetails={
                    product.sku === this.state.toggledIdProduct
                  }
                  isDisplaySKU={this.props.isDisplaySKU}
                  handleSelect={this.props.handleSelect}
                  lang={this.props.lang}
                  isSelected={this.props.selectedProductsSKU.includes(
                    product.sku
                  )}
                  toggleProductDescriptionVisibilityCb={
                    this.toggleProductDescriptionVisibilityCb
                  }
                />
              ))}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
const mapDispatchToProps = (dispatch, getState) => {
  return {
    onProductSelectedChange: (selectedProducts) =>
      dispatch(changeSelectedProducts(selectedProducts)),
  };
};

ProductsList.defaultProps = {
  selectedProducts: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);
