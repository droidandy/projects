import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Radio as AntRadio } from 'antd';

class RadioGroup extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func
  };

  onChange = (e) => {
    this.props.onChange(e.target.value);
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onChange, ...rest } = this.props;

    return <AntRadio.Group onChange={ this.onChange } { ...rest } />;
  }
}

export default class Radio extends AntRadio {
  static Group = RadioGroup;
}
