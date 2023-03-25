import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';

import { Icon } from 'components';
import { withTheme } from 'theme';
import styles from './styles';

class RoundedBar extends PureComponent {
  static propTypes = {
    containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    iconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    inputStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    labelColor: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    value: PropTypes.string.isRequired
  };

  render() {
    const {
      containerStyle, iconStyle, inputStyle, theme, labelColor, onChangeText, value, themedStyles, ...rest
    } = this.props;
    return (
      <View style={[
        themedStyles.searchContainer,
        containerStyle,
        !labelColor && { backgroundColor: theme.color.bgSecondary }
      ]}>
        <Icon
          name="search"
          color={labelColor || theme.color.secondaryText}
          size={14}
          style={[themedStyles.searchIcon, iconStyle]}
        />
        <TextInput
          onChangeText={onChangeText}
          style={[themedStyles.flex, themedStyles.searchInput, inputStyle]}
          placeholderTextColor={labelColor || theme.color.secondaryText}
          value={value}
          {...rest}
        />
      </View>
    );
  }
}


export default withTheme(RoundedBar, styles);
