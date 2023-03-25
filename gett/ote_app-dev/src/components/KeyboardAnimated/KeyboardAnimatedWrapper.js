import React from 'react';
import PropTypes from 'prop-types';
import { View as AnimatableView } from 'react-native-animatable';
import KeyboardComponent from './KeyboardComponent';

export default class KeyboardAnimatedWrapper extends KeyboardComponent {
  static propTypes = {
    children: PropTypes.node,
    delay: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    touchEvents: PropTypes.bool,
    type: PropTypes.string
  };

  static defaultProps = {
    delay: 800,
    type: 'fade'
  };

  setRef = (el) => {
    this.view = el;
  };

  keyboardDidShow = () => {
    this.animationDirection('OutUp', true);
  };

  keyboardDidHide = () => {
    this.animationDirection('InDown', false);
  };

  animationDirection = (direction, keyboardShow) => {
    const { type, delay } = this.props;
    const { openedKeyboard } = this.state;

    if (openedKeyboard !== keyboardShow) {
      this.setState({ openedKeyboard: keyboardShow });
      this.view[`${type}${direction}`](delay);
    }
  };

  render() {
    const { openedKeyboard } = this.state;
    const { children, style, touchEvents, testID } = this.props;

    return (
      <AnimatableView
        pointerEvents={(!openedKeyboard || touchEvents) ? 'auto' : 'none'}
        ref={this.setRef}
        useNativeDriver
        style={style}
        testID={testID}
      >
        {children}
      </AnimatableView>
    );
  }
}
