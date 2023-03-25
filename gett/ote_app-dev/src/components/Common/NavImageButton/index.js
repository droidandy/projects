import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';

import { touchableArea } from 'utils';

import styles from './style';

export default function NavImageButton(props) {
  return (
    <TouchableOpacity
      style={[styles.container, props.styleContainer]}
      onPress={props.onClick ? props.onClick : null}
      activeOpacity={0.5}
      hitSlop={touchableArea}
      testID={props.testID}
    >
      <View style={[styles.buttonView, props.styleView]}>{props.icon}</View>
    </TouchableOpacity>
  );
}

NavImageButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  styleContainer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  styleView: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  testID: PropTypes.string
};

NavImageButton.defaultProps = {
  styleContainer: {},
  styleView: {}
};
