/**
 * Created by konstantin on 27.07.16.
 */


import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    ScrollView,
    Text,
    AsyncStorage
} from 'react-native';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userActions from '../redux/user'

import MenuItem from './MenuItem'
import API from '../src/API'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

    //<Image  style={styles.afa}  source={require('../resources/TonyStark.png')}/>

@connect(state => ({
    user: state.user,
}), dispatch => bindActionCreators({
    ...userActions,
}, dispatch))

export default class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onWebViewPage(details){
        this.props.navigator.push(
            {
                name: 'WebViewPage',
                uri: `https://dev-app.ph360.me/mobile/${details}`
            })
    }
    
    onLogOut() {
        AsyncStorage.removeItem('Token');
        API.AuthToken = null;
        this.props.navigator.push(
            {
                name: 'LoginPage',
            })
    }

    render() {

        const{
            onPressItem
        } = this.props;

        return (
            <View style={{flex:1}}>
                <Image  style={styles.backgroundImage}  source={require('../resources/tytel-menu-backgroud.png')}>
                    <Text style={styles.name}>{this.props.user.name}</Text>
                </Image>
                <Image  style={styles.afa}  source={{uri: this.props.user.avatar}}/>

                <ScrollView style={styles.menu} contentContainerStyle={{justifyContent:'space-between'}}>
                    <MenuItem imageItemSource={require('../resources/icon/dashboard.png')} textItem='Dashboard' onPressItem={()=>this.onWebViewPage('dashboard')}/>
                    <MenuItem imageItemSource={require('../resources/icon/food.png')} textItem='Food' onPressItem={()=>this.onWebViewPage('food')}/>
                    <MenuItem imageItemSource={require('../resources/icon/fitness.png')} textItem='Fitness' onPressItem={()=>this.onWebViewPage('fitness')}/>
                    <MenuItem imageItemSource={require('../resources/icon/mind.png')} textItem='Mind' onPressItem={()=>this.onWebViewPage('mind')}/>
                    <MenuItem imageItemSource={require('../resources/icon/place.png')} textItem='Place' onPressItem={()=>this.onWebViewPage('social')}/>
                    <MenuItem imageItemSource={require('../resources/icon/social.png')} textItem='Social' onPressItem={()=>this.onWebViewPage('place')}/>
                    <MenuItem imageItemSource={require('../resources/icon/talents.png')} textItem='Tilents' onPressItem={()=>this.onWebViewPage('talent')}/>
                    <MenuItem imageItemSource={require('../resources/icon/account.png')} textItem='Account' onPressItem={()=>this.onWebViewPage('account')}/>
                    <MenuItem imageItemSource={require('../resources/icon/logout.png')} textItem='Logout' onPressItem={()=>this.onLogOut()}/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    name:{
        backgroundColor: "transparent",
        color: '#fff',
        fontSize: 23,
        fontFamily: 'Roboto-Regular',
        alignSelf: 'center',
        textAlign: 'center',
        position:'absolute',
        marginLeft: deviceWidth * 0.20,
        top:deviceHeight * 0.10,

    },
    afa:{
        position:'absolute',
        marginLeft: deviceWidth * 0.27,
        top:deviceHeight * 0.18,
        height:70,
        width:70,
        borderRadius:35
    },
    backgroundImage:{
        height:deviceHeight * 0.25,
        width:deviceWidth * 0.75,
        opacity: 0.8
    },
    text: {
        color: '#2d3036',
        fontSize: 17,
        fontFamily: 'Roboto-Regular',
        alignSelf: 'center',
        textAlign: 'center'
    },
    menu:{
        marginTop:deviceHeight * 0.08,
    }
});


export default ControlPanel;
