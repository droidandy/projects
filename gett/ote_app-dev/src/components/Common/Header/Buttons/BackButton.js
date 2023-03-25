import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Icon } from 'components';
import NavImageButton from 'components/Common/NavImageButton';

import { withTheme } from 'theme';

import styles from './styles';

const BackButton = ({ onClick, theme, themedStyles, testID }) => (
  <View style={[themedStyles.headerBack, themedStyles.shadow]}>
    <NavImageButton
      onClick={onClick}
      styleView={themedStyles.headerBack}
      testID={testID}
      icon={<Icon width={10} height={18} name="back" color={theme.color.primaryText} />}
    />
  </View>
);

BackButton.propTypes = {
  onClick: PropTypes.func,
  testID: PropTypes.string,
  theme: PropTypes.object,
  themedStyles: PropTypes.object
};

BackButton.defaultProps = {
  onClick: () => {}
};

export default withTheme(BackButton, styles);
