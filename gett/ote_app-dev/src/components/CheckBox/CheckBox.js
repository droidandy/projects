import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { Icon } from 'components';
import { color } from 'theme';
import { touchableArea } from 'utils';

import { components } from 'testIDs';

class CheckBox extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    status: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    testID: PropTypes.string
  };

  static defaultProps = {
    color: color.secondaryText,
    disabled: false,
    status: false,
    style: {},
    testID: components.CheckBox
  };

  renderHandlerIcon = () => {
    const { style, onPress, disabled, testID } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!onPress || disabled}
        style={style}
        onPress={onPress}
        hitSlop={touchableArea}
        testID={`${testID}_disabled`}
      >
        <Icon name="checkOff" color={disabled && '#c7c7cd80'} />
      </TouchableOpacity>
    );
  };

  render() {
    const { status, color, testID } = this.props;
    return (
      status
        ? <Icon name="checkOn" color={color} testID={`${testID}_enabled`}/>
        : this.renderHandlerIcon()
    );
  }
}
export default CheckBox;
