/**
 * Created by konstantin on 26.07.16.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    StatusBar,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';

import NavBar from '../components/NavBar'
import Button from '../components/Button'
import InputTextRegister from '../components/InputTextRegister'
import API from '../src/API'


const deviceWidth = Dimensions.get('window').width

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textEmail: '',
        };
    }

    async forgotPassword() {

        const {email} = this.state;

        try {
            successForgotPassword = await API.POST('forgotpass', email)
        }
        catch (e) {
            return console.log(e)
        }

        console.log(successForgotPassword)
        this.props.successForgotPassword(successForgotPassword.success)

        this.props.navigator.push(
            {
                name: 'LoginPage',
            })
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor: "#fff"}}>
                <StatusBar backgroundColor='#44c5fb'/>
                
                <NavBar imageSource={require('../resources/icon/back_arrow.png')} titleNavBar={'FORGOT PASSWORD'} onMenuPress={() => this.props.navigator.pop()}/>

                <View style={{flex:1, paddingHorizontal:30}}>
                    <View style={{flex:2, justifyContent:'center'}}>
                        <Text style={styles.text}>
                            Please enter your email to reset your password
                        </Text>
                    </View>

                    <InputTextRegister styleConteiner={styles.inputText} defaltText="Email"
                                       textColor='#2d3036' imageSource={require('../resources/icon/email_dark.png')}/>
                    
                    <Button styleConteiner={{flex:1.3, justifyContent:'center'}} textButton={'RESET PASSWORD'}
                            colorTextButton='#fff' styleButton={styles.styleButton}/>

                    <View style={{flex:4}}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color:'#2d3036',
        fontSize:17,
        fontFamily:'Roboto-Regular',
        alignSelf:'center',
        textAlign:'center'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    styleButton:{
        backgroundColor:'#44c5fb',
        height:55
    },
    inputText:{
        flex:1,
        flexDirection:'row',
        borderBottomColor:'#96979a',
        borderBottomWidth:1
    },
});

export default ForgotPassword;