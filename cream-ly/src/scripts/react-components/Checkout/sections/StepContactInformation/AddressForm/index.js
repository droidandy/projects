import React, { Component } from "react";
import AutocompleteInput from "@Components/Structure/AutocompleteInput";
import Region from "./Region";
import Country from "./Country";
import AddCompany from "./AddCompany";
import { translate } from "@Core/i18n";

const YANDEX_KEY = "fd0197ce-a178-426e-bbce-0bcdc9468b3f";

@translate({}, "PageCheckout")
class AddressForm extends Component {
  state = {
    cityArray: [],
    address1Array: [],
    address2Array: [],
  };
  /* fetchAddress = (address) => {
    return fetch(
      `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${YANDEX_KEY}&geocode=${address}`
    )
      .then((r) => r.json())
      .then(({ response }) => {
        return this.setState({
          address1Array: response.GeoObjectCollection.featureMember.map(
            (item) => {
              return {
                title: item.GeoObject.name,
              };
            }
          ),
        });
      });
  };
  fetchCity = (city) => {
    return fetch(
      `https://us-central1-cream-ly.cloudfunctions.net/cdekGetCities/?countryCode=${
        this.state.shippingAddress.countryCode
      }&city=${city}${
        this.state.shippingAddress.regionCode
          ? `&regionCode=${this.state.shippingAddress.regionCode}`
          : ""
      }`
    )
      .then((r) => r.json())
      .then((data) => {
        return this.setState({
          cityArray: data.map((item) => {
            return {
              ...item,
              title: item.city,
              cdek_city_code: item.code,
            };
          }),
        });
      })
      .catch((err) => {
        throw err;
      });
  }; */

  isRegionAvailable() {
    return (
      this.props.shippingAddress &&
      (this.props.shippingAddress.countryCode == "RU" ||
        this.props.shippingAddress.countryCode == "")
    );
  }

  render() {
    const isError =
      this.props.invalidFields.city ||
      this.props.invalidFields.address1 ||
      (this.props.invalidFields.zip && !this.props.shippingAddress.zip) ||
      this.props.invalidFields.phone ||
      this.props.invalidFields.provinceCode;

    return (
      <div className="AddressForm">
        {isError && (
          <div className="error">
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{" "}
            {/* Введите полный адрес доставки */}
            {this.t("PageCheckout:errors.invalidAddressForm")}
          </div>
        )}

        <div className="field row">
          <div className="col">
            <Country
              shippingAddress={this.props.shippingAddress}
              handleUpdate={this.props.handleUpdate}
            />
          </div>
        </div>

        {this.isRegionAvailable() && (
          <div className="field row">
            <div className="col">
              <Region
                invalidFields={this.props.invalidFields}
                handleUpdate={this.props.handleUpdate}
                shippingAddress={this.props.shippingAddress}
              />
            </div>
          </div>
        )}

        <div className="field row">
          <div className="col">
            <label
              hidden
              className="field__label field__label--visible"
              htmlFor="checkout_shipping_address_city"
            >
              {/* Город / Населенный пункт */}
              {this.t("PageCheckout:fields.city.label")}
            </label>
            <input
              className={
                (this.props.invalidFields.city ? "errors" : "") + " w-100"
              }
              placeholder={this.t("PageCheckout:fields.city.placeholder")}
              // placeholder="Город / Населенный пункт"
              defaultValue={
                this.props.shippingAddress
                  ? this.props.shippingAddress.city
                  : ""
              }
              onBlur={this.props.handleUpdate}
              autoComplete="address-level2"
              autoCorrect="off"
              data-property="shippingAddress"
              data-subproperty="city"
              aria-required="true"
              size="30"
              type="text"
              name="checkout[shipping_address][city]"
              id="checkout_shipping_address_city"
            />
          </div>
        </div>

        <div className="field row">
          <div className="col">
            <label
              hidden
              className="field__label field__label--visible"
              htmlFor="checkout_shipping_address_address1"
            >
              {/* Адрес */}
              {this.t("PageCheckout:fields.address.label")}
            </label>
            <input
              className={
                (this.props.invalidFields.address1 ? "errors" : "") + " w-100"
              }
              // placeholder="Адрес"
              placeholder={this.t("PageCheckout:fields.address.placeholder")}
              defaultValue={
                this.props.shippingAddress
                  ? this.props.shippingAddress.address1
                  : ""
              }
              onBlur={this.props.handleUpdate}
              autoComplete="address-level3"
              autoCorrect="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="false"
              aria-required="true"
              data-property="shippingAddress"
              data-subproperty="address1"
              data-autocomplete-trigger="true"
              size="30"
              type="text"
              name="checkout[shipping_address][address1]"
              id="checkout_shipping_address_address1"
              aria-haspopup="false"
            />
          </div>
        </div>

        <div className="field row">
          <div className="col">
            <label
              hidden
              className="field__label field__label--visible"
              htmlFor="checkout_shipping_address_address2"
            >
              {/* Продолжение адреса (необязательное поле) */}
              {this.t("PageCheckout:fields.additionalAddress.label")}
            </label>
            <input
              className="w-100"
              // placeholder="Продолжение адреса (необязательное поле)"
              placeholder={this.t(
                "PageCheckout:fields.additionalAddress.placeholder"
              )}
              defaultValue={
                this.props.shippingAddress
                  ? this.props.shippingAddress.address2
                  : ""
              }
              onBlur={this.props.handleUpdate}
              autoComplete="address-level4"
              autoCorrect="off"
              data-property="shippingAddress"
              data-subproperty="address2"
              size="30"
              type="text"
              name="checkout[shipping_address][address2]"
              id="checkout_shipping_address_address2"
            />
          </div>
        </div>

        {this.props.shippingAddress &&
          this.props.shippingAddress.zip &&
          this.props.invalidFields.zip && (
            <div className="error">
              <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{" "}
              {this.t("PageCheckout:errors.invalidPostcodeRu")}
            </div>
          )}
        <div className="row field">
          <div
            className="col-6"
            data-address-field="zip"
            data-autocomplete-field-container="true"
          >
            <div className="field__input-wrapper">
              <label
                hidden
                className="field__label field__label--visible"
                htmlFor="checkout_shipping_address_zip"
              >
                {/* Индекс */}
                {this.t("PageCheckout:fields.zip.label")}
              </label>
              <input
                // placeholder="Индекс"
                placeholder={this.t("PageCheckout:fields.zip.placeholder")}
                defaultValue={
                  this.props.shippingAddress
                    ? this.props.shippingAddress.zip
                    : ""
                }
                onBlur={this.props.handleUpdate}
                autoComplete="postal-code"
                autoCorrect="off"
                data-property="shippingAddress"
                data-subproperty="zip"
                data-autocomplete-trigger="true"
                className={
                  (this.props.invalidFields.zip ? "errors" : "") +
                  " w-100 field__input--zip"
                }
                aria-required="true"
                size="30"
                type="text"
                name="checkout[shipping_address][zip]"
                id="checkout_shipping_address_zip"
              />
            </div>
          </div>
        </div>

        <div data-address-field="phone" className="field row">
          <div className="col-lg-6 col-xs-12">
            <label
              hidden
              className="field__label field__label--visible"
              htmlFor="checkout_shipping_address_phone"
            >
              {/* Телефон */}
              {this.t("PageCheckout:fields.phone.label")}
            </label>
            <input
              // placeholder={"Телефон (для связи со службой доставки)"}
              placeholder={this.t("PageCheckout:fields.phone.placeholder")}
              defaultValue={
                this.props.shippingAddress
                  ? this.props.shippingAddress.phone
                  : ""
              }
              onBlur={this.props.handleUpdate}
              autoComplete="tel"
              autoCorrect="off"
              data-property="shippingAddress"
              data-subproperty="phone"
              data-phone-formatter="true"
              data-phone-formatter-country-select="[name='checkout[shipping_address][phone]']"
              aria-describedby="tooltip-for-phone"
              aria-required="true"
              className={
                (this.props.invalidFields.phone ? "errors" : "") + " w-100"
              }
              size="30"
              type="tel"
              name="checkout[shipping_address][phone]"
              id="checkout_shipping_address_phone"
            />
          </div>
        </div>
        <AddCompany
          handleUpdate={this.props.handleUpdate}
          company={
            this.props.shippingAddress ? this.props.shippingAddress.company : ""
          }
        />
      </div>
    );
  }
}

export default AddressForm;
