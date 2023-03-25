import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as authActions from '../redux/auth/authActions';
import * as utilityActions from '../redux/utility';
import {
  Toolbar,
  Icon,
  Dialog,
  BackButton,
  ToolbarButton
} from 'react-onsenui';

import commonUtils from '../utils/commonUtils';

import staticImage from '../staticImages';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, utility: state.utility, conversations: state.conversations, selectedConversation: state.selectedConversation }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...authActions, ...utilityActions}, dispatch) }))

class CustomToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    switch (this.props.navigator.toolbarType) {
      case 'main':
        return (
          <Toolbar className={`navbar-toolbar__langingPage__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
            <div className='left langingPage__style'>
              <ToolbarButton onClick={this.props.actions.openPanel} >
                <Icon className='navbar__toolbarbutton' icon='ion-navicon, material:md-menu'></Icon>
              </ToolbarButton>
            </div>
            <div className='center navbar__centerLogo'>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                <img src={staticImage.navBarLogo} height='33' />
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', alignItems: 'flex-start', marginLeft: '7px', lineHeight: '16px', fontWeight: 600 }}>
                    <div>ACTION SPORTS</div>
                    <div>COMMUNITY</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='right langingPage__style'>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                {
                  this.props.auth.isLogin
                  ? <div style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', fontSize: '14px', lineHeight: '20px', fontWeight: 600}} >
                      <div style={{marginLeft: '7px', cursor: 'pointer'}} onClick={() => { console.log('LOG OUT'); this.props.actions.logOut(); this.props.actions.pushPage(false, 'HOME'); }}>LOG OUT </div>
                      <Dialog
                        isOpen={!!this.state.isOpenDialogUnderConstruction}
                        isCancelable={false}
                        onCancel={() => { this.setState({isOpenDialogUnderConstruction: false}); }}>
                        <div>
                          <div
                            style={{color: commonUtils.isAndroid() ? '#fff' : null}}
                            className='alert-dialog-content' >
                              Cart page has not yet been implemented
                          </div>
                          <div className='alert-dialog-footer'>
                              <button onClick={() => { this.setState({isOpenDialogUnderConstruction: false}); }} className='alert-dialog-button'>
                                  OK
                              </button>
                          </div>
                        </div>
                      </Dialog>
                      <ToolbarButton onClick={() => {
                        this.setState({isOpenDialogUnderConstruction: true});
                        // this.props.actions.changeToolbarType('back');
                        // this.props.actions.pushPage(true, 'ShoppingCart');
                      }}>
                        <Icon className='navbar__toolbarbutton' icon='md-shopping-cart, material:md-shopping-cart'></Icon>
                      </ToolbarButton>
                    </div>
                  : <div style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', fontSize: '14px', lineHeight: '20px', fontWeight: 600}} >
                      <div style={{marginLeft: '7px', cursor: 'pointer'}} onClick={() => { console.log('SIGN UP'); this.props.actions.pushPage(true, 'Register'); }}>SIGN UP </div>
                      <div style={{marginLeft: '7px', width: '2px', height: '14px', backgroundColor: '#ccc'}}></div>
                      <div style={{marginLeft: '7px', cursor: 'pointer'}} onClick={() => {
                        console.log('LOG IN');
                        this.props.actions.pushPage(true, 'LOGIN');
                        if (this.props.utility.isMobile) {
                          this.props.actions.changeToolbarType('back');
                        }
                      }}>LOG IN </div>
                      <Dialog
                        isOpen={!!this.state.isOpenDialogUnderConstruction}
                        isCancelable={false}
                        onCancel={() => { this.setState({isOpenDialogUnderConstruction: false}); }}>
                        <div>
                          <div
                            style={{color: commonUtils.isAndroid() ? '#fff' : null}}
                            className='alert-dialog-content' >
                              Cart page has not yet been implemented
                          </div>
                          <div className='alert-dialog-footer'>
                              <button onClick={() => { this.setState({isOpenDialogUnderConstruction: false}); }} className='alert-dialog-button'>
                                  OK
                              </button>
                          </div>
                        </div>
                      </Dialog>
                      <ToolbarButton onClick={() => {
                        this.setState({isOpenDialogUnderConstruction: true});
                        // this.props.actions.changeToolbarType('back');
                        // this.props.actions.pushPage(true, 'ShoppingCart');
                      }}>
                        <Icon className='navbar__toolbarbutton' icon='md-shopping-cart, material:md-shopping-cart'></Icon>
                      </ToolbarButton>
                    </div>
                  }
              </div>
            </div>
          </Toolbar>
        );
      case 'back':
        return (
          <Toolbar className={`navbar-toolbar__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
            <div className='left'>
              <BackButton onClick={() => {
                // this.props.actions.pushPage(this.props.navigator.previousShowPage, this.props.navigator.previousNamePage);
                // this.props.actions.changeToolbarType(this.props.navigator.previousToolbarType);
                window.history.back();
                if (this.props.navigator.previousNamePage === 'NEAR ME') {
                  this.props.actions.setMap(true);
                  this.props.actions.setNavMap(true);
                }
              }}>Back</BackButton>
            </div>
            <div className='center navbar__centerLogo'>
              <img src={staticImage.navBarLogo} height='33' />
            </div>
            <div className='right'>
            </div>
          </Toolbar>
        );
      case 'launch':
        return (
            <Toolbar className={`navbar-toolbar__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
              <div className='left'>
              </div>
              <div className='center navbar__centerLogo'>
                <img src={staticImage.navBarLogo} height='33' />
              </div>
              <div className='right'>
              </div>
            </Toolbar>
        );
      case 'conversation':
        return (
          <Toolbar className={`navbar-toolbar__langingPage__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
            <div className='left langingPage__style'>
              <ToolbarButton onClick={this.props.actions.openPanel} >
                <Icon className='navbar__toolbarbutton' icon='ion-navicon, material:md-menu'></Icon>
              </ToolbarButton>
            </div>
            <div className='center navbar__centerLogo'>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                {/* <img src={staticImage.navBarLogo} height='33' />*/}
                <div
                  className='navbar-toolbar__conversation__style__image'
                  style={{backgroundImage: 'url(https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12096543_112678419091581_4726977227796222977_n.jpg?oh=cbce753b727a55c55129d092d56ccf6c&oe=5888F527)'}}
                >
                </div>
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', alignItems: 'flex-start', marginLeft: '7px', lineHeight: '16px', fontWeight: 600 }}>
                    <div>ACTION SPORTS</div>
                    <div>COMMUNITY</div>
                    <div>{this.props.conversations[this.props.selectedConversation].title}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='right langingPage__style'>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                {
                  this.props.auth.isLogin
                  ? <div style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', fontSize: '14px', lineHeight: '20px', fontWeight: 600}} >
                      <div style={{marginLeft: '7px', cursor: 'pointer'}} onClick={() => { console.log('LOG OUT'); this.props.actions.logOut(); this.props.actions.pushPage(false, 'HOME'); }}>LOG OUT </div>
                      <Dialog
                        isOpen={!!this.state.isOpenDialogUnderConstruction}
                        isCancelable={false}
                        onCancel={() => { this.setState({isOpenDialogUnderConstruction: false}); }}>
                        <div>
                          <div
                            style={{color: commonUtils.isAndroid() ? '#fff' : null}}
                            className='alert-dialog-content' >
                              Cart page has not yet been implemented
                          </div>
                          <div className='alert-dialog-footer'>
                              <button onClick={() => { this.setState({isOpenDialogUnderConstruction: false}); }} className='alert-dialog-button'>
                                  OK
                              </button>
                          </div>
                        </div>
                      </Dialog>
                      <ToolbarButton onClick={() => {
                        this.setState({isOpenDialogUnderConstruction: true});
                        // this.props.actions.changeToolbarType('back');
                        // this.props.actions.pushPage(true, 'ShoppingCart');
                      }}>
                        <Icon className='navbar__toolbarbutton' icon='md-shopping-cart, material:md-shopping-cart'></Icon>
                      </ToolbarButton>
                    </div>
                  : <div style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', fontSize: '14px', lineHeight: '20px', fontWeight: 600}} >
                      <div style={{marginLeft: '7px', cursor: 'pointer'}} onClick={() => { console.log('SIGN UP'); this.props.actions.pushPage(true, 'Register'); }}>SIGN UP </div>
                      <div style={{marginLeft: '7px', width: '2px', height: '14px', backgroundColor: '#ccc'}}></div>
                      <div style={{marginLeft: '7px', cursor: 'pointer'}} onClick={() => {
                        console.log('LOG IN');
                        this.props.actions.pushPage(true, 'LOGIN');
                        if (this.props.utility.isMobile) {
                          this.props.actions.changeToolbarType('back');
                        }
                      }}>LOG IN </div>
                      <Dialog
                        isOpen={!!this.state.isOpenDialogUnderConstruction}
                        isCancelable={false}
                        onCancel={() => { this.setState({isOpenDialogUnderConstruction: false}); }}>
                        <div>
                          <div
                            style={{color: commonUtils.isAndroid() ? '#fff' : null}}
                            className='alert-dialog-content' >
                              Cart page has not yet been implemented
                          </div>
                          <div className='alert-dialog-footer'>
                              <button onClick={() => { this.setState({isOpenDialogUnderConstruction: false}); }} className='alert-dialog-button'>
                                  OK
                              </button>
                          </div>
                        </div>
                      </Dialog>
                      <ToolbarButton onClick={() => {
                        this.setState({isOpenDialogUnderConstruction: true});
                        // this.props.actions.changeToolbarType('back');
                        // this.props.actions.pushPage(true, 'ShoppingCart');
                      }}>
                        <Icon className='navbar__toolbarbutton' icon='md-shopping-cart, material:md-shopping-cart'></Icon>
                      </ToolbarButton>
                    </div>
                  }
              </div>
            </div>
          </Toolbar>
        );
      default:
        return (
          <Toolbar className={`navbar-toolbar__langingPage__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
            <div className='left langingPage__style'>
              <ToolbarButton onClick={this.props.actions.openPanel} >
                <Icon className='navbar__toolbarbutton' icon='ion-navicon, material:md-menu'></Icon>
              </ToolbarButton>
            </div>
            <div className='center navbar__centerLogo'>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                <img src={staticImage.navBarLogo} height='33' />
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', alignItems: 'flex-start', marginLeft: '7px', lineHeight: '16px', fontWeight: 600 }}>
                    <div>ACTION SPORTS</div>
                    <div>COMMUNITY</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='right langingPage__style'>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                <div style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', fontSize: '14px', lineHeight: '20px', fontWeight: 600}} >
                  <div style={{marginLeft: '7px', cursor: 'pointer'}} onClick={() => { console.log('SIGN UP'); this.props.actions.pushPage(true, 'Register'); }}>SIGN UP </div>
                  <div style={{marginLeft: '7px', width: '2px', height: '14px', backgroundColor: '#ccc'}}></div>
                  <div
                    style={{marginLeft: '7px', cursor: 'pointer'}}
                    onClick={() => {
                      console.log('LOG IN');
                      // switchAuth is deprecated
                      // this.props.actions.switchAuth(true);
                    }}
                  >
                    LOG IN
                  </div>
                  <Dialog
                    isOpen={!!this.state.isOpenDialogUnderConstruction}
                    isCancelable={false}
                    onCancel={() => { this.setState({isOpenDialogUnderConstruction: false}); }}>
                    <div>
                      <div
                        style={{color: commonUtils.isAndroid() ? '#fff' : null}}
                        className='alert-dialog-content' >
                          Cart page has not yet been implemented
                      </div>
                      <div className='alert-dialog-footer'>
                          <button onClick={() => { this.setState({isOpenDialogUnderConstruction: false}); }} className='alert-dialog-button'>
                              OK
                          </button>
                      </div>
                    </div>
                  </Dialog>
                  <ToolbarButton onClick={() => {
                    this.setState({isOpenDialogUnderConstruction: true});
                    // this.props.actions.changeToolbarType('back');
                    // this.props.actions.pushPage(true, 'ShoppingCart');
                  }}>
                    <Icon className='navbar__toolbarbutton' icon='md-shopping-cart, material:md-shopping-cart'></Icon>
                  </ToolbarButton>
                </div>
              </div>
            </div>
          </Toolbar>
        );
    }
  }
}

export default CustomToolbar;
