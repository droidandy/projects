import React, { Component } from 'react';
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
    backgroundColor: 'green'
  }
});

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const bg = require('./assets/splash.png');

export default class SplashScreen extends Component {
  static propTypes = {
    loaded: React.PropTypes.bool.isRequired
  };

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
            style={{ width: deviceWidth, height: deviceHeight }}
            source={bg}
            resizeMode="cover"
            />
      </Animated.View>
    );
  }
}