import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';

export default class IconBtn extends PureComponent {
  static propTypes = {
    variant: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    variant: 'outlined',
    onClick: () => {},
  };

  render() {
    const { children, ...rest } = this.props;
    return (
      <IconButton id="iconBtn" {...rest}>
        {children || <KeyboardBackspace />}
      </IconButton>
    );
  }
}
