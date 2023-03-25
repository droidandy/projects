import React from 'react-native';

import Background from './Background';
import styles from '../styles';
import {stations, screen_height, screen_width} from '../settings';

let {
    View,
    Animated,
    Image,
    TouchableOpacity,
    Navigator
    } = React;

export default React.createClass({
    getInitialState() {
        return {
            bounceValue: new Animated.Value(0)
        };
    },

    componentDidMount() {
        // Animate the Logo image
        this.state.bounceValue.setValue(0.05);    // Start small
        Animated.spring(                          // Base: spring, decay, timing
            this.state.bounceValue,                 // Animate `bounceValue`
            {
                toValue: 1,                           // Animate to original size
                tension: 70                           // Spring with default tension
            }
        ).start();
    },

    render() {
        return (
            <Navigator
                renderScene={this.renderScene}
                navigator={this.props.navigator}
            />
        );
    },

    renderScene(route, navigator) {
        return (
            <View style={styles.appContainer}>

                <Background video='background_video_general' style={{'left': -200}}/>

                <View style={styles.group}>
                    <Image
                        style={[styles.image, {width: 0.95*screen_width, height: 0.065*screen_height}]}
                        source={require('image!label_choose_station')}/>
                </View>

                <View style={styles.group}>
                    <TouchableOpacity
                        onPress={() => this.props.navigator.push({id: 'Player', station: stations.classical})}>
                        <Animated.Image
                            style={[
                                styles.image,
                                {width: 0.8*screen_width, height: 0.315*screen_height},
                                {transform: [{scale: this.state.bounceValue}]}
                            ]}
                            source={require('image!radio_classical_solid')}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigator.push({id: 'Player', station: stations.zoomer})}>
                        <Animated.Image
                            style={[
                            styles.image,
                                {width: 0.8*screen_width, height: 0.315*screen_height},
                                {transform: [{scale: this.state.bounceValue}]}
                            ]}
                            source={require('image!radio_zoomer_solid')}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.group}>
                    <Image style={[styles.image, {width: 0.95*screen_width, height: 0.065*screen_height}]}
                        source={require('image!label_tap_above')}/>
                </View>

            </View>
        );
    }
});