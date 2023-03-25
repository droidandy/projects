/* global google */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { find, debounce, isArray } from 'lodash';
import Select from './Select';

const geocoder = new google.maps.Geocoder();
const autocompleteService = new google.maps.places.AutocompleteService();
const autocompleteOptions = {
  types: ['address'],
  componentRestrictions: {
    country: 'uk'
  }
};

const { Option } = Select;

function nullAddress(line = null) {
  return {
    line,
    lat: null,
    lng: null,
    postalCode: null
  };
}

export default class AddressAutocomplete extends PureComponent {
  static propTypes = {
    value: PropTypes.shape({
      line: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number
    }),
    error: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: {}
  };

  state = {
    options: [],
    loading: false
  };

  componentWillReceiveProps(nextProps) {
    const { line, lat, lng } = nextProps.value || {};

    if (!line || (lat && lng)) {
      this.setState({ options: [] });
    }
  }

  getPredictions = debounce(this.getPredictions.bind(this), 800);

  getPredictions(line) {
    this.setState({ loading: true, askedForPredictions: true });

    autocompleteService.getPlacePredictions({ input: line, ...autocompleteOptions }, (result) => {
      if (!result || !isArray(result)) {
        this.setState({ options: [], loading: false });
      } else {
        this.getValidAddressOptions(result);
      }
    });
  }

  getValidAddressOptions(options) {
    Promise.all(this.promisizeGeocoding(options))
      .then((values) => {
        const options = values.filter(value => value !== 'error' && this.getPostalCode(value));

        this.setState({ options, loading: false });
      });
  }

  getPostalCode(addr) {
    const postalComponent = find(addr['address_components'], cmp => cmp.types.includes('postal_code'));

    return postalComponent && postalComponent['long_name'];
  }

  promisizeGeocoding(options) {
    return options.map((option, i) =>
      new Promise((resolve) => {
        // a small delay added between geocoder requests to ensure we're not hitting over
        // request frequency limit allowed by google
        setTimeout(() => {
          geocoder.geocode({ placeId: option['place_id'] }, (res, status) => {
            if (status !== 'OK') {
              resolve('error');
            } else {
              resolve(res[0]);
            }
          });
        }, 150 * i);
      })
    );
  }

  onChange = (line) => {
    if (!this.state.loading) {
      if (line) {
        this.getPredictions(line);
      } else {
        this.getPredictions.cancel();
      }

      this.props.onChange(nullAddress(line));
    }
  };

  onSelect = (index) => {
    const { onChange } = this.props;
    const option = this.state.options[index];
    const { formatted_address: line, geometry: { location: { lat, lng } } } = option;
    const postalCode = this.getPostalCode(option);

    if (!line || !lat() || !lng() || !postalCode) {
      return onChange(nullAddress(line));
    }

    onChange({
      line,
      lat: lat(),
      lng: lng(),
      postalCode
    });
  };

  getError() {
    const { error, value } = this.props;
    const { askedForPredictions, loading } = this.state;
    const errorMessage = error || (
      askedForPredictions && !loading && !value.postalCode &&
        'Please select value from autocomplete'
    );

    return typeof errorMessage === 'string' ? errorMessage : undefined;
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { value, error, ...rest } = this.props;
    const { options, loading } = this.state;

    return (
      <Select
        { ...rest }
        error={ this.getError() }
        mode="combobox"
        onSelect={ this.onSelect }
        onChange={ this.onChange }
        filterOption={ false }
        value={ (value && value.line) || '' }
        loading={ loading }
      >
        { options.map((opt, i) => <Option key={ i }>{ opt['formatted_address'] }</Option>) }
      </Select>
    );
  }
}
