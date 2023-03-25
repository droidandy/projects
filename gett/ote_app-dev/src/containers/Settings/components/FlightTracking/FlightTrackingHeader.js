import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import { Icon } from 'components';
import NavImageButton from 'components/Common/NavImageButton';

import { withTheme } from 'theme';

import styles from './headerStyles';

class FlightTrackingHeader extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  handleBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };

  render() {
    const { navigation, theme, themedStyles } = this.props;
    const { flight, airline } = navigation.state.params;

    return (
      <View style={themedStyles.container}>
        <View style={themedStyles.header}>
          <View style={themedStyles.backBtnContainer}>
            <NavImageButton
              onClick={this.handleBack}
              styleView={themedStyles.backBtn}
              icon={<Icon size={20} name="close" color={theme.color.white} />}
            />
          </View>
          <View style={themedStyles.flex}>
            <Text style={themedStyles.headerFlightTextPrimary}>{flight}</Text>
            <Text style={themedStyles.headerFlightTextSecondary}>{airline}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default withTheme(FlightTrackingHeader, styles);
