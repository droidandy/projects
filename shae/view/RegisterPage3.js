/**
 * Created by konstantin on 22.07.16.
 */

import React, { Component } from 'react';
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
    ScrollView,
    Alert,
} from 'react-native';

import Button from '../components/Button'
import WebView from '../components/WebViewPage'


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

let heightBotton = Platform.OS === 'ios' ? 46 : 70

var baseHeight = 640;
var baseWidth = 360;

let marginTopImage = 35;
let marginTopText = 30;
let marginTopButton = 30;
let marginTopButton2 = 10;
let marginTopTextLogin = 15;

var alertMessage = `dfw;lhv` + deviceWidth


export default class RegisterPage3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textEmail: '',
            textPassword: '',
        };
    }
    
    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar backgroundColor='#44c5fb'/>
                
                <View style={styles.lining}>
                    <View style={{flex:0.7, justifyContent:'center'}}>
                        <Image style={styles.logo} source={require('../resources/registr-circul3.png')}/>
                    </View>

                    <View style={{flex:0.3}}>
                        <View>
                            <Text style={styles.textTitle}>Become a Member</Text>
                        </View>

                        <Text style={styles.text}>
                            Fees will be charged once every month. You can cancel your subscription at any time.
                        </Text>
                    </View>


                    <Button styleConteiner={{justifyContent:'center', flex:0.25}}
                            textButton={'$19 MONTHLY'}
                            colorTextButton='#fff'
                            onPress={() => this.props.onRegisterPageMonthly()}/>


                    <View style={{justifyContent:'center', flex:0.2}}>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.onRegisterPageAnnual()}>
                            <Text style={styles.buttonText}>$197 YEARLY
                                <Text style={[styles.buttonText, {fontSize:10}]}> (SAVE $31)</Text>
                            </Text>

                        </TouchableOpacity>
                    </View>

                    <View style={styles.link}>
                        <Text style={styles.textLink}>HAVE AN ACCOUNT?
                            <Text style={[styles.textLink, {color:'#44c5fb'}]} onPress={this.props.onLoginPress}> LOGIN</Text>
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage:{
        height: deviceHeight,
        width:deviceWidth,
        position:'absolute'
    },
    textTitle:{
        fontFamily:'Roboto-Bold',
        color:'#2d3036',
        fontSize:19,
        alignSelf:'center'
    },
    text:{
        fontFamily:'Roboto-Regular',
        color:'#2d3036',
        fontSize:13,
        fontWeight: '400',
        alignSelf:'center',
        textAlign:'center',
        marginTop:7
    },
    lining:{
        flex:1,
        backgroundColor:'#fff',
        height:deviceHeight - heightBotton,
        marginTop:29,
        margin:20,
        borderRadius:10,
        padding:20
    },
    logo:{
        height:190,
        width:190,
        alignSelf:'center'
    },
    link:{
        flex:0.1,
        justifyContent:'center',
    },
    textLink:{
        fontFamily:'Roboto-Bold',
        color:'#c1ced3',
        fontSize:11,
        fontWeight: '400',
        textAlign:'center'
    },
    button:{
        justifyContent:'center',
        height:55,
        borderRadius:35,
        backgroundColor:'#44c5fb'
    },
    buttonText: {
        color:'#fff',
        fontSize:15,
        fontWeight: '400',
        alignSelf:'center',
        fontFamily:'Roboto-Regular'
    },
});

export default RegisterPage3;

