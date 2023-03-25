import React, { Component } from "react";
import { getCountryName } from "../AddressForm/Country";
import RoomIcon from "@material-ui/icons/Room";
import { translate } from "@Core/i18n";

import "./index.scss";

@translate({}, "PageCheckout")
class PreviousAddressSelector extends Component {
  constructor(props) {
    super(props);

    const selectedAddressId = this.props.selectedAddressId
      ? this.props.selectedAddressId
      : this.props.addresses.shift().id;

    console.log("selectedAddressId", selectedAddressId);

    this.state = {
      selectedAddressId,
    };
  }

  handleShippingAddressSelection = (selectedAddressId) => {
    this.setState(
      {
        selectedAddressId,
      },
      this.handleUpdateParentAddress
    );
  };

  handleUpdateParentAddress() {
    if (!this.state.selectedAddressId) return;

    const address = this.props.addresses
      .filter((address) => address.id == this.state.selectedAddressId)
      .shift();
    this.props.handleUpdate(address);
  }

  componentDidMount() {
    this.handleUpdateParentAddress();
  }

  render() {
    const isSelected = (address) => address.id === this.state.selectedAddressId;
    return (
      <div className="PreviousAddress">
        <div className="content">
          {/* Использовать предыдущий адрес: */}
          {this.t("PageCheckout:steps.title.usePreviousAddress")}
          <div className="addresses">
            {this.props.addresses.map((address) => (
              <label
                className={`address-wrapper ${isSelected(address) &&
                  "address-wrapper--selected"}`}
              >
                <div className="icon">
                  <RoomIcon fontSize="large" />
                </div>
                <input
                  checked={isSelected(address)}
                  type="radio"
                  onChange={() => {
                    this.handleShippingAddressSelection(address.id);
                  }}
                />
                <div className="address">
                  <div className="line">
                    {address.firstName} {address.lastName} {address.company}
                  </div>
                  <div className="line"> {address.address1}</div>
                  {address.address2 && (
                    <div className="line"> {address.address2}</div>
                  )}
                  {address.provinceCode && (
                    <div className="line">
                      {address.provinceCode} {address.province}
                    </div>
                  )}
                  <div className="line">
                    {address.zip} {address.city}
                  </div>
                  <div className="line">
                    {getCountryName(address.countryCode)}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="footer">
          <button
            className="btn btn--secondary cart__update"
            onClick={() => {
              this.props.handleAddNewAddress();
            }}
          >
            {/* Или Ввести другой адрес */}
            {this.t("PageCheckout:steps.button.changeAddress")}
          </button>
        </div>
      </div>
    );
  }
}

export default PreviousAddressSelector;
