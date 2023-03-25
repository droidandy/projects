import React from 'react';
import {
    StackNavigator
} from 'react-navigation';

import Home from '../containers/HomeContainer';
import Intro from '../components/Intro';

export const Root = StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: ({navigation, screenProps}) => ({
            title: '',
            headerBackTitle: null
        }),
    },
    Intro: {
        screen: Intro,
        navigationOptions: ({navigation, screenProps}) => ({
            title: '',
            headerBackTitle: null
        }),
    },
}, {
    // mode: 'card',
    headerMode: 'none',
});
