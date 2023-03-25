import React, { Component } from 'react';
import {
  WebView,
  View,
  Platform,
  BackAndroid
} from 'react-native';

import SplashScreen from './SplashScreen';
import NavBar from './components/NavBar';
import IconNavbar from './components/IconNavbar';

const WEBVIEW_REF = 'webview';

export default class WebViewScreen extends Component {

  static propTypes = {
    URL: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      webviewLoaded: false,
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      externalDomain: null
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', () => {
        const { backButtonEnabled } = this.state;
        if (backButtonEnabled) {
          this.goBack();
          return true; // do not exit app
        }
        return false; // exit app
      });
    }
  }

  onLoadEnd() {
    this.setState({ webviewLoaded: true });
  }

  onNavigationStateChange = (navState) => {
    console.log('WEBVIEW_REF: ', navState.url);
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      externalDomain: navState.url.indexOf(this.props.URL) !== -1 ? false : true
    });
    // if (navState.url.indexOf('www.netagenda.de') === -1) {
    //  return true;
    // }else{
    //  this.refs[WEBVIEW_REF].stopLoading();
    //  return false;
    // }
  };

  goForward = () => {
    const { forwardButtonEnabled } = this.state;
    if (forwardButtonEnabled) {
      this.refs[WEBVIEW_REF].goForward();
    }
  };

  goBack = () => {
    const { backButtonEnabled } = this.state;
    if (backButtonEnabled) {
      this.refs[WEBVIEW_REF].goBack();
    }
  };

  render() {
    const { URL } = this.props;
    const { backButtonEnabled, forwardButtonEnabled } = this.state;
    // console.log('WEBVIEW_REF: ', this.state.externalDomain);
    return (
      <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 20 : 0 }}>
        {Platform.OS === 'ios' && (backButtonEnabled || forwardButtonEnabled) && this.state.externalDomain &&
        <NavBar
          left={backButtonEnabled && <IconNavbar icon="back" />}
          onLeftClick={() => this.goBack()}
          right={forwardButtonEnabled && <IconNavbar icon="forward" />}
          onRightClick={() => this.goForward()}
        />}
        <WebView
          ref={WEBVIEW_REF}
          source={{ uri: URL }}
          onNavigationStateChange={this.onNavigationStateChange}
          onLoadEnd={() => { this.onLoadEnd(); }}
        />
        <SplashScreen
          loaded={this.state.webviewLoaded}
        />
      </View>
    );
  }
}
