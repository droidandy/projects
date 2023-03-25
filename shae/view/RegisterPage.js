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
    ScrollView,
} from 'react-native';

import Button from '../components/Button'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

let heightBotton = Platform.OS === 'ios' ? 46 : 70

export default class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:''
        };
    }

    onRegisterPage()
    {
        this.props.navigator.push(this.props.flag?{name: 'RegisterPage3'} :{name: 'RegisterPage2'})
    }
    

    render() {
        const {
            titleText,
        } = this.props;
                
        return (
            <View style={{flex:1}}>
                <StatusBar backgroundColor='#44c5fb'/>

                <View style={styles.lining}>
                    <View style={{flex:0.7, justifyContent:'center'}}>
                        <Image style={styles.logo} source={require('../resources/registr-circul.png')}/>
                    </View>
                    <View style={{flex:0.3}}>
                        <View>
                            <Text style={styles.textTitle}>{titleText}</Text>
                        </View>

                        <Text style={styles.text}>
                            Mobile app allows you to get consultations by specialists on what to eat and drink depending
                            on your lifestyle, body and habits.
                        </Text>

                    </View>
                    <Button styleConteiner={{justifyContent:'center', flex:0.5}} textButton={'NEXT'}
                            colorTextButton='#fff' colorButton='#44c5fb' onPress={this.props.onPress}/>

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
        marginTop:10
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
        position:'absolute',
        bottom:20,
        left:0,
        right:0,
        justifyContent:'center'
    },
    textLink:{
        fontFamily:'Roboto-Bold',
        color:'#c1ced3',
        fontSize:11,
        fontWeight: '400',
        textAlign:'center',
    }
});

export default RegisterPage;
