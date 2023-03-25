import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import { WebAddress } from '../../config';
import WebViewScreen from '../WebViewScreen';
import Intro from '../Intro';
import SplashScreen from '../SplashScreen';

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        loaded: false
    };

  }
  componentWillMount() {
    let that = this;
    setTimeout(function() {
        that.setState({loaded : true})
    }, 2000);
  }
  render() {
      console.log('Home', this.props);
    return (
        <View style={{ flex: 1 }}>

            {this.props.firstLaunch === false ?
                <Intro {...this.props} /> :
                <WebViewScreen URL={WebAddress.URL} />
            }
            <SplashScreen
                loaded={this.state.loaded}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
});

export default Home;
