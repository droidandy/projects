import React, { Component } from 'react';
import {
  WebView,
  View,
  Platform,
  BackAndroid
} from 'react-native';

// import NavBar from './NavBar';
// import IconNavbar from './IconNavbar';
// import Spinner from 'react-native-loading-spinner-overlay';
import LoadingSpinner from './LoadingSpinner';
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
    console.log('WEBVIEW_REF: ', navState);
    this.setState({
      // backButtonEnabled: this.props.URL === navState.url ? false : true,
      // forwardButtonEnabled: this.props.URL === navState.url ? false : true,
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      externalDomain: navState.url.indexOf(this.props.URL) !== -1 ? false : true
    });
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
    console.log('WEBVIEW_REF: ', this.state.externalDomain);
    return (
      <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 20 : 0 }}>

        {/*{*/}
          {/*// Platform.OS === 'ios' && (backButtonEnabled || forwardButtonEnabled) && !this.state.externalDomain &&*/}
        {/*<NavBar*/}
          {/*left={backButtonEnabled ? <IconNavbar icon="back" /> : null}*/}
          {/*onLeftClick={() => this.goBack()}*/}
          {/*center={'DVGAutomotive'}*/}
          {/*right={forwardButtonEnabled ? <IconNavbar icon="forward" /> : null}*/}
          {/*onRightClick={() => this.goForward()}*/}
        {/*/>}*/}
        <WebView
          ref={WEBVIEW_REF}
          source={{ uri: URL }}
          onNavigationStateChange={this.onNavigationStateChange}
          onLoadEnd={() => { this.onLoadEnd(); }}
        />
          {!this.state.webViewLoaded && <LoadingSpinner visible={!this.state.webviewLoaded} /> }
          {/*{!this.state.webViewLoaded && <Spinner visible={!this.state.webviewLoaded} /> }*/}
      </View>
    );
  }
}
