/**
 * Created by konstantin on 03.08.16.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Platform,
    AsyncStorage,
    WebView
} from 'react-native';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userActions from '../redux/User'

import WebViewBridge from 'react-native-webview-bridge';
import API from '../src/API'

@connect(state => ({
    user: state.user,
}), dispatch => bindActionCreators({
    ...userActions,
}, dispatch))

export default class WebViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    onBridgeMessage(message){
        const {webviewbridge} = this.refs;
        console.log('webView', message)

    }

    render() {
        console.log(API.AuhToken)
        return (
            <WebViewBridge
                ref="webviewbridge"
                onBridgeMessage={this.onBridgeMessage.bind(this)}
                source={{uri:this.props.uri, headers:{'User-Token': this.props.user.token}}}
                style={{marginTop: 20}}
            />
        )
    }
}