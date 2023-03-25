/**
 * Created by konstantin on 20.07.16.
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
    AsyncStorage
} from 'react-native';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userActions from '../redux/User'

import Button from '../components/Button'
import InputTextRegister from '../components/InputTextRegister'
import API from '../src/API'
import LoadingSpinner from '../components/LoadingSpinner'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

let heightBotton = Platform.OS === 'ios' ? 55 : 78

@connect(state => ({
    user: state.user,
}), dispatch => bindActionCreators({
    ...userActions,
}, dispatch))

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'demo',
            pass: 'pw1234',
            visible: false
        };
    }

    componentDidMount() {
        let nav = this.props.navigator;
        console.log(nav.getCurrentRoutes(0)[nav.getCurrentRoutes(0).length-1]);


        setTimeout(function(){
            nav.immediatelyResetRouteStack([nav.getCurrentRoutes(0)[nav.getCurrentRoutes(0).length-1]]);
        },1750);
    }

    onRegisterPage()
    {
        this.props.navigator.push(
        {
            name: 'AuthPage',
        })
    }

    onWebViewPage(details)
    {
        this.props.navigator.push(
            {
                name: 'WebViewPage',
                uri: `https://dev-app.ph360.me/mobile/${details}`
            })
    }

    async authLogin() {
        this.setState({visible:true})
        const {email, pass} = this.state;

        try {
            userInfo = await API.signIn(email, pass)
        }
        catch (e) {
            return console.log('signIn error', e)
        }

        console.log('registered', userInfo);
        this.props.userSignIn(userInfo);

        try {
            await AsyncStorage.setItem('Token', userInfo.token);
        } catch (error) {
            console.log('error set', error)
        }

        console.log('on Dashboard Page');
        if(!userInfo.user.registered){
            this.setState({visible:false})
            this.onWebViewPage(`register?id=${userInfo.user.id}`)
            return
        }
        if(!userInfo.user.hra){
            this.setState({visible:false})
            this.onWebViewPage(`hra`)
            return
        }

        this.setState({visible:false})

        this.props.navigator.push(
        {
            name: 'DashboardPage',
        })
    }

    onForgotPassPage(){
        this.props.navigator.push(
        {
            name: 'ForgotPassword',
        })
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Image style={styles.backgroundImage}  source={require('../resources/login-background2.png')}/>
                <StatusBar backgroundColor='#44c5fb' barStyle='light-content'/>
                <View style={{flex:1, padding:25}}>
                    <View style={{flex:0.3, justifyContent:'center'}}>
                        <Image style={styles.logo} source={require('../resources/pimgpsh_fullsize_distr.png')}/>
                    </View>

                    <View style={{flex:0.2, justifyContent:'center'}}>
                        <Text style={styles.text}>PLEASE LOGIN USING{'\n'}YOUR SHAE OR PH360 ACCOUNT</Text>
                    </View>

                    <InputTextRegister styleConteiner={styles.inputText} defaltText="Email" textColor='#fff'
                                       imageSource={require('../resources/icon/email.png')}
                                       onChangeText={email => this.setState({email})}
                                       curretnValue={this.state.email}/>

                    <InputTextRegister styleConteiner={{flex:0.1, flexDirection:'row'}} defaltText="Password"
                                       textColor='#fff' imageSource={require('../resources/icon/password.png')}
                                       onChangeText={pass => this.setState({pass})}
                                       curretnValue={this.state.pass}/>

                    <View style={{flex: 0.3, marginTop:20}}>

                    <Button styleConteiner={{justifyContent:'center'}} textButton={'LOGIN'} colorTextButton='#30a9e5'
                            styleButton={styles.styleButton} onPress={()=>this.authLogin()}/>

                    <TouchableOpacity style={{justifyContent:'center', marginTop:15}} onPress={this.onForgotPassPage.bind(this)}>
                        <Text style={[styles.text, {fontSize:13}]}>FORGOT PASSWORD?</Text>
                    </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.createAccount} onPress={()=>{this.onRegisterPage()}}>
                    <Text style={[styles.text, {fontSize:17}]}>CREATE ACCOUNT</Text>
                </TouchableOpacity>
                <LoadingSpinner visible={this.state.visible}/>
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
    text:{
        color:'#fff',
        alignSelf:'center',
        textAlign:'center',
        fontFamily:'Roboto-Light',
        fontSize:15
    },
    inputText:{
        flex:0.1,
        flexDirection:'row',
        borderBottomColor:'#fff',
        borderBottomWidth:0.5
    },
    logo:{
        alignSelf:'center',
        height:82,
        width:230
    },
    styleButton:{
        backgroundColor:'#fff',
    },
    createAccount:{
        justifyContent:'center',
        backgroundColor:'rgba(48,169,229,0.7)',
        position:'absolute',
        top:deviceHeight-heightBotton,
        height:55,
        width:deviceWidth
    }
});

export default LoginPage;