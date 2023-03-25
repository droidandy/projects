// https://github.com/facebook/react-native/issues/15114
import React from 'react';
import { Platform, Text, TextInput } from 'react-native';

if (Platform.OS === 'android') {
  const oldRender = Text.render;

  Text.render = function render(...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Roboto', color: 'rgba(0,0,0,0.87)' }, origin.props.style]
    });
  };

  TextInput.defaultProps.selectionColor = '#bbbbbf';
}
