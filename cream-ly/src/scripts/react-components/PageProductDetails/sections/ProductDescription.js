import React, { Component } from "react";

import "./ProductDescription.scss";

class ProductDescription extends Component {
  render() {
    return typeof this.props.description === "string" ? (
      <div
        className="ProductDescription"
        dangerouslySetInnerHTML={{__html: this.props.description}}
      ></div>
    ) : (
      <div className="ProductDescription">{this.props.description}</div>
    );
  }
}

export default ProductDescription;
