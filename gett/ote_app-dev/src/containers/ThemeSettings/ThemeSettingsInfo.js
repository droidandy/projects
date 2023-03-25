import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { strings } from 'locales';

import { withTheme } from 'theme';

import styles from './style';

class ThemeSettingsInfo extends PureComponent {
  static propTypes = {
    chosenThemeInfo: PropTypes.object,
    themedStyles: PropTypes.object
  };

  render() {
    const { chosenThemeInfo, themedStyles } = this.props;
    if (!chosenThemeInfo) {
      return null;
    }
    return (
      <View style={themedStyles.themeInfoWrapper}>
        <Text style={themedStyles.themeInfoTitle}>
          {strings(`settings.themeTitle.${chosenThemeInfo}`)}
        </Text>
        <Text style={themedStyles.themeInfoText}>
          {strings(`settings.themeText.${chosenThemeInfo}`)}
        </Text>
      </View>
    );
  }
}

export default withTheme(ThemeSettingsInfo, styles);
