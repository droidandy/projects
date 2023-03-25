import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, AutoComplete } from 'antd';
import CN from 'classnames';
import countryData from 'country-telephone-data';
import { map, find, noop } from 'lodash';
import { getCountryByPhoneNumber, formatPhoneNumber } from 'utils';

import css from './style';

const { allCountries } = countryData;
const { Option } = Select;

function toPhoneValue(value, withPlus = true) {
  const addPlus = withPlus && /^[+\d]/.test(value);
  const digits = value && value.replace(/\D/g, '');

  return addPlus ? `+${digits}` : digits;
}

export default class PhoneInput extends PureComponent {
  static propTypes = {
    error: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array
    ]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    defaultContryCode: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    name: PropTypes.string,
    dataName: PropTypes.string
  };

  static defaultProps = {
    defaultContryCode: 'gb',
    onBlur: noop
  };

  state = {
    country: {},
    countryPriority: 0
  };

  static getDerivedStateFromProps(props, prevState) {
    const country = getCountryByPhoneNumber(props.value, prevState.countryPriority) ||
      find(allCountries, { iso2: props.defaultContryCode });

    return { country };
  }

  setInputRef = input => this.input = input;

  getDialCode() {
    return this.state.country.dialCode;
  }

  getPlaceholder() {
    return `+${this.getDialCode()}`;
  }

  handleFocus = () => {
    const { value, onChange } = this.props;

    if (!value) {
      this.valueByPlaceholder = true;

      onChange(this.getPlaceholder());
    }
  };

  handleBlur = (e) => {
    const { onBlur, onChange } = this.props;

    if (this.valueByPlaceholder) {
      this.valueByPlaceholder = false;
      onChange('');
    }

    onBlur(e);
  };

  handleInputChange = (value) => {
    this.valueByPlaceholder = false;

    const nextValue = formatPhoneNumber(value);

    if (nextValue !== this.props.value) {
      this.props.onChange(toPhoneValue(nextValue));
    }
  };

  handleFlagChange = (value) => {
    const { onChange } = this.props;
    const country = find(allCountries, { iso2: value });

    this.setState({ country, countryPriority: country.priority }, () => onChange('+' + country.dialCode));
    this.input.focus();
  };

  render() {
    const {
      className,
      label,
      labelClassName,
      error,
      value,
      suggestions,
      disabled,
      name,
      dataName
    } = this.props;
    const { iso2 } = this.state.country;

    return (
      <div className={ CN('relative', className) }>
        { label &&
          <label className={ CN(labelClassName, 'text-12 bold-text') }>
            { label }
          </label>
        }
        <div className={ CN('layout horizontal center', css.phoneInput) }>
          <Select
            className={ css.flagSelect }
            optionLabelProp="label"
            value={ iso2 }
            onChange={ this.handleFlagChange }
          >
            { map(allCountries, country => (
                <Option
                  key={ country.iso2 }
                  value={ country.iso2 }
                  label={ <div className="text-24 lh-0"><div className={ css[country.iso2] } /></div> }
                >
                  <div className="layout horizontal center">
                    <div className="text-24 lh-1 mr-10"><div className={ css[country.iso2] } /></div>
                    { country.name }
                    <span className="light-grey-text ml-10">{ `(+${country.dialCode})` }</span>
                  </div>
                </Option>
              ))
            }
          </Select>
          <AutoComplete
            ref={ this.setInputRef }
            onFocus={ this.handleFocus }
            onChange={ this.handleInputChange }
            onBlur={ this.handleBlur }
            className={ CN('flex', css.input) }
            value={ formatPhoneNumber(value) }
            placeholder={ this.getPlaceholder() }
            disabled={ disabled }
            dataSource={ suggestions }
            data-name={ dataName || name }
            type="tel"
          />
        </div>
        { error && <div className="error">{ error }</div> }
      </div>
    );
  }
}
