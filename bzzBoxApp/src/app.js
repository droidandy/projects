import React, { Component } from 'react';
import {
    Navigator,
    View,
    Dimensions,
    Animated,
    StyleSheet,
    Image,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import LoadingSpinner from './components/LoadingSpinner';


import DashboardPage from './containers/DashboardPage';
import RegisterPage from './containers/RegisterPage';

const splashStyle = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#44c5fb'
  }
});

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class SplashScreen extends Component {

  state = {
    opacity: new Animated.Value(1),
    hidden: false
  };

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 500,
      delay: 2000
    }).start(() => this.setState({ hidden: true }));
  }

  render() {
    const bg = require('./resources/splash.png');
    return (
      <Animated.View
        style={[splashStyle.absoluteContainer,
          splashStyle.centeredContent,
          { opacity: this.state.opacity }]}
        pointerEvents={this.state.hidden ? 'none' : 'auto'}
      >
        <Image
          style={{ width: deviceWidth, height: deviceHeight }}
          source={bg}
          resizeMode="cover"
        />
      </Animated.View>
    );
  }
}

@connect(state => ({ ...state }), dispatch => bindActionCreators({}, dispatch))

class App extends Component {
  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.disableTimeOut = this.disableTimeOut.bind(this);

    this.state = {
      firstView: 'DashboardPage',
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  renderScene(route, navigator) {
    switch (route.name) {
      case 'DashboardPage':
        return <DashboardPage {...route} navigator={navigator} />;
      case 'RegisterPage':
        return <RegisterPage {...route} navigator={navigator} />;
      default:
        return (
          <View style={{ flex: 1 }}>
            default
          </View>
        );
    }
  }
  disableTimeOut() {
    this.setState({ timeOut: true });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={splashStyle.absoluteContainer}>
          <Navigator
            initialRoute={{ name: this.state.firstView }}
            renderScene={this.renderScene}
            onDidFocus={() => this.disableTimeOut()}
            configureScene={() => ({
              ...Navigator.SceneConfigs.FloatFromLeft,
              ...Navigator.SceneConfigs.FloatFromRight,
              springTension: 100,
              springFriction: 1,
              gestures: {}
            })}
          />
        </View>
        <SplashScreen />
      </View>
    );
  }
}

export default App;
