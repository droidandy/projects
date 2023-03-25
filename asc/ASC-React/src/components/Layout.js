import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as utilityActions from '../redux/utility';
import {
    Page
} from 'react-onsenui';

import Profile from './Profile';
import DefaultRegisterPage from './DefaultRegisterPage';
import ContinueRegisterPage from './ContinueRegisterPage';
import NearMe from './NearMe';
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

import ToolbarMobile from './ToolbarMobile';

@connect((state) => ({ navigator: state.navigator, utility: state.utility }),
  (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...utilityActions}, dispatch) }))

class Layout extends React.Component {
  renderToolbar() {
    return (
      <ToolbarMobile />
    );
  }

  render() {
    let renderedComponent;
    switch (this.props.navigator.namePage) {
      case 'Store':
        renderedComponent = <ShopCatalog />;
        break;
      case 'LaunchPage':
        renderedComponent = <LaunchPage />;
        break;
      case 'Profile':
        renderedComponent = <Profile />;
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
      case 'Shopping Cart':
        renderedComponent = <ShoppingCart />;
        break;
      case 'ShopItem':
        renderedComponent = <ShopItem />;
        break;
      default:
        renderedComponent = <div>{this.props.navigator.namePage}</div>;
    }

    return (
      <Page renderToolbar={() => this.renderToolbar()}>
        {renderedComponent}
      </Page>
    );
  }
}

export default Layout;
