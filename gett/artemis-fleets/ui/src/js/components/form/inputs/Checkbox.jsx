import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox as AntCheckbox } from 'antd';

export default class Checkbox extends PureComponent {
  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
    error: PropTypes.string
  };

  handleChange = (e) => {
    return this.props.onChange(e.target.checked);
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { value, error, onChange, ...rest } = this.props;

    return <AntCheckbox checked={ !!value } onChange={ this.handleChange } { ...rest } />;
  }
}
