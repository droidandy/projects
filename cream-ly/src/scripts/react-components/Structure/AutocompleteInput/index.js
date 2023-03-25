import React, { Component } from "react";
//import TextField from "@Core/TextField";
//import Autocomplete from "@material-ui/lab/Autocomplete";
import _ from "lodash";
import PropTypes from "prop-types";

class AutocompleteInput extends Component {
  search = _.debounce((e, value) => {
    this.props.handleChangeInput(value);
  }, 300);

  render() {
    return this.props.isRegular ? (
      <div className="field__input-wrapper">
        <label hidden htmlFor="checkout_shipping_address_last_name">
          {this.props.title}
        </label>
        <input
          className={(this.props.error ? "errors" : "") + " w-100"}
          placeholder={this.props.title}
          defaultValue={this.props.defaultValue}
          onBlur={this.handleUpdate}
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
    ) : (
      <Autocomplete
        onInputChange={this.search}
        onChange={this.props.handleChange}
        autoComplete
        includeInputInList
        filterSelectedOptions
        filterOptions={(x) => x}
        options={this.props.searchResults}
        getOptionLabel={(option) => option.title}
        className="w-100"
        renderInput={(params) => (
          <TextField {...params} label={this.props.title} variant="outlined" />
        )}
      />
    );
  }
}

export default AutocompleteInput;

AutocompleteInput.propTypes = {
  isRegular: PropTypes.bool,
  title: PropTypes.string,
  error: PropTypes.string,
  defaultValue: PropTypes.string,
  handleChange: PropTypes.func,
  searchResults: PropTypes.string,
};
