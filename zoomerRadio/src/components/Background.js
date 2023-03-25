import React from 'react-native';
import Video from 'react-native-video';

import styles from '../styles';

let {
    AppState,
    } = React;

export default React.createClass({
    getInitialState() {
        return {
            rate: 1,
            muted: true,
            resizeMode: 'cover',
            repeat: true
        }
    },

    componentDidMount() {
        AppState.addEventListener('change', this._onAppStateChange);
    },

    componentWillUnmount() {
        AppState.removeEventListener('change', this._onAppStateChange);
    },

    render() {
        return (
            <Video source={{uri: this.props.video}}
                   style={[styles.background, this.props.style]}
                   rate={this.state.rate}
                   muted={this.state.muted}
                   resizeMode={this.state.resizeMode}
                   repeat={this.state.repeat}/>
        )
    },

    _onAppStateChange(currentAppState) {
        switch (currentAppState) {
            case 'active':
                this.setState({rate: 1});
                break;
            default:
                this.setState({rate: 0});
                break;
        }
    }
});
