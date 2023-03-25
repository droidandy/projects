import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as utilityActions from '../redux/utility';
import * as panelActions from '../redux/panel';
import {
  Page,
  Modal
} from 'react-onsenui';
// import { TabbarList } from '../constants';

import Home from './Home';
import Profile from './Profile';
import UserProfile from './UserProfile';
import DefaultRegisterPage from './DefaultRegisterPage';
import ContinueRegisterPage from './ContinueRegisterPage';
import NearMe from './NearMe';
import Login from '../containers/Login';
import ForgotPassword from './ForgotPassword';
import LaunchPage from './LaunchPage';
import Notifications from './Notifications';
import About from './About';
import Terms from './Terms';
import Contact from './Contact';
import ShoppingCart from './ShoppingCart';
import ShopItem from './ShopItem';
import ConversationMobileTablet from './ConversationMobileTablet';
import ShopCatalog from './ShopCatalog';
import Help from './Help';

import BottomTabbar from './BottomTabbar';
import SplitterButton from './Button';
import ToolbarMobile from './ToolbarMobile';

@connect((state) => ({ navigator: state.navigator, auth: state.auth }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...utilityActions, ...panelActions}, dispatch) }))

class UIMobilePage extends React.Component {
  constructor(props) {
    super(props);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.state = {
      isOpenModel: false
    };
  }

  renderToolbar() {
    return (
      this.props.navigator.namePage === 'HOME'
      ? null
      : <ToolbarMobile />
    );
  }

  render() {
    let renderedComponent;
    switch (this.props.navigator.namePage) {
      case 'HOME':
        renderedComponent = <Home />;
        break;
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
      case 'Forgot password':
        renderedComponent = <ForgotPassword />;
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
    return (
        <Page renderModal={() => (
              <Modal isOpen={this.state.isOpenModel} animationOptions={{duration: 2.2, delay: 0.4, timing: 'ease-in'}}>
                <section style={{margin: '16px'}}>
                    <SplitterButton style={{fontSize: '15px', lineHeight: '30px', margin: '10px', background: '#8f1922', border: 'none'}}
                    text='Close'
                    onClick={() => { this.setState({isOpenModel: false}); } } />
                </section>
              </Modal>)} >
              { this.props.auth.isLogin
                ? <BottomTabbar homeComponent={Home} />
                : <Page renderToolbar={() => this.renderToolbar()}>
                    {renderedComponent}
                  </Page>
                // : <Home />
              }
        </Page>
    );
  }
}
export default UIMobilePage;
