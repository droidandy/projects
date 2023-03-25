import React from 'react';
import PropTypes from 'prop-types';
import { CachedImage } from 'react-native-cached-image';

import assets from 'assets';

import { isIphoneX } from 'utils';

import styles from './styles';

export default function Background({ testID, children, style = {} }) {
  return (
    <CachedImage testID={testID} style={[styles.image, style]} source={assets[`loginBg${isIphoneX() ? 'X' : ''}`]}>
      {children}
    </CachedImage>
  );
}

Background.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  testID: PropTypes.string
};

Background.defaultProps = {
  style: {}
};
