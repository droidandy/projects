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
    Dimensions,
    TextInput
} from 'react-native';

const deviceWidth = Dimensions.get('window').width

export default class InputTextRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }

    render() {
        const {
            styleConteiner,
            onChangeText,
            curretnValue,
        } = this.props;

        return (
            <View style={styleConteiner}>
                <Image style={styles.imageEmail} source={this.props.imageSource} resizeMode={'contain'}/>
                <TextInput
                    style={[{color:this.props.textColor}, styles.inputText]}
                    underlineColorAndroid='rgba(255,255,255,0.01)'
                    onChangeText={onChangeText}
                    placeholder={this.props.defaltText}
                    placeholderTextColor={this.props.textColor}
                    value={curretnValue}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageEmail: {
        alignSelf:'center',
        height:17,
        width:17
    },
    inputText:{
        fontFamily:'Roboto-Regular',
        width:deviceWidth - 25,
        marginLeft:15,
        fontSize:16,
    }
});

export default InputTextRegister;