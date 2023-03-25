/**
 * Created by konstantin on 22.07.16.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

let heightBotton = Platform.OS === 'ios' ? 46 : 70

export default class RegisterPage2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textEmail: '',
            textPassword: '',
        };
    }

    render() {
        return (
            <View>
                <StatusBar backgroundColor='#44c5fb'/>
                <Image style={{height: deviceHeight, height:deviceHeight, width:deviceWidth, position:'absolute'}}
                       source={require('../resources/login-background.png')}/>

                <View
                    style={{flex:1, backgroundColor:'#fff', height:deviceHeight - heightBotton, marginTop:29,  margin:20, borderRadius:10,}}>
                    <View style={{flex:0.45, justifyContent:'center', alignSelf:'center'}}>
                        <Image style={{height:190, width:190}} source={require('../resources/registr-circul.png')}/>
                    </View>
                    <View style={{flex:0.23}}>
                        <View>
                            <Text
                                style={{fontFamily:'Roboto-Bold', color:'#2d3036', fontSize:20, fontWeight: '400', alignSelf:'center'}}>How
                                Shae works</Text>
                        </View>

                        <Text
                            style={{fontFamily:'Roboto', color:'#2d3036', fontSize:13, fontWeight: '400', alignSelf:'center', textAlign:'center', margin:10}}>
                            Mobile app allows you to get consultations by specialists on what to eat and drink depending
                            on your lifestyle, body and habits.
                        </Text>

                    </View>
                    <View style={{flex:0.17, padding:20}}>
                        <TouchableOpacity
                            style={{justifyContent:'center', height:50, backgroundColor:'#44c5fb', borderRadius:25}}>
                            <Text
                                style={{fontFamily:'Roboto', color:'#fff', fontSize:15, fontWeight: '400', alignSelf:'center'}}>NEXT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{position:'absolute', bottom:20, left:0, right:0, justifyContent:'center'}}>
                        <Text
                            style={{textAlign:'center',fontFamily:'Roboto', color:'#c1ced3', fontSize:15, fontWeight: '400'}}>HAVE
                            AN ACCOUNT?
                            <Text
                                style={{fontFamily:'Roboto', color:'#44c5fb', fontSize:15, fontWeight: '400', alignSelf:'center'}}
                                onPress={() =>console.log('1st')}> LOGIN</Text>
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

module.exports = RegisterPage2;
