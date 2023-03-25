/**
 * Created by konstantin on 27.07.16.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Platform,
    Animated,
    WebView,
    AsyncStorage
} from 'react-native';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userActions from '../redux/User'

import NavBar from '../components/NavBar'
import Drawer from 'react-native-drawer'
import ControlPanel from '../components/ControlPanel'
import {Colors} from '../src/styles/const'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const token = AsyncStorage.getItem('Token');

@connect(state => ({
    user: state.user,
}), dispatch => bindActionCreators({
    ...userActions,
}, dispatch))

export default class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verticalLine:false,
            opacityLine:0.7,
            leftLinePosition: new Animated.Value(-deviceWidth),
            leftLineShown: false,
        };
    }

    onShowLine(event)
    {
        //Animated.timing( this.state.leftLinePosition, {toValue: deviceWidth * 0.0002, duration: 300}).start()
        this.setState({leftLineShown:true})
    }

    onHideLine(event)
    {
        //Animated.timing(this.state.leftLinePosition, {toValue: -deviceWidth, duration: 500}).start()
        this.setState({leftLineShown:false})
    }

    closeControlPanel(){
        //this.setState({verticalLine:false},()=>console.log(this.state.verticalLine))
        this._drawer.close()
        this.setState({leftLineShown:false})
    };
    openControlPanel = () => {
        //this.setState({verticalLine:true},()=>console.log(this.state.verticalLine))
        this.onShowLine()
        this._drawer.open()

    };

    componentDidMount() {
        let nav = this.props.navigator;
         setTimeout(function(){
             nav.immediatelyResetRouteStack([nav.getCurrentRoutes(0)[nav.getCurrentRoutes(0).length-1]]);
         },2700);

    }
     
    render() {
        console.log('dashboard token ', this.props.user.token)
        return (
            <View style={{backgroundColor: "#fff", flex: 1}}>
                <Drawer
                    ref={(ref) => this._drawer = ref}
                    content={<ControlPanel navigator={this.props.navigator}/>}
                    openDrawerOffset={0.25}
                    type={'displace'}
                    onClose={this.onHideLine.bind(this)}
                    onOpenStart={() => {this.setState({leftLineShown:true, opacityLine: 0.7})}}
                    tapToClose={true}
                >
                    <View style={{flex:1}}>
                        <StatusBar backgroundColor='#44c5fb' barStyle='light-content'/>

                        <NavBar imageSource={require('../resources/icon/menu.png')}
                                titleNavBar={'Dashboard'}
                                onMenuPress={()=>this.openControlPanel()}
                                showMenu={this.state.leftLineShown}/>
                        <WebView
                            source={{uri:'https://dev-app.ph360.me/mobile/dashboard', headers:{'User-Token': this.props.user.token}}}
                            style={{marginTop: 20}}
                        />
                        {
                            this.state.leftLineShown == true ?
                                //<Animated.View style={[styles.line, {left:this.state.leftLinePosition, opacity:this.state.opacityLine}]}/>
                                <View style={[styles.line, {opacity:this.state.opacityLine}]}/>
                                :
                                null
                        }
                    </View>
                </Drawer>
            </View>
        );
    }
}

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 3},
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
    line:{
        height:deviceHeight,
        width: deviceWidth,
        backgroundColor:'#2d3036',
        position:'absolute',
        top:0
    },
});

export default DashboardPage;