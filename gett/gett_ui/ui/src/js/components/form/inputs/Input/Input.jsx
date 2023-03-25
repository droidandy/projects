import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input as AntInput } from 'antd';
import { Icon } from 'components';
import CN from 'classnames';

import css from './style.css';

export default class Input extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.string,
    errorClassName: PropTypes.string,
    hint: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.node,
    labelClassName: PropTypes.string,
    icon: PropTypes.string,
    iconClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    allowShowPassword: PropTypes.bool,
    disabled: PropTypes.bool
  };

  state = {
    showPassword: false
  };

  handleChange = (e) => {
    return this.props.onChange(e.target.value, e);
  };

  toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    const {
      error,
      errorClassName,
      hint,
      label,
      labelClassName,
      className,
      icon,
      iconClassName,
      allowShowPassword,
      inputClassName,
      value,
      type,
      ...rest
    } = this.props;
    const { maxLength, disabled } = rest;
    const { showPassword } = this.state;
    const inputValue = value === null ? '' : value;

    return (
      <div className={ CN('relative', className, { 'with-icon': icon }) }>
        { (label || maxLength) &&
          <label className={ CN(labelClassName, 'text-12 bold-text dark-grey-text') }>
            { label } { maxLength ? `${value && value.length || 0} / ${maxLength}` : '' }
          </label>
        }
        <div className="relative">
          { icon &&
            <Icon className={ CN(iconClassName, 'text-20', error ? 'iconError' : 'icon') } icon={ icon } />
          }
          <AntInput
            className={ CN(inputClassName) }
            { ...rest }
            maxLength={ maxLength && maxLength.toString() }
            value={ inputValue }
            type={ showPassword ? 'text' : type }
            onChange={ this.handleChange }
            data-name={ rest.name }
          />
          { error &&
            <div className={ CN(errorClassName, 'error') }>{ error }</div>
          }
          { hint &&
            <div className={ `text-10 ${error ? 'mt-20': 'mt-5'}` }>{ hint }</div>
          }
          { !disabled && allowShowPassword &&
            <Icon className={ `${css.eyeIcon} text-16 pointer` } onClick={ this.toggleShowPassword } icon={ showPassword ? 'FaEyeSlash' : 'FaEye' } />
          }
        </div>
      </div>
    );
  }
}
