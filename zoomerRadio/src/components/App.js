import React from 'react-native';

import styles from '../styles';
import Stations from './Stations'
import Player from './Player'
import Background from './Background'

let {Navigator} = React;

export default React.createClass({
    render() {
        return (
            <Navigator
                initialRoute={{id: 'Stations', name: 'Stations'}}
                renderScene={this.renderScene}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    return Navigator.SceneConfigs.FloatFromRight;
                }} />
        );
    },

    renderScene(route, navigator) {
        switch(route.id) {
            case 'Stations':
                return (
                    <Stations navigator={navigator}/>
                );
                break;
            case 'Player':
                return (
                    <Player navigator={navigator} station={route.station}/>
                );
                break;
            default:
                break;
        }
    }
});
