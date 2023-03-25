import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as utilityActions from '../redux/utility';

import commonUtils from '../utils/commonUtils';

import {
  Toolbar,
  Icon,
  ToolbarButton,
  Dialog,
  BackButton
} from 'react-onsenui';

import staticImage from '../staticImages';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth, utility: state.utility, selectedConversation: state.selectedConversation, conversations: state.conversations }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...utilityActions}, dispatch) }))

class CustomToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    switch (this.props.navigator.toolbarType) {
      case 'main':
        return (
          <Toolbar className={`navbar-toolbar__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
            <div className='left'>
              <ToolbarButton onClick={this.props.actions.openPanel} >
                <Icon className='navbar__toolbarbutton' icon='ion-navicon, material:md-menu'></Icon>
              </ToolbarButton>
            </div>
            <div className='center navbar__centerLogo'>
              <img src={staticImage.navBarLogo} height='33' />
            </div>
            <div className='right'>
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
          </Toolbar>
        );
      case 'back':
        return (
          <Toolbar className={`navbar-toolbar__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
              <div className='left'>
                  <BackButton onClick={() => {
                    window.history.back();
                  }}>Back</BackButton>
              </div>
              <div className={`center navbar__centerLogo ${this.props.auth.isLogin ? 'navbar__centerLogo__loggedIn' : 'navbar__centerLogo__loggedOut'} `} >
                  {this.props.navigator.namePage}
              </div>
              <div className='right'>
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
          </Toolbar>
        );
      case 'conversation':
        return (
          <Toolbar className={`navbar-toolbar__conversation__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
              <div className='left navigation-bar__left navbar-toolbar__conversation__back' >
                  <BackButton onClick={() => {
                    window.history.back();
                  }}>Back</BackButton>
              </div>
              <div className='center navbar-toolbar__conversation__container' >
                  <div
                    className='navbar-toolbar__conversation__style__image'
                    style={{backgroundImage: 'url(https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12096543_112678419091581_4726977227796222977_n.jpg?oh=cbce753b727a55c55129d092d56ccf6c&oe=5888F527)'}}
                  >
                  </div>

                  <div className='navbar-toolbar__conversation__style__center' style={{color: commonUtils.isAndroid() ? '#fff' : null}}>
                    <div className='navbar-toolbar__conversation__style__center__text'>
                      {this.props.conversations[this.props.selectedConversation].title}
                    </div>
                    <div className='navbar-toolbar__conversation__style__center__text'>
                      N members
                      {/* <div>this.props.conversation.qtyMembers</div>*/}
                    </div>
                  </div>
              </div>
                 <div className='right' style={{width: '0%'}}>
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
      default:
        return (
          <Toolbar className={`navbar-toolbar__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
              ty rty
            <div className='left'>
              <ToolbarButton onClick={this.props.actions.openPanel} >
                <Icon className='navbar__toolbarbutton' icon='ion-navicon, material:md-menu'></Icon>
              </ToolbarButton>
            </div>
            <div className='center navbar__centerLogo'>
              <img src={staticImage.navBarLogo} height='33' />
            </div>
            <div className='right'>
              <ToolbarButton>
                <Icon className='navbar__toolbarbutton' icon='md-shopping-cart, material:md-shopping-cart'></Icon>
              </ToolbarButton>
            </div>
          </Toolbar>
        );
    }
  }
}

export default CustomToolbar;
