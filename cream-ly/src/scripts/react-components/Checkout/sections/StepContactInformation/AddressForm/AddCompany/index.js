import React, { Component } from "react";
import { translate } from "@Core/i18n";

import "./index.scss";

@translate({}, "PageCheckout")
class AddCompany extends Component {
  state = {
    isActive: this.props.company ? true : false,
  };

  inputRef = React.createRef();

  handleClick = () => {
    this.setState(
      {
        isActive: true,
      },
      () => {
        this.inputRef.current.focus();
      }
    );
  };

  render() {
    return (
      <div className="AddCompany" onClick={this.handleClick}>
        {!this.state.isActive && (
          <div className="button">
            <div className="plus">+</div>
            {/* Доcтавка на офис? Добавить название компании */}
            {this.t("PageCheckout:fields.company.toggleBtnLabel")}
          </div>
        )}
        {this.state.isActive && (
          <div data-address-field="company" className="field row">
            <div className="col-12">
              <label
                hidden
                className="field__label field__label--visible"
                htmlFor="checkout_shipping_address_company"
              >
                {/* Компания */}
                {this.t("PageCheckout:fields.company.label")}
              </label>
              <input
                ref={this.inputRef}
                // placeholder="Компания"
                placeholder={this.t("PageCheckout:fields.company.placeholder")}
                autoComplete="organization"
                autoCorrect="off"
                data-property="shippingAddress"
                data-subproperty="company"
                className="w-100"
                size="30"
                name="checkout[shipping_address][company]"
                id="checkout_shipping_address_company"
                onBlur={this.props.handleUpdate}
                defaultValue={this.props.company}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AddCompany;
