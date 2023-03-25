import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { changeSwipedAddress } from 'actions/passenger';
import { strings } from 'locales';
import { withTheme } from 'theme';
import { containers } from 'testIDs';
import { throttledAction, touchableArea } from 'utils';

const IDs = containers.Settings;
const styles = theme => StyleSheet.create({
  container: {
    paddingRight: 14
  },
  text: {
    fontSize: 17,
    color: theme.color.primaryText
  }
});

const AddAddressBtn = ({ navigation, changeSwipedAddress, themedStyles }) => {
  const theme = navigation.state.params.theme;
  const onAddNewAddress = throttledAction(() => {
    changeSwipedAddress(null);
    navigation.navigate('AddressEditor', { theme });
  });

  return (
    <TouchableOpacity
      onPress={onAddNewAddress}
      style={themedStyles.container}
      hitSlop={touchableArea}
      testID={IDs.addAddressButton}
    >
      <Text style={themedStyles.text}>
        {strings('header.button.add')}
      </Text>
    </TouchableOpacity>
  );
};

AddAddressBtn.propTypes = {
  changeSwipedAddress: PropTypes.func,
  navigation: PropTypes.object,
  themedStyles: PropTypes.object
};

export default connect(null, { changeSwipedAddress })(withTheme(AddAddressBtn, styles));
