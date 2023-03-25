/**
 * Created by konstantin on 01.08.16.
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

import Swiper from 'react-native-swiper'

import RegisterPage from '../view/RegisterPage'
import RegisterPage3 from '../view/RegisterPage3'


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


const renderPagination = (index, total, context) => {
    console.log("renderPagination")
}

export default class AuthPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onBoardingIndex: 0
        };
        this.onScrollNext = this.onScrollNext.bind(this)

    }

    onScrollNext (e, state, context) {
        //console.log(state.index)
        let index = state.index - this.state.onBoardingIndex
        this.setState({ onBoardingIndex: index })
    }

    onPressNext () {
        this.setState({ onBoardingIndex: ++this.state.onBoardingIndex})
        this.swiper.scrollBy(this.state.onBoardingIndex)
        //console.log('onPressNext', this.state.onBoardingIndex)
    }

    onLoginPage() {
        //console.log('onLoginPage')
        this.props.navigator.push({name: 'LoginPage'})
    }

    onRegisterPage(details)
    {
        this.props.navigator.push(
            {
                name: 'WebViewPage',
                uri: `https://dev-app.ph360.me/mobile/${details}`
            })
    }

    render() {
        //console.log('Rendering auht page', this.state.onBoardingIndex)
        var ind = this.state.onBoardingIndex
        return (
            <View style={{flex:1}}>
                <StatusBar backgroundColor='#44c5fb' barStyle='light-content'/>
                <Image style={styles.backgroundImage}  source={require('../resources/login-background2.png')}/>

                <Swiper style={{paddingBottom:20, }} showsPagination={false}
                        loop={false}
                        ref={node => this.swiper = node}
                        onMomentumScrollEnd={this.onScrollNext}
                        index={0}
                        height={deviceHeight - 15}>
                    <RegisterPage   onPress={()=>this.onPressNext()}
                                    onLoginPress={()=>this.onLoginPage()}
                                    flag={false}
                                    titleText={'Introducing Shae'}/>

                    <RegisterPage   onPress={()=>this.onPressNext()}
                                    onLoginPress={()=>this.onLoginPage()}
                                    flag={true}
                                    titleText={'How Shae works'}/>

                    <RegisterPage3 onPress={()=>this.onPressNext()}
                                   onLoginPress={()=>this.onLoginPage()}
                                   onRegisterPageMonthly={()=>this.onRegisterPage('purchase?type=MONTHLY')}
                                   onRegisterPageAnnual={()=>this.onRegisterPage('purchase?type=ANNUAL')}/>

                </Swiper>
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
});

export default AuthPage;
