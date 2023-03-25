import React, { Component } from "react";
import { translate } from "@Core/i18n";

// const i18n = {
//   name: "Имя",
//   surname: "Фамилия",
// };

@translate({}, "PageCheckout")
class EmailForm extends Component {
  render() {
    return (
      <div className="EmailForm">
        {this.props.invalidFields.email && (
          <div className="error">
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{" "}
            {/* Введите валидный email */}
            {this.t("PageCheckout:fields.email.error")}
          </div>
        )}
        <div className="field row">
          <div className="col-12">
            <input
              // placeholder="Имейл"
              placeholder={this.t("PageCheckout:fields.email.placeholder")}
              defaultValue={
                this.props.customer && this.props.customer.email
                  ? this.props.customer.email
                  : this.props.email
              }
              disabled={this.props.customer && this.props.customer.email}
              onBlur={this.props.handleUpdate}
              data-property="email"
              autoCapitalize="off"
              spellCheck="false"
              autoComplete="shipping email"
              data-autofocus="true"
              data-backup="customer_email"
              aria-describedby="checkout-context-step-one error-for-email"
              aria-required="true"
              className={
                (this.props.invalidFields.email ? "errors" : "") + " w-100"
              }
              size="30"
              type="email"
              name="checkout[email]"
              id="checkout_email"
            />
          </div>
        </div>

        {/*  <div
          className="fieldset-description"
          data-buyer-accepts-marketing=""
          hidden={true}
        >
          <div className="section__content row">
            <div className="checkbox-wrapper">
              <input
                name="checkout[buyer_accepts_marketing]"
                type="hidden"
                value="0"
              />
              <input
                className="input-checkbox"
                data-property="buyerAcceptsMarketing"
                type="checkbox"
                value="1"
                defaultChecked={this.props.acceptsMarketing}
                name="checkout[buyer_accepts_marketing]"
                id="checkout_buyer_accepts_marketing"
              />
            </div>
            <label className="col" htmlFor="checkout_buyer_accepts_marketing">
              Включить меня рассылку о скидках и новостях
            </label>
          </div>
        </div> */}

        {(this.props.invalidFields.firstName ||
          this.props.invalidFields.lastName) && (
          <div className="error">
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{" "}
            {/* Введите Имя и Фамилию */}
            {this.t("PageCheckout:fields.firstname.error")}
          </div>
        )}

        {this.props.isAddressFormMode && (
          <div className="field row name">
            <div className="col-6" data-address-field="first_name">
              <div className="field__input-wrapper">
                <label hidden htmlFor="checkout_shipping_address_first_name">
                  {/* {i18n.name} */}
                  {this.t("PageCheckout:fields.firstname.label")}
                </label>
                <input
                  className={
                    (this.props.invalidFields.firstName ? "errors" : "") +
                    " w-100"
                  }
                  placeholder={this.t("PageCheckout:fields.firstname.placeholder")}
                  // placeholder="Имя"
                  defaultValue={
                    this.props.shippingAddress
                      ? this.props.shippingAddress.firstName
                      : ""
                  }
                  onBlur={this.props.handleUpdate}
                  autoComplete="shipping given-name"
                  autoCorrect="off"
                  data-property="shippingAddress"
                  data-subproperty="firstName"
                  aria-required="true"
                  size="30"
                  type="text"
                  name="checkout[shipping_address][first_name]"
                  id="checkout_shipping_address_first_name"
                />
              </div>
            </div>
            <div className="col-6" data-address-field="last_name">
              <div className="field__input-wrapper">
                <label hidden htmlFor="checkout_shipping_address_last_name">
                  {/* {i18n.surname} */}
                  {this.t("PageCheckout:fields.lastname.label")}
                </label>
                <input
                  className={
                    (this.props.invalidFields.lastName ? "errors" : "") +
                    " w-100"
                  }
                  // placeholder="Фамилия"
                  placeholder={this.t("PageCheckout:fields.lastname.placeholder")}
                  defaultValue={
                    this.props.shippingAddress
                      ? this.props.shippingAddress.lastName
                      : ""
                  }
                  onBlur={this.props.handleUpdate}
                  autoComplete="shipping family-name"
                  autoCorrect="off"
                  data-property="shippingAddress"
                  data-subproperty="lastName"
                  aria-required="true"
                  size="30"
                  type="text"
                  name="checkout[shipping_address][last_name]"
                  id="checkout_shipping_address_last_name"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default EmailForm;
