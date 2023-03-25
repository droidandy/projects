import React from 'react-native';

let { StyleSheet, Platform } = React;

export default StyleSheet.create({
    appContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-between',
        backgroundColor: 'transparent'
    },

    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },

    group: {
        alignItems: 'center',
        padding: 15
    },

    image: {
        resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover'
    }
});
