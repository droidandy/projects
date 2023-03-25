import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as utilityActions from '../redux/utility';
import * as panelActions from '../redux/panel';
import {
  Page,
  Tabbar,
  Tab
} from 'react-onsenui';

// import Home from './Home';
import MyTab from './MyTab';
import NearMe from './NearMe';
import InboxMobileTablet from './InboxMobileTablet';

import Profile from './Profile';
import UserProfile from './UserProfile';
import DefaultRegisterPage from './DefaultRegisterPage';
import ContinueRegisterPage from './ContinueRegisterPage';
// import NearMe from './NearMe';
import Login from '../containers/Login';
import Notifications from './Notifications';
import About from './About';
import Terms from './Terms';
import Contact from './Contact';
import LaunchPage from './LaunchPage';
import ShoppingCart from './ShoppingCart';
import ShopItem from './ShopItem';
import ConversationMobileTablet from './ConversationMobileTablet';
import ShopCatalog from './ShopCatalog';
import Help from './Help';

import { TabbarList } from '../constants';

import ToolbarMobile from './ToolbarMobile';

@connect((state) => ({ navigator: state.navigator, utility: state.utility }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...utilityActions, ...panelActions}, dispatch) }))

class BottomTabbar extends React.Component {
  constructor(props) {
    super(props);
    this.renderTabs = this.renderTabs.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.state = {
    };
  }

  renderToolbar() {
    return (
      <ToolbarMobile />
    );
  }

  renderTabs() {
    let Home = this.props.homeComponent;
    return [
      {
        content: this.props.utility.isMobile
                  ? <Home key='HOME_key' title='HOME' navigator={this.props.navigator} />
                  : <Page key='HOME_tablet_key'>
                      <Home title='HOME'/>
                    </Page>,
        tab: <Tab key='HOME_tab' label='HOME' icon='md-view-quilt'/>
      },
      {
        content: <NearMe key='NEAR_ME_key' title='NEAR ME' navigator={this.props.navigator} />,
        tab: <Tab key='NEAR_ME_tab' label='NEAR ME' icon='ion-android-map' />
      },
      {
        content: <MyTab key='EVENTS_key' title='EVENTS' navigator={this.props.navigator} />,
        tab: <Tab key='EVENTS_tab' label='EVENTS' icon='ion-android-calendar' />
      },
      {
        content: <MyTab key='GROUPS_key' title='GROUPS' navigator={this.props.navigator} />,
        tab: <Tab key='GROUPS_tab' label='GROUPS' icon='ion-android-people' />
      },
      {
        content: <InboxMobileTablet key='INBOX_key' title='INBOX' navigator={this.props.navigator} />,
        tab: <Tab key='INBOX_tab' label='INBOX' icon='md-inbox' />
      }
    ];
  }
  render() {
    let renderedComponent;
    switch (this.props.navigator.namePage) {
      // case 'HOME':
      //   renderedComponent = <Home />;
      //   break;
      case 'Help':
        renderedComponent = <Help />;
        break;
      case 'Store':
        renderedComponent = <ShopCatalog />;
        break;
      case 'LaunchPage':
        renderedComponent = <LaunchPage />;
        break;
      case 'Profile':
        renderedComponent = <Profile />;
        break;
      case 'User profile':
        renderedComponent = <UserProfile />;
        break;
      case 'Register':
        renderedComponent = <DefaultRegisterPage />;
        break;
      case 'ContinueRegister':
        renderedComponent = <ContinueRegisterPage />;
        break;
      case 'NEAR ME':
        renderedComponent = <NearMe />;
        break;
      case 'ALERTS':
        renderedComponent = <Notifications />;
        break;
      case 'LOGIN':
        renderedComponent = <Login />;
        break;
      case 'About':
        renderedComponent = <About />;
        break;
      case 'Terms':
        renderedComponent = <Terms />;
        break;
      case 'Contact':
        renderedComponent = <Contact />;
        break;
      case 'Conversation':
        renderedComponent = <ConversationMobileTablet />;
        break;
      case 'ShoppingCart':
        renderedComponent = <ShoppingCart />;
        break;
      case 'ShopItem':
        renderedComponent = <ShopItem />;
        break;
      default:
        renderedComponent = <div>{this.props.navigator.namePage}</div>;
    }

    let tabbarIdx = TabbarList.indexOf(this.props.navigator.namePage);
    // tabbarIdx = (tabbarIdx === -1) ? 0 : tabbarIdx;
    console.log('tabbarIdx: ', tabbarIdx);
    return (
      tabbarIdx > -1
      ? <Tabbar
          index={tabbarIdx}
          animation='none'
          animationOptions={{duration: 0.2, delay: 0.4, timing: 'ease-in'}}
          position='bottom'
          onPreChange={(event) => {
            if (event.index !== TabbarList.indexOf(this.props.navigator.namePage)) {
              if (event.index === 1) {
                this.props.actions.setMap(true);
                this.props.actions.setNavMap(true);
                // this.props.actions.setSwipeablePanel(false);
                this.props.actions.setNavSwipeablePanel(false);
              } else {
                this.props.actions.setMap(false);
                this.props.actions.setNavMap(false);
                // this.props.actions.setSwipeablePanel(true);
                this.props.actions.setNavSwipeablePanel(true);
              }
              this.props.actions.pushPage(false, event.tabItem.getAttribute('label'));
            }
          }}
          renderTabs={this.renderTabs} />
      : <Page renderToolbar={() => this.renderToolbar()}>
          {renderedComponent}
        </Page>
    );
  }
}
export default BottomTabbar;
