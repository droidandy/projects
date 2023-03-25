import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { Icon, Input, Divider } from 'components';
import { withTheme } from 'theme';
import styles from './styles';

class InlineBar extends PureComponent {
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
      containerStyle, iconStyle, inputStyle, labelColor, onChangeText, value, theme, themedStyles, ...rest
    } = this.props;
    return (
      <View style={[themedStyles.modalSearchContainer, containerStyle]}>
        <View style={themedStyles.row}>
          <Icon
            style={[themedStyles.modalSearchIcon, iconStyle]}
            name="search"
            color={labelColor || theme.color.secondaryText}
            size={12}
          />
          <View style={[themedStyles.flex, themedStyles.inputWrapper]}>
            <Input
              value={value}
              onChangeText={onChangeText}
              autoCorrect={false}
              autoFocus
              allowedError={false}
              borderLess
              inputStyle={[themedStyles.modalSearchInput, inputStyle]}
              placeholderTextColor={labelColor || theme.color.secondaryText}
              {...rest}
            />
          </View>
        </View>
        <Divider left={0} />
      </View>
    );
  }
}

export default withTheme(InlineBar, styles);
