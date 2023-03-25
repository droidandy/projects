import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { Icon } from 'components';

import assets from 'assets';

import { color } from 'theme';

import { containers } from 'testIDs';

import styles from './styles';

const IDs = containers.Promo;

export default class PromoBlackTaxi extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    onSelect: PropTypes.func
  };

  state = {
    animationType: 'fadeInDown'
  };

  handleSelect = () => {
    this.props.onSelect();

    this.handleClose();
  }

  handleClose = () => {
    this.setState({ animationType: 'fadeOutUp' }, () => {
      setTimeout(this.props.onClose, 1000);
    });
  }

  render() {
    return (
      <Animatable.View animation={this.state.animationType} style={[styles.container, styles.row]} testID={IDs.view}>
        <TouchableWithoutFeedback delay={500} onPress={this.handleSelect} testID={IDs.select}>
          <View style={styles.row}>
            <View style={styles.logoPlaceholder} />
            <Animatable.Image animation="fadeInLeft" delay={1000} source={assets.blackCabPromo} style={styles.logo} />

            <Text style={styles.label}>Choose Black Taxi for quickest arrival times</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity style={styles.icon} onPress={this.handleClose} testID={IDs.close}>
          <Icon name="close" color={color.white} size={14} />
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}
