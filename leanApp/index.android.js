/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    AppRegistry
} from 'react-native';

import { WebAddress } from './src/config';
import WebViewScreen from './src/WebViewScreen';

const LeanApp = () => (
<WebViewScreen
URL={WebAddress.URL}
/>
);

AppRegistry.registerComponent('LeanApp', () => LeanApp);
