import { Component } from 'react';
import { Keyboard, Platform } from 'react-native';

export default class KeyboardComponent extends Component {
  state = {
    openedKeyboard: false
  };

  componentDidMount() {
    this.keyboardDidShowListener = this.getListener('Show');
    this.keyboardDidHideListener = this.getListener('Hide');
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  getListener = type => (
    Keyboard.addListener(
      Platform.OS === 'android' ? `keyboardDid${type}` : `keyboardWill${type}`,
      this[`keyboardDid${type}`]
    )
  );
}
