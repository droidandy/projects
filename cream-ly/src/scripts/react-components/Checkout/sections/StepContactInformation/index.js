import React from "react";

import { connect } from "@Components/index";
import PreviousAddressSelector from "./PreviousAddress";
import EmailAndNameForm from "./EmailAndNameForm";
import AddressForm from "./AddressForm";
import setCustomer from "./actions/setCustomer";
import addNewAddress from "./actions/addAdderess";
import { translate } from "@Core/i18n";
import * as Validator from "@Core/utils/validators";

import "./index.scss";

@translate({}, "PageCheckout")
class CheckoutStepContact extends React.Component {
  state = {
    isAddressFormMode: this.isPreviousAddressAvailalbe() ? false : true,
    isValidationMode: this.props.isValidationMode,
    selectedPreviousAddressId: null,
  };

  isPreviousAddressAvailalbe() {
    const hasPreviousAddresses =
      this.props.customer &&
      this.props.customer.addresses &&
      this.props.customer.addresses.length;

    return hasPreviousAddresses;
  }

  constructor(props) {
    super(props);

    if (typeof this.props.onEmailUpdate !== "function")
      throw Error("prop onEmailUpdate requires function");

    if (
      this.props.isShippingRequired &&
      typeof this.props.onAddressUpdate !== "function"
    )
      throw Error(
        "prop onAddressUpdate requires function if isShippingRequired=true"
      );

    this.handleFormDataUpdate = this.handleFormDataUpdate.bind(this);
    this.isValidToMoveForward = this.isValidToMoveForward.bind(this);
    this.validate = this.validate.bind(this);
  }

  validate(turnOnValidationMode = false) {
    if (!this.state.isValidationMode && !turnOnValidationMode) return {};

    if (turnOnValidationMode) this.setState({ isValidationMode: true });

    const errors = {};

    errors.email = !Validator.isValidEmail(this.props.email);

    const shippingAddress = this.props.shippingAddress;
    errors.firstName = shippingAddress.firstName == "";
    errors.lastName = shippingAddress.lastName == "";

    if (this.props.isShippingRequired) {
      errors.address1 = shippingAddress.address1 == "";
      errors.provinceCode =
        !shippingAddress.provinceCode &&
        (shippingAddress.countryCode == "RU" ||
          shippingAddress.countryCode == "");
      errors.city = shippingAddress.city == "";
      errors.zip = !isValidZip(
        shippingAddress.zip,
        shippingAddress.countryCode
      );
      errors.phone = shippingAddress.phone == "";
    }

    //remove keys of valid fields
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    return errors;
  }

  isValidToMoveForward() {
    const errors = this.validate(true);
    const isValid = Object.keys(errors).length == 0;
    return isValid;
  }

  handleFormDataUpdate(event) {
    event.preventDefault();

    const property = event.target.dataset.property;
    const subproperty = event.target.dataset.subproperty;
    const value = event.target.value.trim();

    if (property === "email" && this.props.email !== value) {
      this.props.onEmailUpdate(value.toLowerCase());
    }

    if (
      property === "shippingAddress" &&
      this.props.shippingAddress[subproperty] !== value
    ) {
      const addressData = {
        ...this.props.shippingAddress,
        [subproperty]: value,
      };

      delete addressData.country;
      this.props.onAddressUpdate(addressData, subproperty);
    }
  }

  render() {
    const invalidFields = this.validate();

    return (
      <div className="StepContactInformation">
        <div className="top row no-gutters">
          <div className="title">
            <h2 className="section__title " tabIndex="-1">
              {/* Контактная информация */}
              {this.t("PageCheckout:steps.title.contactInfo")}
            </h2>
          </div>

          <div
            hidden={true /* this.props.customer && this.props.customer.email */}
            className="loginLink"
          >
            <p>
              <span aria-hidden="true">Уже есть аккаунт?</span>
              <a
                href={
                  "/account/login?checkout_url=" +
                  encodeURI("/cart/?step=contact_information")
                }
              >
                <span className="visually-hidden">Уже есть аккаунт?</span>
                &nbsp;Войти
              </a>
            </p>
          </div>
        </div>
        <EmailAndNameForm
          email={this.props.email}
          shippingAddress={this.props.shippingAddress}
          handleUpdate={this.handleFormDataUpdate}
          isAddressFormMode={this.state.isAddressFormMode}
          invalidFields={invalidFields}
          acceptsMarketing={this.props.acceptsMarketing}
          customer={this.props.customer}
        />
        {this.props.isShippingRequired && (
          <div className="mt-3 section section--shipping-address">
            <div className="section__header">
              <h2 className="section__title">{this.i18n.shippingAddress}</h2>
            </div>
            {!this.state.isAddressFormMode && (
              <PreviousAddressSelector
                handleAddNewAddress={() => {
                  this.setState({
                    isAddressFormMode: true,
                  });
                }}
                handleUpdate={this.props.onAddressUpdate}
                addresses={this.props.customer.addresses}
                selectedAddressId={
                  (this.props.shippingAddress &&
                    this.props.shippingAddress.id) ||
                  this.props.customer.defaultAddressId
                }
              />
            )}
            {this.state.isAddressFormMode && (
              <AddressForm
                {...this.props}
                handleUpdate={this.handleFormDataUpdate}
                invalidFields={invalidFields}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
export default CheckoutStepContact;

export const isValidZip = (zip, countryCode) => {
  if (countryCode === "RU") {
    if (zip && zip.length === 6) return true;
    return false;
  }
  return Boolean(zip);
};
