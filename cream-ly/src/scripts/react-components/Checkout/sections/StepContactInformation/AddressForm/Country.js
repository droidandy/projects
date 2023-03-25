import React, { Component } from "react";

const countries = [
  {
    countryCode: "RU",
    country: "Россия",
  },
  {
    countryCode: "BY",
    country: "Беларусь",
  },
  {
    countryCode: "KZ",
    country: "Казахстан",
  },
];

export const getCountryName = (countryCode) => {
  const contryName = countries
    .filter((country) => country.countryCode == countryCode)
    .map((obj) => obj.country)
    .shift();

  return contryName ? contryName : countryCode;
};

class Country extends Component {
  render() {
    return (
      <select
        autoComplete="country"
        data-property="shippingAddress"
        data-subproperty="countryCode"
        className="w-100"
        aria-required="true"
        name="checkout[shipping_address][country]"
        id="checkout_shipping_address_country"
        defaultValue={this.props.shippingAddress.countryCode}
        onChange={this.props.handleUpdate}
      >
        <option key="no_country">-выберите страну доставки-</option>
        {countries.map(({ country, countryCode }) => {
          return (
            <option
              key={countryCode}
              data-code={countryCode}
              value={countryCode}
            >
              {country}
            </option>
          );
        })}
      </select>
    );
  }
}

export default Country;
