/**
 * Created by konstantin on 26.07.16.
 */


import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions
} from 'react-native';

const deviceWidth = Dimensions.get('window').width

export default class NavBar extends Component {

     render() {
        const{
            onMenuPress,
            titleNavBar,
            showMenu,
            styleBlock
        } = this.props;

        return (
            <View style={styles.containerNavBar}>
                <TouchableOpacity style={{flex:1}} onPress={onMenuPress}>
                    <Image style={styles.buttonNavBar} source={this.props.imageSource}/>
                </TouchableOpacity>
                <View style={{flex:7, alignSelf:'center', alignItems:'center'}}>
                    <Text style={styles.titleNavBar}>{this.props.titleNavBar}</Text>
                </View>
                {
                    this.props.showMenu ?
                        <View style={[styles.changeNavBar, {opacity:0.7}]}/>
                        :
                        null
                }
                <View style={{flex:1}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerNavBar: {
        height:Platform.OS === 'ios' ? 64 : 56,
        paddingTop:Platform.OS === 'ios' ? 20: 0,
        flexDirection:'row',
        backgroundColor:'#44c5fb',
        width:deviceWidth,
        justifyContent: 'space-between',
        alignItems:'center'
    },
    buttonNavBar:{
        marginLeft:7,
        height:23,
        width:23
    },
    titleNavBar:{
        color:'#fff',
        fontSize:17,
        fontFamily:'Roboto-Regular'
    },
    changeNavBar:{
        backgroundColor:'#2d3036',
        position:'absolute',
        top:0,
        left:0,
        height:Platform.OS === 'ios' ? 64 : 56,
        width:deviceWidth
    }
});

export default NavBar;