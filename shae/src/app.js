/**
 * Created by konstantin on 20.07.16.
 */

import React, {Component} from 'react';
import {
    Navigator,
    View,
    Dimensions,
    AsyncStorage,
    StatusBar,
    Platform
} from 'react-native';

import {Provider} from 'react-redux'
import Store from '../redux'
import API from './API'

import * as actionsUser from '../redux/User'

import LoadingSpinner from '../components/LoadingSpinner';

import FirstPage from '../view/FirstPage'
import RegisterPage from '../view/RegisterPage'
import RegisterPage2 from '../view/RegisterPage2'
import RegisterPage3 from '../view/RegisterPage3'
import LoginPage from '../view/LoginPage'
import ForgotPassword from '../view/ForgotPassword'
import DashboardPage from '../view/DashboardPage'
import AuthPage from '../view/AuthPage'
import WebViewPage from '../components/WebViewPage'
import Notification from '../view/NotificationsPage'



export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signUp: false,
            loadingInProgress: false,
            firstView:'',
            stopSpinner: true
        };
    }

    async checkUserAuth() {
        const token = await AsyncStorage.getItem('Token');
        API.AuthToken = token;
        if (token) {
            let userInfo;
            try {
                userInfo = await API.GET('user');
            } catch (exception) {
                console.log(exception);
                this.setState({signUp: false, stopSpinner:false});
            }
            if (userInfo) {
                console.log('userInfo ', token);
                userInfo.token = token;
                Store.dispatch(actionsUser.userSignIn(userInfo));
                this.setState({signUp: true, firstView:'DashboardPage'});
                console.log('before userInfo token');
            } else {
                console.log('userInfo undefined');
                AsyncStorage.removeItem('Token');
                API.AuthToken = null;
            }
        } else {
            this.setState({signUp: false, stopSpinner:false});
        }
    }

    async checkToken() {
        const token = await AsyncStorage.getItem('Token');
        //console.log('Token ', token)
        API.AuthToken = token;
        if (token) {
            let successToken;
            let date = new Date();
            let offsetInHours = date.getTimezoneOffset() * 60;
            let tz_string = await API.ipApiInfo()
            //console.log(tz_string, offsetInHours)
            try {
                successToken = await API.POST('checkToken', {tz_time:offsetInHours, tz_string:'Melbourne/Australia'});
            } catch (exception) {
                console.log(exception);
                this.setState({loadingInProgress: false, stopSpinner: false});
                return
            }
            this.setState({loadingInProgress: successToken.success});
            //console.log('successToken ', this.state.loadingInProgress);
        } else {
            console.log('no token')
            this.setState({loadingInProgress: false});
        }

        if(this.state.loadingInProgress) {
            this.checkUserAuth();
        } else {
            this.setState({signUp:false, firstView:'LoginPage', stopSpinner: false})
        }
    }

    async checkNotification () {
        /*const notification = await AsyncStorage.getItem('Notification');
        if(!notification || notification != null || notification != 'undefined') {
            this.setState({signUp: false, firstView: 'Notification', stopSpinner: false})
        } else {
            this.checkToken();
        }*/
        this.checkToken();
    }


    componentWillMount() {
        this.checkNotification()
    }

    renderScene (route, navigator){

        switch (route.name){
            case 'LoginPage':
                return <LoginPage {...route} navigator={navigator}/>;
            case 'RegisterPage':
                return <RegisterPage {...route} navigator={navigator} flag={false} titleText={'Introducing Shae'}/>
            case 'RegisterPage2':
                return <RegisterPage {...route} navigator={navigator} flag={true} titleText={'How Shae works'}/>;
            case 'RegisterPage3':
                return <RegisterPage3 {...route} navigator={navigator}/>;
            case 'FirstPage':
                return <FirstPage  {...route} navigator={navigator}/>;
            case 'ForgotPassword':
                return <ForgotPassword  {...route} navigator={navigator}/>;
            case 'DashboardPage':
                return <DashboardPage  {...route} navigator={navigator}/>;
            case 'AuthPage':
                return <AuthPage  {...route} navigator={navigator}/>;
            case 'WebViewPage':
                return <WebViewPage  {...route} navigator={navigator}/>;
            case 'Notification':
                return <Notification  {...route} navigator={navigator} nameImage={'../resources/notifications-android-background.png'}/>;
            default:
                if(this.state.signUp) {
                    return <DashboardPage  {...route} navigator={navigator}/>;
                } else {
                    return (<View style={{flex:1}}>
                            <LoginPage {...route} navigator={navigator}/>
                            <LoadingSpinner visible={this.state.stopSpinner}/>
                        </View>
                    )
                }
        }
    }

    render() {
        return (
            <Provider store={Store}>

                <Navigator
                    initialRoute={{name:this.state.firstView}}
                    renderScene={this.renderScene.bind(this)}
                    ref="navigator"
                >
                </Navigator>
            </Provider>
        );
    }
}

