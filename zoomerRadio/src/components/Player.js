import React from 'react-native';

import { AudioPlayer } from '../lib/AudioPlayer';

import Background from './Background';
import styles from '../styles';
import {screen_height, screen_width} from '../settings';

let {
    View,
    Animated,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
    Navigator
    } = React;

export default React.createClass({
    getInitialState() {
        return {
            status: 'STOPPED',
            bounceValue: new Animated.Value(0)
        };
    },

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener(
            'AudioBridgeEvent', (evt) => this.setState(evt)
        );
        AudioPlayer.getStatus((error, status) => {
            (error) ? console.log(error) : this.setState(status)
        });

        // Animate the Logo image
        this.state.bounceValue.setValue(0.05);    // Start small
        Animated.spring(                          // Base: spring, decay, timing
            this.state.bounceValue,                 // Animate `bounceValue`
            {
                toValue: 1,                           // Animate to original size
                tension: 70                           // Spring with default tension
            }
        ).start();
        this._play();
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

                <Background video={this.props.station.video}/>

                <View style={[styles.group, {'marginTop': 0.06*screen_height}]}>
                    <Image
                        style={[
                            styles.image,
                            {width: 0.9*screen_width, height: 0.25*screen_height}
                        ]}
                        source={{ uri: this.props.station.logo, isStatic: true }}
                    />
                </View>

                <View style={styles.group}>
                    <TouchableOpacity
                        onPress={() => this._play()}
                        onLongPress={() => this._play(true)}>
                        <Animated.Image
                            style={[
                                styles.image,
                                {width: 0.8*screen_width, height: 0.25*screen_height},
                                {transform: [{scale: this.state.bounceValue}]}
                            ]}
                            source={
                                this.state.status != 'PLAYING'
                                ? { uri: this.props.station.buttons.play, isStatic: true }
                                : { uri: this.props.station.buttons.pause, isStatic: true }
                            }
                        />
                    </TouchableOpacity>
                </View>

                <View style={[styles.group, {'marginBottom': 0.06*screen_height}]}>
                    <TouchableOpacity
                        onPress={() => this.props.navigator.pop()}>
                        <Image
                            style={[
                                styles.image,
                                {width: 0.85*screen_width, height: 0.055*screen_height}
                            ]}
                            source={require('image!label_back')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    },

    componentWillUnmount() {
        this.subscription.remove();
        this._stop();
    },

    _play(forced=false) {
        let stream_url = this.props.station.url;
        if (forced)
            AudioPlayer.play(stream_url);
        else {
            switch (this.state.status) {
                case 'PLAYING':
                    this.setState({
                        status: 'STOPPED'
                    });
                    AudioPlayer.stop();
                    break;
                case 'STOPPED':
                    this.setState({
                        status: 'BUFFERING'
                    });
                    AudioPlayer.play(stream_url);
                    break;
            }
        }
    },
    _stop() {
        this.setState({
            status: 'STOPPED'
        });
        AudioPlayer.stop();
    }
});
