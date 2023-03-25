import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'components';
import { withTheme } from 'theme';

import styles from './styles';

class AddressItem extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func,
    testID: PropTypes.string,
    theme: PropTypes.object,
    themedStyles: PropTypes.any,
    typedIcon: PropTypes.string
  };

  handleAddressPress = () => {
    const { item, onPress } = this.props;
    onPress(item);
  };

  render() {
    const { themedStyles, theme, item, typedIcon, testID } = this.props;
    const { name, address, text, line } = item;

    return (
      <TouchableOpacity style={themedStyles.itemAddressView} onPress={this.handleAddressPress} testID={testID}>
        <Icon
          name={`addresses.${typedIcon || 'defaultAddress'}`}
          color={theme.color.primaryText}
          style={themedStyles.iconSpace}
          height={20}
        />
        <View style={themedStyles.flex}>
          <Text style={themedStyles.itemAddressText}>
            {name || text || line}
          </Text>
          {address &&
            <Text numberOfLines={1} style={themedStyles.itemAddressSubText}>
              {address.line}
            </Text>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTheme(AddressItem, styles);
