import React, { Component } from "react";
import PropTypes from "prop-types";

class Address extends Component {
  render() {
    return (
      <div className="Address">
        <div className="line" data-test="order-address-1">
          {this.props.address.first_name} {this.props.address.last_name}{" "}
          {this.props.address.company}
        </div>
        <div className="line" data-test="order-address-2">
          {" "}
          {this.props.address.address1}
        </div>
        {this.props.address.address2 && (
          <div className="line"> {this.props.address.address2}</div>
        )}
        <div className="line" data-test="order-address-3">
          {this.props.address.country} {this.props.address.zip}{" "}
          {this.props.address.provinceCode} {this.props.address.province}{" "}
          {this.props.address.city}
        </div>
      </div>
    );
  }
}

export default Address;

Address.propTypes = {
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  company: PropTypes.string,
  address1: PropTypes.string,
  address2: PropTypes.string,
  country: PropTypes.string,
  zip: PropTypes.string,
  provinceCode: PropTypes.string,
  province: PropTypes.string,
  city: PropTypes.string,
};
