'use strict';

import React, { Component } from 'react';
import codePush from "react-native-code-push";

import {
    View,
    Text,
} from 'react-native';
import {
    addNavigationHelpers,
} from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Root } from './config/router';
global._ = _;

/*
we use for http://microsoft.github.io/code-push/ to be able to update the app without an appstore update
 as the users do not exit the app really ofter, we want to check it on every app-resume.
 */
// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
//
// @codePush
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentWillReceiveProps(newProps) {
        let { autoRehydrated: oldAutoRehydrated } = this.props;
        let { autoRehydrated } = newProps;
    }

    componentWillUnmount() {

    }
    componentDidMount() {

    }

    render() {
        const {
          autoRehydrated,
          netinfo,
        } = this.props;

        if (!autoRehydrated) {
            return (<View></View>)
        }
        return (
            <Root />
        )
    }
}

const stateToProps = (state) => {

    const { autoRehydrated, netinfo } = state;
    return { autoRehydrated, netinfo };
};

const dispatchToProps = (dispatch) => {

    return bindActionCreators(_.extend({}), dispatch)
};

export default connect(stateToProps, dispatchToProps)(App)
