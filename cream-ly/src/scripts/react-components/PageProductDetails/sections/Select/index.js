import React, { Component } from "react";
import "./index.scss";
export default class VariantSelect extends Component {
  render() {
    return (
      <div className="VariantSelect">
        <label htmlFor="VariantSelector">{this.props.label}</label>
        <select
          name="id"
          id="VariantSelector"
          onChange={this.props.onChange}
          value={this.props.selectedSKU}
        >
          {Object.keys(this.props.variants).map((sku, i) => {
            const variant = this.props.variants[sku];
            if (variant.isOutOfStock) return;
            return (
              <option key={i} value={variant.sku}>
                {variant.title}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
