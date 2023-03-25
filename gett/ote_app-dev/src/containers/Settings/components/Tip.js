import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import { strings } from 'locales';

import { withTheme } from 'theme';

import styles from './AddressStyles';

function Tip({ label, themedStyles }) {
  return (
    <Text style={themedStyles.tip}>
      {label || strings('tip.text.removeAddress')}
    </Text>
  );
}

Tip.propTypes = {
  label: PropTypes.string,
  themedStyles: PropTypes.object
};

export default withTheme(Tip, styles);
