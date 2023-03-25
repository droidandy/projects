import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { Icon } from 'components';
import { color } from 'theme';
import { touchableArea } from 'utils';

const IconBtn = ({ onPress, style, ...rest }) => (
  <TouchableOpacity onPress={onPress} style={style} hitSlop={touchableArea}>
    <Icon {...rest} />
  </TouchableOpacity>
);

IconBtn.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
  onPress: PropTypes.func,
  size: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

IconBtn.defaultProps = {
  color: color.white,
  name: 'search',
  size: 22
};

export default IconBtn;
