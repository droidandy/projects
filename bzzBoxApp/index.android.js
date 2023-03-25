/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

import { Provider } from 'react-redux';
import Store from './src/redux';
import App from './src/app';

class BzzBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <Provider store={Store}>
        <App />
      </Provider>
    );
  }
}

export default BzzBox;

AppRegistry.registerComponent('BzzBox', () => BzzBox);
