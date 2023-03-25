import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch as SwitchRN } from 'react-native';
import { noop } from 'lodash';
import { color, withTheme } from 'theme';
import { isAndroid } from 'utils';

class Switch extends PureComponent {
  static propTypes = {
    onValueChange: PropTypes.func,
    theme: PropTypes.object,
    thumbTintColor: PropTypes.string,
    trackColor: PropTypes.object
  };

  static defaultProps = {
    onValueChange: noop,
    thumbTintColor: isAndroid ? color.white : null,
    trackColor: {}
  };

  render() {
    const { trackColor, theme, ...rest } = this.props;
    const trackColorValue = {
      true: theme.color.secondaryText,
      false: theme.color.pixelLine,
      ...trackColor
    };

    return (
      <SwitchRN trackColor={trackColorValue} {...rest} />
    );
  }
}

export default withTheme(Switch);
