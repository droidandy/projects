import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as utilityActions from '../redux/utility';
import {
  Page
} from 'react-onsenui';

import ToolbarTablet from './ToolbarTablet';
import BottomTabbar from './BottomTabbar';

import HomeTablet from './HomeTablet';
import NearMe from './NearMe';
import Profile from './Profile';
import UserProfile from './UserProfile';
import Login from '../containers/Login';
import ForgotPassword from './ForgotPassword';
import Notifications from './Notifications';
import DefaultRegisterPage from './DefaultRegisterPage';
import About from './About';
import Terms from './Terms';
import Contact from './Contact';
import InboxMobileTablet from './InboxMobileTablet';
import ConversationMobileTablet from './ConversationMobileTablet';
import ContinueRegisterPage from './ContinueRegisterPage';
import LaunchPage from './LaunchPage';
import Help from './Help';

import { TabbarList } from '../constants';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...utilityActions}, dispatch) }))

class UITabletPage extends React.Component {
  constructor(props) {
    super(props);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.state = {
      width: null,
      height: null
    };
    setTimeout(() => {

    }, 100);
  }

  renderToolbar() {
    return (<ToolbarTablet />);
  }

  renderPage() {
    switch (this.props.navigator.namePage) {
      case 'HOME':
        return (<HomeTablet />);
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
        return (<InboxMobileTablet />);
      case 'Conversation':
        return (<ConversationMobileTablet />);
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
        { !this.props.auth.isLogin
            ? this.renderPage()
            : TabbarList.indexOf(this.props.navigator.namePage) === -1
              ? this.renderPage()
              : <BottomTabbar homeComponent={HomeTablet} />
        }
      </Page>
    );
  }
}
export default UITabletPage;
