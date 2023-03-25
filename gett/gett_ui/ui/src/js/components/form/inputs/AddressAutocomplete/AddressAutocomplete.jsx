import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Select from '../Select';
import { get } from 'utils';
import { Icon, notification } from 'components';
import { debounce, isArray, isEqual, isEmpty, includes, noop } from 'lodash';
import axios from 'axios';
import css from './AddressAutocomplete.css';
import CN from 'classnames';

const CancelToken = axios.CancelToken;
let cancelRequest;
const { Option } = Select;

function getAddresses(string, countriesFilter) {
  return get('/addresses', { string, countriesFilter }, { cancelToken: new CancelToken(c => cancelRequest = c) })
    .then(res => res.data.list);
}

function geocode(params) {
  return get('/addresses/geocode', params).then(res => res.data);
}

function nullAddress(line = null) {
  return {
    line,
    lat: null,
    lng: null,
    postalCode: null,
    timezone: 'Europe/London'
  };
}

const hintTimeout = 5000;

export default class AddressAutocomplete extends Component {
  static propTypes = {
    value: PropTypes.shape({
      line: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number
    }),
    error: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    icon: PropTypes.string,
    iconText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    favoriteAddresses: PropTypes.array,
    locationBtn: PropTypes.bool,
    disabled: PropTypes.bool,
    companyLocations: PropTypes.array,
    countriesFilter: PropTypes.array,
    name: PropTypes.string,
    sendAnalyticsEvent: PropTypes.func
  };

  static defaultProps = {
    value: {},
    icon: 'Location',
    sendAnalyticsEvent: noop
  };

  state = {
    options: [],
    loading: false,
    showHint: false,
    error: '',
    mode: 'predictions' // other possible values: 'favorites', 'locations'
  };

  static getDerivedStateFromProps({ favoriteAddresses, value }, { mode }) {
    const { line, lat, lng } = value || {};
    const nextState = {};
    if (!line || (lat && lng)) {
      nextState.options = [];
    }
    if (favoriteAddresses === undefined && mode === 'favorites') {
      nextState.mode = 'predictions';
    }
    return !isEmpty(nextState) ? nextState : null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // in some cases `state.options` my not be strict equal to `nextState.options`,
    // but have the same value.(i.e. empty array). this causes extra re-rendering
    // which results in very nasty behavior of re-opening options after selecting
    // one when component is in 'favorite addresses' mode
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    if (this.hideHintTimeout) {
      clearTimeout(this.hideHintTimeout);
    }
  }

  toggleMode(mode) {
    const { mode: currentMode } = this.state;
    const { sendAnalyticsEvent } = this.props;

    this.select.getInput().click();
    this.setState({ mode: currentMode === mode ? 'predictions' : mode }, () => {
      this.props.onChange(nullAddress());
    });
    if (mode !== currentMode && mode === 'favorites') {
      sendAnalyticsEvent();
    }
  }

  getPredictions = debounce(this.getPredictions.bind(this), 700);

  getPredictions(line) {
    const countriesFilter = this.props.countriesFilter;

    if (this.state.loading && cancelRequest) {
      cancelRequest();
    }
    this.setState({ loading: true });

    getAddresses(line, countriesFilter)
      .then((options) => {
        if (isArray(options)) {
          this.setState({ options, loading: false });
        } else {
          this.setState({ options: [], loading: false });
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          this.setState({ options: [], loading: false });
        }
      });
  }

  onChange = (line) => {
    this.setState({ error: '' });

    if (this.isPredictionsMode) {
      if (line && line.trim().length > 2) {
        this.getPredictions(line);
      } else {
        this.getPredictions.cancel();
      }
    }

    this.props.onChange(nullAddress(line));
  };

  onSelect = (value) => {
    const index = value.match(/\d+$/)[0]; // see `renderOptions' method for reason for this
    const { address, message, id, text, google, predefined } = this.options[index];

    if (!this.isPredictionsMode) {
      if (!isEqual(address, this.props.value)) {
        return this.props.onChange(address, message);
      } else {
        // without `forceUpdate` index will be rendered as input's value
        return this.forceUpdate();
      }
    }

    this.setState({ loading: true, showHint: false });

    geocode({
      locationId: id,
      string: text,
      google: google,
      predefined: predefined
    }).then(location => this.processLocation(location))
      .catch(() => this.selectWrongAddress(text))
      .then((processedLocation) => {
        if (processedLocation) {
          this.setState({ error: null });
          this.props.onChange(processedLocation);
        } else {
          this.props.onChange(nullAddress(text));
        }
      })
      .then(() => this.setState({ loading: false }));
  };

  selectWrongAddress(string) {
    this.props.onChange(nullAddress(string));
    this.setState({ error: 'Sorry, this address is not supported' });
  }

  processLocation(geocodedLoc) {
    const { lat, lng, postalCode, name, formattedAddress, countryCode, timezone, city, region, placeId, airportIata, streetName, streetNumber, pointOfInterest } = geocodedLoc;
    const processedLocation = {
      lat,
      lng,
      postalCode,
      countryCode,
      line: name && !formattedAddress.includes(name) ? [name, formattedAddress].join(', ') : formattedAddress,
      timezone,
      city,
      region,
      placeId,
      airportIata,
      streetName,
      streetNumber,
      pointOfInterest
    };

    if (!processedLocation.line || !lat || !lng || (!postalCode && countryCode === 'GB')) {
      throw new Error(processedLocation.line);
    } else {
      return processedLocation;
    }
  }

  showHint = () => {
    if (this.props.value && this.props.value.line && !this.props.value.lat) {
      this.setState({ showHint: true });

      if (this.hideHintTimeout) {
        clearTimeout(this.hideHintTimeout);
      }

      this.hideHintTimeout = setTimeout(() => {
        this.setState({ showHint: false });
      }, hintTimeout);
    }
  };

  hideHint = () => {
    this.setState({ showHint: false });
  };

  selectRef = select => this.select = select;

  getCurrentLocation = () => {
    this.setState({ loading: true, showHint: false });

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      geocode({ lat: coords.latitude, lng: coords.longitude })
        .then(location => this.processLocation(location))
        .catch(() => this.selectWrongAddress())
        .then((processedLocation) => {
          if (processedLocation) {
            this.setState({ error: null });
            this.props.onChange(processedLocation);
          } else {
            this.props.onChange(nullAddress());
          }
        })
        .then(() => this.setState({ loading: false }));
    }, () => {
      this.setState({ loading: false });
      notification.info('Please, enable geolocation in your browser');
    });
  };

  get isLocationBtnEnabled() {
    return this.props.locationBtn && !!navigator.geolocation;
  }

  get isPredictionsMode() {
    return this.state.mode === 'predictions';
  }

  get options() {
    const { mode } = this.state;

    switch (mode) {
      case 'favorites': return this.props.favoriteAddresses;
      case 'locations': return this.props.companyLocations;
      default: return this.state.options;
    }
  }

  get areFavoritesPresent() {
    return !isEmpty(this.props.favoriteAddresses);
  }

  filterPredefinedOptions(inputValue, option) {
    return includes(option.props.text.toLowerCase(), inputValue.toLowerCase());
  }

  renderOptions() {
    return (
      this.options.map((option, i) => {
        const { description } = option;
        const name = getOptionName(option);

        return (
          // It is important to have something more than just index for option keys. Otherwise,
          // when options are present and input has a value of "2", for instance, internal `rc-select`
          // will treat Option with `key={ 2 }` as selected one and that will result in erroneous
          // behavior and weird rendered content.
          <Option key={ `address-autocomplete-option-${i}` } text={ name }>
            { name }
            { name && description ? ', ' : '' }
            { description &&
              <div className="inline-block">
                <i>{ description }</i>
              </div>
            }
          </Option>
        );
      })
    );

    function getOptionName(opt) {
      return opt.name && opt.address && opt.address.line
        ? `${opt.name}, ${opt.address.line}`
        : opt['formatted_address'] || opt.text;
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { value, onChange, className, icon, iconText, error: propsError, favoriteAddresses, companyLocations, name, disabled, iconClassName, ...rest } = this.props;
    const { loading, showHint, error, mode } = this.state;
    const favoriteAddressesCN = mode === 'favorites' ? 'grey-text' : 'light-grey-text';
    const locationsCN = mode === 'locations' ? 'grey-text' : 'light-grey-text';

    return (
      <div data-name={ name } className={ className }>
        <Tooltip title="Please select a value from autocomplete" placement="topLeft" visible={ showHint }>
          <div className="layout horizontal">
            <div className={ CN('relative z-1', this.isLocationBtnEnabled ? css.selectWrapper : 'block') }>
              <Select
                { ...rest }
                ref={ this.selectRef }
                icon={ icon }
                showSearch
                defaultActiveFirstOption={ false }
                notFoundContent={ null }
                iconText={ iconText }
                iconClassName={ iconClassName }
                className="block"
                error={ error || propsError }
                onSelect={ this.onSelect }
                onChange={ this.onChange }
                onFocus={ this.hideHint }
                onBlur={ this.showHint }
                filterOption={ (mode === 'favorites' || mode === 'locations') && this.filterPredefinedOptions }
                value={ (value && value.line) || undefined }
                loading={ loading }
                disabled={ disabled }
                unblockedLoading
                allowClear
              >
                { this.renderOptions() }
              </Select>
              { !isEmpty(favoriteAddresses) && !disabled &&
                <Icon
                  className={ CN('text-22 pointer', css.icon, favoriteAddressesCN) }
                  icon="Star"
                  onClick={ () => this.toggleMode('favorites') }
                  data-name={ `${name}FavorIcon` }
                />
              }
              { !isEmpty(companyLocations) && !disabled &&
                <Icon
                  className={ CN(
                    'text-22 pointer',
                    css.icon,
                    locationsCN,
                    { 'mr-30': !isEmpty(favoriteAddresses) }
                  ) }
                  icon="HomeIcon"
                  onClick={ () => this.toggleMode('locations') }
                  data-name={ `${name}LocationsIcon` }
                />
              }
            </div>
            { this.isLocationBtnEnabled &&
              <div className={ `${css.locationBtn} layout horizontal center-center pointer` } onClick={ this.getCurrentLocation }>
                <Icon icon="MyLocation" className="text-30" />
              </div>
            }
          </div>
        </Tooltip>
      </div>
    );
  }
}
