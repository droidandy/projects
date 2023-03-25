import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  Animated,
  Image
} from 'react-native';

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff'
  }
});
const { width, height } = Dimensions.get('window');
const bg = require('../../assets/splash.jpg');

class SplashScreen extends Component {
  state = { opacity: new Animated.Value(1) };

  componentWillReceiveProps(newProps) {
    Animated.timing(this.state.opacity, {
      toValue: newProps.loaded ? 0 : 1,
      duration: 1500
    }).start();
  }

  render() {
    const { loaded } = this.props;
    return (
      <Animated.View
        style={[style.container, { opacity: this.state.opacity }]}
        pointerEvents={loaded ? 'none' : 'auto'}
      >
        <Image
          style={{ width, height }}
          source={bg}
          resizeMode="cover"
        />
      </Animated.View>
    );
  }
}
SplashScreen.propTypes = {
  loaded: PropTypes.bool.isRequired
};

export default SplashScreen;
