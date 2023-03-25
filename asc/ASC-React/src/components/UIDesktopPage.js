import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as utilityActions from '../redux/utility';
import {
  Page
} from 'react-onsenui';

import ToolbarDesktop from './ToolbarDesktop';

import NearMe from './NearMe';
import Profile from './Profile';
import UserProfile from './UserProfile';
import Login from '../containers/Login';
import ForgotPassword from './ForgotPassword';
import HomeDesktop from './HomeDesktop';
import Notifications from './Notifications';
import DefaultRegisterPage from './DefaultRegisterPage';
import About from './About';
import Terms from './Terms';
import Contact from './Contact';
import InboxDesktop from './InboxDesktop';
import ConversationDesktop from './ConversationDesktop';
import ContinueRegisterPage from './ContinueRegisterPage';
import LaunchPage from './LaunchPage';
import Help from './Help';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...utilityActions}, dispatch) }))

class UIDesktopPage extends React.Component {
  constructor(props) {
    super(props);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      width: null,
      height: null
    };
    setTimeout(() => {

    }, 100);
  }
  scrollToTop() {
    document.getElementById('topot').scrollIntoView();
  }
  componentDidMount() {
    setTimeout(() => {

    }, 100);
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    let w = window;
    let d = document;
    let documentElement = d.documentElement;
    let body = d.getElementsByTagName('body')[0];
    let width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    let height = w.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({width, height});
  }

  renderToolbar() {
    return (<ToolbarDesktop />);
  }
  renderPage() {
    switch (this.props.navigator.namePage) {
      case 'HOME':
        return (<HomeDesktop />);
      case 'Help':
        return (<Help />);
      case 'NEAR ME':
        return (
          <NearMe key='NEAR_ME_key' title='NEAR ME' navigator={this.props.navigator} />
        );
      case 'ALERTS':
        return (
          <Notifications key='ALERTS_key' title='ALERTS' navigator={this.props.navigator} />
        );
      case 'LaunchPage':
        return (<LaunchPage />);
      case 'Profile':
        return (<Profile />);
      case 'User profile':
        return (<UserProfile />);
      case 'LOGIN':
        return (<Login />);
      case 'Forgot password':
        return (<ForgotPassword />);
      case 'Register':
        return (<DefaultRegisterPage />);
      case 'About':
        return (<About />);
      case 'Terms':
        return (<Terms />);
      case 'Contact':
        return (<Contact />);
      case 'INBOX':
        return (<InboxDesktop />);
      case 'Conversation':
        return (<ConversationDesktop />);
      case 'ContinueRegister':
        return (<ContinueRegisterPage />);
      default:
        return (
          <div>
            default page {this.props.navigator.namePage}
          </div>
        );
    }
  }

  render() {
    return (
      <Page renderToolbar={this.renderToolbar}>
        {this.renderPage()}
      </Page>
    );
  }
}
export default UIDesktopPage;
