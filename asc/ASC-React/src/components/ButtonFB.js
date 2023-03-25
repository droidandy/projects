import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import fetch from 'isomorphic-fetch';

import * as navigatorActions from '../redux/navigator';
import * as authActions from '../redux/auth';
import * as panelActions from '../redux/panel';
import * as registerActions from '../redux/register';

import {
    Icon
} from 'react-onsenui';

import FacebookLogin from 'react-facebook-login';
import facebookUtils from '../utils/facebookUtils';

@connect((state) => ({ ...state }),
    (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...authActions, ...panelActions, ...registerActions}, dispatch) }))

class ButtonFB extends React.Component {
  constructor(props) {
    super(props);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.regestrationCB = this.regestrationCB.bind(this);
    this.state = {
      facebookLoginCallback: this.responseFacebook,
      facebookLoginOnClick: undefined
    };
  }

  componentDidMount() {
    if (this.props.registration) {
      this.setState({ facebookLoginCallback: this.regestrationCB });
    }
  }

  responseFacebook(response) {
    // console.log('response -->', response);
    if (response.status !== 'unknown') {
      this.props.actions.loginFBUser(response.accessToken);
      this.props.actions.switchAuth(true);
      this.props.actions.setNavSwipeablePanel(true);
      this.props.actions.pushPage(false, 'HOME');
      this.props.actions.changeToolbarType('main');
    }
  }

  regestrationCB(response) {
    // console.log('REGISTRATION FB', response);
    // if (response.status !== 'unknown') {
      // this.props.actions.addRegisterData({
      //   firstName: response.first_name,
      //   lastName: response.last_name,
      //   email: response.email,
      //   gender: response.gender,
      // });
      // const regInfo = window.localStorage.getItem('regInfo');
      // this.props.actions.registerFBUser({ facebookAccessToken: response.accessToken, regInfo });
      // this.props.actions.pushPage(true, 'ContinueRegister');
    // }
  }

  render() {
    // console.log('process.env', process);
    return (
      this.props.utility.isDevice
        ? <span
            className='facebookButtonClass buttonFB'
            onClick={() => {
              facebookUtils.facebook()
              .then(result => {
                this.responseFacebook(result);
              });
            }}>
            <Icon icon='ion-social-facebook, material:ion-social-facebook' className='buttonFB__mobile' />
            Login
          </span>
        : <FacebookLogin
            /* appId={process.env.FB_APP_ID || process.env.npm_config_FB_APP_ID} */
            appId={process.env.FB_APP_ID || '556708821182922'} // test appID. FB_APP_ID defined with build
            autoLoad={false}
            version= '2.8'
            fields='name,first_name,last_name,email,picture.type(large),id,link,gender,locale,timezone,updated_time,verified'
            textButton='Login'
            callback={this.state.facebookLoginCallback}
            // onClick={this.state.facebookLoginOnClick}
            cssClass='facebookButtonClass'
            icon={<Icon icon='ion-social-facebook, material:ion-social-facebook' className='buttonFB__web' />}
            />
    );
  }
}

export default ButtonFB;
