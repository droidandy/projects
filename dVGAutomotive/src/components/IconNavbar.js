/**
 * Created by user on 16.06.16.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet
} from 'react-native';

const style = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 3,
    padding: 10,
    tintColor: '#09157c'
  }
});

class IconBack extends Component {
  render() {
    let { icon } = this.props;
    switch (icon) {
      case 'back':
        icon = require('../assets/images/backward.png');
        break;
      case 'forward':
        icon = require('../assets/images/forward.png');
        break;
      default:
        break;
    }
    return (
      <Image
        source={icon}
        style={style.icon}
        resizeMode="contain"
      />
    );
  }
}
IconBack.propTypes = {
  icon: PropTypes.oneOf([
    'back',
    'forward'
  ]).isRequired
};

export default IconBack;
