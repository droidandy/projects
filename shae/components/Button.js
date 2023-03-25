/**
 * Created by konstantin on 26.07.16.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions
} from 'react-native';

const deviceWidth = Dimensions.get('window').width

export default class Button extends Component {
    constructor (props) {
        super(props)
    }
    render() {
        const {
            styleConteiner,
            styleButton,
            colorTextButton,
            onPress
        } = this.props;
        
        return (
            <View style={styleConteiner}>
                <TouchableOpacity onPress={this.props.onPress} style={[styles.button, styleButton]}>
                    <Text style={[{color:colorTextButton}, styles.text]}>{this.props.textButton}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize:15,
        fontWeight: '400',
        alignSelf:'center',
        fontFamily:'Roboto-Regular'
    },
    button:{
        justifyContent:'center',
        height:55,
        borderRadius:35,
        backgroundColor:'#44c5fb'
    }
});

//export default Button;