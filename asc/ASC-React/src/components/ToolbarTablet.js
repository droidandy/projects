import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';
import * as utilityActions from '../redux/utility';
import {
  Toolbar,
  Icon,
  BackButton,
  Dialog,
  ToolbarButton
} from 'react-onsenui';

import commonUtils from '../utils/commonUtils';

import staticImage from '../staticImages';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, auth: state.auth }), (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions, ...utilityActions}, dispatch) }))

class CustomToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    switch (this.props.navigator.toolbarType) {
      case 'main':
        return (
          <Toolbar className={`navbar-toolbar__langingMobilePage__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
            <div className='left langingPage__style'>
              <ToolbarButton onClick={this.props.actions.openPanel} >
                <Icon className='navbar__toolbarbutton' icon='ion-navicon, material:md-menu'></Icon>
              </ToolbarButton>
            </div>
            <div className='center navbar__centerLogo'>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                <img src={staticImage.navBarLogo} height='33' />
              </div>
            </div>
            <div className='right langingMobilePage__style'>
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
        <Toolbar className={`navbar-toolbar__langingMobilePage__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
          <div className='left langingPage__style'>
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
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
              <img src={staticImage.navBarLogo} height='33' />
            </div>
          </div>
          <div className='right langingMobilePage__style'>
          </div>
        </Toolbar>
        );
      case 'launch':
        return (
            <Toolbar className={`navbar-toolbar__langingMobilePage__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
              <div className='left langingPage__style'>
              </div>
              <div className='center navbar__centerLogo'>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                  <img src={staticImage.navBarLogo} height='33' />
                </div>
              </div>
              <div className='right langingMobilePage__style'>
              </div>
            </Toolbar>
        );
      default:
        return (
          <Toolbar className={`navbar-toolbar__langingMobilePage__style ${this.props.auth.isLogin ? 'navbar-toolbar__loggedIn' : 'navbar-toolbar__loggedOut'}`}>
            <div className='left langingPage__style'>
              <ToolbarButton onClick={this.props.actions.openPanel} >
                <Icon className='navbar__toolbarbutton' icon='ion-navicon, material:md-menu'></Icon>
              </ToolbarButton>
            </div>
            <div className='center navbar__centerLogo'>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                <img src={staticImage.navBarLogo} height='33' />
              </div>
            </div>
            <div className='right langingMobilePage__style'>
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
    }
  }
}

export default CustomToolbar;
