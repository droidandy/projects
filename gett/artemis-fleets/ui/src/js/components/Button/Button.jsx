import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button as AntButton } from 'antd';

export default class Button extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func
  };

  onClick = (e) => {
    e.currentTarget.blur();
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    return (
      <AntButton { ...this.props } onClick={ this.onClick } />
    );
  }
}
