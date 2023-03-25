/**
 * Created by user on 16.06.16.
 */
import React from 'react';
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
    tintColor: '#d61c14'
  }
});

export default class IconBack extends React.Component {

  static propTypes = {
    icon: React.PropTypes.oneOf([
      'back',
      'forward'
    ]).isRequired
  };

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
