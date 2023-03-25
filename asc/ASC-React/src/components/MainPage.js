import React from 'react';

import {
    Page,
    SplitterSide,
    Splitter,
    SplitterContent,
    List
} from 'react-onsenui';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as authActions from '../redux/auth/authActions';
import * as utilityActions from '../redux/utility';
import * as conversationsActions from '../redux/conversations';
import * as selectedConversationActions from '../redux/selectedConversation';

import Demension from '../constants';
import staticImage from '../staticImages';
import listConversation from '../data/dataConversation';

import SplitterButton from './Button';
import ItemWithIcon from './ItemWithIcon';

// import Layout from './Layout';
import UITabletPage from './UITabletPage';
import UIDesktopPage from './UIDesktopPage';
import UIMobilePage from './UIMobilePage';

import NearMeModal from './NearMeModal';
import hockeyAppUtils from '../utils/hockeyAppUtils';
import commonUtils from '../utils/commonUtils';

const bannerImages = [staticImage.kitesufr, staticImage.motocross, staticImage.mtnbike, staticImage.skate, staticImage.snowboard, staticImage.surf];
// const pages = ['Home', 'About', 'Store', 'Contact'];
const namesPageWithBackButton = ['Profile', 'User profile', 'ALERTS', 'Help', 'Contact', 'Store', 'ShopItem', 'Shopping Cart', 'About', 'Register', 'Terms', 'LOGIN', 'Forgot password', 'Conversation'];

@connect((state) => ({ ...state }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...authActions, ...utilityActions, ...conversationsActions, ...selectedConversationActions}, dispatch) }))

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.goTOTab = this.goTOTab.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      pages: [
        'Home',
        'About',
        'Store',
        'Contact'
      ]
    };
  }
  randomGenerator(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
  componentWillMount() {
    let self = this;
    window.addEventListener('popstate', (event) => {
      console.log('popstate', event.state);
      if (self.props.navigator.previousNamePage === 'NEAR ME') {
        console.log(1);
        self.props.actions.setHistoryState(event.state);
        self.props.actions.setNavMap(true);
        self.props.actions.setNavSwipeablePanel(false);
        self.props.actions.changeToolbarType('main');
        // self.props.actions.setNavMap(self.props.navigator.previousOpenMap);
      } else self.props.actions.setHistoryState(event.state);
      // self.props.actions.setNavMapPrev(self.props.navigator.openMap);
      self.updateDimensions();
    }, false);
    document.addEventListener('deviceready', (event) => {
      console.log('onDeviceReady--> MainPage');
      self.props.actions.pushPage(true, 'LaunchPage');
      self.props.actions.changeToolbarType('launch');
      // self.props.actions.setSwipeablePanel(false);
      self.props.actions.setNavSwipeablePanel(false);

      document.addEventListener('backbutton', () => {
        console.log('backbutton pressed');
        let loadData = window.history.state;
        loadData.isLogin = this.props.auth.isLogin;
        window.localStorage.setItem('loadData', JSON.stringify(loadData));
        window.localStorage.setItem('shouldLoad', true);
        console.log('window.localStorage', window.localStorage);
      }, false);

      setTimeout((event) => {
        window.history.replaceState(self.props.navigator, self.props.navigator.namePage, '#' + self.props.navigator.namePage);
        console.log('window.history.replaceState');
        let loadCheck = window.localStorage.shouldLoad === 'true';
        if (loadCheck) {
          let loadData = JSON.parse(window.localStorage.loadData);
          console.log('loadData before: ', loadData);
          this.props.actions.setHistoryState(loadData);
          // switchAuth is deprecated
          // this.props.actions.switchAuth(loadData.isLogin);
          window.localStorage.setItem('shouldLoad', false);
          console.log('after: ', window.localStorage.loadData);
          console.log('DEVICE LOAD');
        }
      }, 50);
    }, false);
    this.props.actions.setBackgroundImage(bannerImages[this.randomGenerator(0, 5)]);
    this.props.actions.setPlatform(commonUtils.detectDevice());
    listConversation.forEach((data) => this.props.actions.addConversation(data));
  }
  componentDidMount() {
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
    this.props.actions.setResolution(width, height, width <= Demension.TABLET_WIDTH);

    if (width > Demension.TABLET_WIDTH && this.props.navigator.toolbarType === 'back' && namesPageWithBackButton.indexOf(this.props.navigator.namePage) > -1) {
      this.props.actions.changeToolbarType('main');
    }
    if (width <= Demension.TABLET_WIDTH && this.props.navigator.toolbarType === 'main' && namesPageWithBackButton.indexOf(this.props.navigator.namePage) > -1) {
      this.props.actions.changeToolbarType('back');
    }
  }
  goTOTab(index) {
    if (index === 0) {
      this.props.actions.pushPage(false, 'HOME');
    }
    if (index === 1) {
      this.props.actions.pushPage(true, 'About');
    }
    if (index === 2) {
      this.props.actions.pushPage(true, 'Store');
    }
    if (index === 3) {
      this.props.actions.pushPage(true, 'Contact');
    }
  }

  render() {
    let renderedModal = null;
    switch (this.props.navigator.nameModal) {
      case 'NearMeModal':
        renderedModal = <NearMeModal />;
        break;
      default:
        renderedModal = null;
    }
    // console.log('PROPS ', this.props);
    return (
      //   this.props.navigator.showPage && this.props.utility.isMobile ? <Layout />
      //  :
       <Splitter>
            <SplitterSide
                style={{boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'}}
                side='left'
                width={230}
                collapse={true}
                isSwipeable={ this.props.navigator.isSwipeable }
                // isSwipeable={ this.props.panel.isSwipeable }
                // isSwipeable={ this.props.navigator.isSwipeable && !this.props.navigator.showPage}
                isOpen={this.props.panel.isOpen}
                onClose={this.props.actions.closePanel}
                onOpen={this.props.actions.openPanel} >
                <Page>
                    <div className='panel__page__close' onClick={this.props.actions.closePanel} >CLOSE</div>
                    <List
                        className='panel__list'
                        dataSource={this.state.pages}
                        renderRow={(title, index) => (<div key={title} onClick={() => {
                          this.props.actions.closePanel();
                          this.props.actions.setMap(false);
                          this.props.actions.setNavMap(false);
                          this.props.actions.setNavSwipeablePanel(true);
                          this.goTOTab(index);
                          if (index !== 0 && this.props.utility.isMobile) {
                            this.props.actions.changeToolbarType('back');
                          }
                        } } className='panel__listItem'>{title}</div>)} />
                    {
                        !this.props.auth.isLogin ? <div>
                            <SplitterButton style={{fontSize: '15px', lineHeight: '30px', margin: '10px', background: '#8f1922', border: 'none'}}
                                            text='SIGN UP'
                                            onClick={() => {
                                              console.log('Button click SIGN UP');
                                              this.props.actions.closePanel();
                                              this.props.actions.pushPage(true, 'Register');
                                              if (this.props.navigator.previousNamePage !== 'NEAR ME') {
                                                this.props.actions.setNavSwipeablePanel(true);
                                              }
                                              this.props.actions.setMap(false);
                                              this.props.actions.setNavMap(false);
                                              if (this.props.utility.isMobile) {
                                                this.props.actions.changeToolbarType('back');
                                              }
                                            } } />
                            <SplitterButton style={{fontSize: '15px', lineHeight: '30px', margin: '10px', background: 'initial', borderColor: '#fff', borderStyle: 'solid', borderWidth: '1px'}}
                                            text='LOG IN'
                                            onClick={() => {
                                              this.props.actions.closePanel();
                                              this.props.actions.pushPage(true, 'LOGIN');
                                              if (this.props.navigator.previousNamePage !== 'NEAR ME') {
                                                this.props.actions.setNavSwipeablePanel(true);
                                              }
                                              this.props.actions.setMap(false);
                                              this.props.actions.setNavMap(false);
                                              if (this.props.utility.isMobile) {
                                                this.props.actions.changeToolbarType('back');
                                              }
                                            }} />
                            <SplitterButton style={{fontSize: '15px', lineHeight: '30px', margin: '10px', background: 'initial', borderColor: '#fff', borderStyle: 'solid', borderWidth: '1px'}}
                                            text='ForceCrash'
                                            onClick={() => { hockeyAppUtils.hockeyAppForceCrash(); } } />
                            </div>
                         : null
                    }
                    {
                        this.props.auth.isLogin ? <div><div style={{margin: 15, color: '#989898', backgroundColor: '#989898', height: '2px'}} > </div>
                          <div style={{margin: 0, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}} >
                            <ItemWithIcon title='HOME'
                            icon={'md-view-quilt'}
                            onPress={() => {
                              this.props.actions.closePanel();
                              this.props.actions.setMap(false);
                              this.props.actions.setNavMap(false);
                              this.props.actions.setNavSwipeablePanel(true);
                              this.props.actions.pushPage(false, 'HOME');
                            } } />
                            <ItemWithIcon title='NEAR ME'
                            icon={'ion-android-map'}
                            onPress={() => {
                              this.props.actions.closePanel();
                              this.props.actions.setMap(true);
                              this.props.actions.setNavMap(true);
                              this.props.actions.setNavSwipeablePanel(false);
                              this.props.actions.pushPage(false, 'NEAR ME');
                            } } />
                            <ItemWithIcon title='EVENTS'
                            icon={'ion-android-calendar'}
                            onPress={() => {
                              this.props.actions.closePanel();
                              this.props.actions.setMap(false);
                              this.props.actions.setNavMap(false);
                              this.props.actions.setNavSwipeablePanel(true);
                              this.props.actions.pushPage(false, 'EVENTS');
                            } } />
                            <ItemWithIcon title='GROUPS'
                            icon={'ion-android-people'}
                            onPress={() => {
                              this.props.actions.closePanel();
                              this.props.actions.setMap(false);
                              this.props.actions.setNavMap(false);
                              this.props.actions.setNavSwipeablePanel(true);
                              this.props.actions.pushPage(false, 'GROUPS');
                            } } />
                          </div>
                          <div style={{margin: 0, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}} >
                            <ItemWithIcon title='INBOX'
                            icon={'md-inbox'}
                            onPress={() => {
                              this.props.actions.closePanel();
                              this.props.actions.setMap(false);
                              this.props.actions.setNavMap(false);
                              this.props.actions.setNavSwipeablePanel(true);
                              this.props.actions.pushPage(false, 'INBOX');
                            } } />
                            <ItemWithIcon title='PROFILE'
                            icon={'ion-person'}
                            onPress={() => {
                              this.props.actions.closePanel();
                              this.props.actions.pushPage(true, 'Profile');
                              this.props.actions.setMap(false);
                              this.props.actions.setNavMap(false);
                              this.props.actions.setNavSwipeablePanel(true);
                              if (this.props.utility.isMobile) {
                                this.props.actions.changeToolbarType('back');
                              }
                            } } />
                            <ItemWithIcon title='ALERTS'
                            icon={'md-notifications'}
                            onPress={() => {
                              this.props.actions.closePanel();
                              this.props.actions.pushPage(true, 'ALERTS');
                              this.props.actions.setMap(false);
                              this.props.actions.setNavMap(false);
                              this.props.actions.setNavSwipeablePanel(true);
                              if (this.props.utility.isMobile) {
                                this.props.actions.changeToolbarType('back');
                              }
                            } } />
                            <ItemWithIcon title='HELP'
                            icon={'md-help-outline'}
                            onPress={() => {
                              this.props.actions.closePanel();
                              this.props.actions.pushPage(true, 'Help');
                              this.props.actions.setMap(false);
                              this.props.actions.setNavMap(false);
                              this.props.actions.setNavSwipeablePanel(true);
                              if (this.props.utility.isMobile) {
                                this.props.actions.changeToolbarType('back');
                              }
                            } } />
                          </div>
                           <SplitterButton style={{fontSize: '15px', lineHeight: '30px', margin: '10px', background: 'initial', borderColor: '#fff', borderStyle: 'solid', borderWidth: '1px'}}
                                           text='LOG OUT'
                                           onClick={() => {
                                             this.props.actions.closePanel();
                                             this.props.actions.pushPage(false, 'HOME');
                                             this.props.actions.setMap(false);
                                             this.props.actions.setNavMap(false);
                                             this.props.actions.logOut();
                                           } } />
                       </div>
                        : null
                    }
                </Page>
            </SplitterSide>
            <SplitterContent>

              {renderedModal}

              {
                this.props.utility.width > 0 && this.props.utility.width <= Demension.TABLET_WIDTH ? <UIMobilePage navigator={this.props.navigator} />
                  : this.props.utility.width > Demension.TABLET_WIDTH && this.props.utility.width < Demension.DESKTOP_WIDTH
                  ? <UITabletPage navigator={this.props.navigator} />
                  : <UIDesktopPage navigator={this.props.navigator} />
              }
            </SplitterContent>
        </Splitter>
    );
  }
}
export default MainPage;
