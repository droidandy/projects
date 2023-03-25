import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox as AntCheckbox } from 'antd';

export default class Checkbox extends PureComponent {
  static propTypes = {
    // string value is passed to checkbox when it is used in conjunction with CheckboxGroup
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    onChange: PropTypes.func,
    error: PropTypes.string,
    name: PropTypes.string
  };

  handleChange = (e) => {
    return this.props.onChange(e.target.checked, e);
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { value, error, onChange, ...rest } = this.props;

    return <AntCheckbox checked={ !!value } data-name={ rest.name } onChange={ this.handleChange } { ...rest } />;
  }
}
