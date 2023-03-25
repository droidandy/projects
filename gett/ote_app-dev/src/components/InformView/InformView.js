import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { capitalize } from 'lodash';

import { Icon } from 'components';

import styles from './styles';

const InformView = ({ type, children, style, iconStyle }) => (
  <View style={[styles.container, style]}>
    <Icon name={`inform${capitalize(type)}`} width={50} height={41} style={[styles.icon, iconStyle]}/>
    {children}
  </View>
);

InformView.propTypes = {
  children: PropTypes.node,
  iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  type: PropTypes.oneOf(['warning'])
};

InformView.defaultProps = {
  type: 'warning'
};

export default InformView;
