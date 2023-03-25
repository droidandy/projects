import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch as AntSwitch } from 'antd';

export default class Switch extends PureComponent {
  static propTypes = {
    value: PropTypes.bool,
    name: PropTypes.string,
    error: PropTypes.string
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { value, error, name, ...rest } = this.props;

    return <AntSwitch checked={ value } { ...rest } />;
  }
}
