import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { withTheme } from 'theme';

import styles from './styles';

const Divider = ({ style, left, themedStyles }) => (
  <View style={[themedStyles.container, { marginLeft: left }, style]} />
);

Divider.propTypes = {
  left: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  themedStyles: PropTypes.object
};

Divider.defaultProps = {
  left: 15,
  style: {}
};

export default withTheme(Divider, styles);
