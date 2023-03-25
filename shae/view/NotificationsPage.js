/**
 * Created by konstantin on 05.08.16.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Platform,
    StatusBar,
    Image,
    AsyncStorage
} from 'react-native';

import Button from '../components/Button'
var DeviceInfo = require('react-native-device-info');
import API from '../src/API'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

//<Image style={styles.backgroundImage}  source={require(this.props.nameImage)}/>

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uriName:''
        };
    }

    async onNatification(){
        const token = await AsyncStorage.getItem('Token');
        API.AuthToken = token;
        console.log(Platform.OS)
        if (token) {
            let successToken;
            try {
                successToken = await API.POST('checkToken', {device: Platform.OS, tz_string: 'Melbourne/Australia'});
            } catch (exception) {
                console.log(exception);
                this.setState({loadingInProgress: false, stopSpinner: false});
                return
            }
        }
    }

    render() {
            //{console.log("Device Unique ID", DeviceInfo.getUniqueID()); }  // e.g. iPhone7,2 / or the board on Android e.g. goldfish
            return (
           <View style={{flex:1, backgroundColor:'#fff'}}>
               <StatusBar backgroundColor='#44c5fb' barStyle='light-content'/>
               {
                   Platform.OS === 'ios' ?
                       <Image style={styles.backgroundImage}
                              source={require('../resources/notifications-background.png')}/>
                       :
                       <Image style={styles.backgroundImage}
                              resizeMode={'stretch'}
                              source={require('../resources/notifications-android-background.png')}/>
               }
               <View style={{flex:1, padding:40, }}>
                    <View style={{flex:9, justifyContent:'center', alignItems:'center'}}>
                       <View style={[styles.circul, {height:260, width:260, borderRadius:130}]}>
                           <View style={[styles.circul, {backgroundColor:'rgba(125,141,181,0.01)', height:220, width:220, borderRadius:110}]}>
                               <View style={[styles.circul, {backgroundColor:'rgba(125,141,181,0.2)', height:200, width:200, borderRadius:105}]}>
                                   <View style={[styles.circul, {backgroundColor:'rgba(125,141,181,0.01)', height:160, width:160, borderRadius:80}]}>
                                       <View style={[styles.circul, {backgroundColor:'rgba(125,141,181,0.3)', height:140, width:140, borderRadius:70}]}>
                                           <Image resizeMode={'contain'} style={styles.imageNotification}  source={require('../resources/icon/notification.png')}/>
                                       </View>
                                   </View>
                               </View>
                           </View>
                       </View>
                    </View>


                   <View style={{flex:3}}>
                       <View>
                           <Text style={styles.textTitle}>Push Notifications</Text>
                       </View>

                       <Text style={styles.text}>
                           Allow Shae to send you push notifications about your health.
                       </Text>
                   </View>

                   <Button styleConteiner={{justifyContent:'center', flex:2}}
                           textButton={'LET’S DO IT'}
                           colorTextButton='#44c5fb'
                           styleButton={styles.button}
                           onPress={() => this.onNatification()}/>

                   <View style={styles.link}>
                       <Text style={[styles.textLink, {color:'#44c5fb'}]}
                             onPress={this.props.onLoginPress}> NO THANKS, ANOTHER TIME</Text>
                   </View>
               </View>
           </View>
        )
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        height: deviceHeight,
        width: deviceWidth,
        position: 'absolute'
    },
    textTitle:{
        fontFamily:'Roboto-Bold',
        color:'#fff',
        fontSize:19,
        alignSelf:'center',
        backgroundColor: 'rgba(255,255,255,0)'
    },
    text:{
        fontFamily:'Roboto-Regular',
        color:'#fff',
        fontSize:13,
        fontWeight: '400',
        alignSelf:'center',
        textAlign:'center',
        marginTop:7,
        backgroundColor: 'rgba(255,255,255,0)'
    },
    button:{
        justifyContent:'center',
        height:55,
        borderRadius:35,
        backgroundColor:'#fff'
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
        backgroundColor: 'rgba(255,255,255,0)'
    },
    imageNotification:{
        alignSelf:'center',
    },
    circul:{
        backgroundColor:'rgba(125,141,181,0.3)',
        justifyContent:'center',
        alignItems:'center'
    }
});
