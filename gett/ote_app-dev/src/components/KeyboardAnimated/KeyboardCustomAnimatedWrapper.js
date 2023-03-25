import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import KeyboardComponent from './KeyboardComponent';

export default class KeyboardCustomAnimatedWrapper extends KeyboardComponent {
  static propTypes = {
    children: PropTypes.node,
    delay: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    value: PropTypes.number
  };

  static defaultProps = {
    delay: 800,
    value: -100
  };

  customAnim = new Animated.Value(0);

  keyboardDidShow = () => {
    this.animate(1, true);
  };

  keyboardDidHide = () => {
    this.animate(0, false);
  };

  animate = (toValue, keyboardShow) => {
    const { delay } = this.props;
    const { openedKeyboard } = this.state;

    if (openedKeyboard !== keyboardShow) {
      this.setState({ openedKeyboard: keyboardShow });
      Animated.timing(
        this.customAnim,
        {
          toValue,
          duration: delay,
          useNativeDriver: true
        }
      ).start();
    }
  };

  render() {
    const { children, style, value } = this.props;

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{
              translateY: this.customAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, value]
              })
            }]
          }
        ]}
      >
        {children}
      </Animated.View>
    );
  }
}
