import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import {
    Navigator
} from 'react-onsenui';
import MainPage from './MainPage';
import hockeyAppUtils from '../utils/hockeyAppUtils';

var config = require('../config');

@connect((state) => ({ ...state }), (dispatch) => ({ actions: bindActionCreators({...navigatorActions}, dispatch) }))

class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
    this.onDeviceReady = this.onDeviceReady.bind(this);
    this.state = { };
  }
  onBackKeyDown(event) {
    console.log('click back button', event);
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.history.back();
  }

  onDeviceReady() {
    console.log('onDeviceReady--> App');
    hockeyAppUtils.hockeyAppInit(config.HOCKEY_APPID).then(result => {
      console.log('hockeyAppInit: ' + result);
    }, error => {
      console.log('hockeyAppInit: ' + error);
    });
    document.addEventListener('backbutton', this.onBackKeyDown, false);
  }
  componentWillMount() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  }
  renderPage(route, navigator) {
    const props = route.props || {};
    props.navOns = navigator;

    return React.createElement(route.component, props);
    // return <route.component key={route.key} navigator={navigator} />;
  }
  render() {
    return (
        <Navigator
            renderPage={this.renderPage}
            initialRoute={{component: MainPage, props: {key: 'MainPage'}}}
            animationOptions= {{duration: 0.2, delay: 0.4, timing: 'ease-in'}}
            />
    );
  }
}
export default App;
