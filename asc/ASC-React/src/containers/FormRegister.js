import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../actions';
import {
    Page,
    Toolbar,
    Input,
    AlertDialog,
    Button,
    BackButton
} from 'react-onsenui';

// import MainPageLogin from '../components/MainPageLogin';
import DefaultPage1 from '../components/DefaultPage1';
const navBarLogo = require('../resources/asc-logos.png');

class FormRegister extends React.Component {
  constructor(props) {
    super(props);
    // bind this to event handlers
    this.handleChange = this.handleChange.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleAlertDialogCancel = this.handleAlertDialogCancel.bind(this);
    this.handleAlertDialogOk = this.handleAlertDialogOk.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.preprocessing = this.preprocessing.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.state = {
      complete: false,
      width: null,
      height: null,
      isOpen: false,
      contentAlert: '',
      fname: '',
      lname: '',
      username: '',
      email: '',
      password: '',
      password2: ''

    };
  }
  updateDimensions() {
    let w = window;
    let d = document;
    let documentElement = d.documentElement;
    let body = d.getElementsByTagName('body')[0];
    let width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    let height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

    this.setState({width, height});
    console.log(this.state);
  }
  handleChange(event) {
    this.setState({complete: event.target.checked});
  }
  handleAlertDialogCancel() {
    this.setState({isOpen: false});
  }
  handleAlertDialogOk() {
    console.log(this.state);
    this.setState({isOpen: false});
  }
  preprocessing() {
    console.log(this.state);
  }
  handleClick() {
    let messageAlert = '';

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.state.fname === '' || this.state.lname === '' || this.state.username === '' || this.state.email === '' || this.state.password === '' || this.state.password2 === '') {
      messageAlert = 'Not all fields are filled.';
    } else if (this.state.password === this.state.password2 && this.state.complete === true && re.test(this.state.email)) {
      messageAlert = 'Everything is fine';
    }
    if (!re.test(this.state.email)) {
      messageAlert += 'Implausible email.';
    }
    if (this.state.password !== this.state.password2) {
      messageAlert += 'Passwords do not match.';
    }
    if (this.state.password.length < 3 && this.state.password2.length < 3) {
      messageAlert += 'Passwords are a minimum of 3 characters.';
    }

    if (!this.state.complete) {
      messageAlert += 'You do not accept the agreement.';
    }
    if (messageAlert === 'Everything is fine') {
      console.log('click --', this.props);
      this.props.navigator.pushPage({component: DefaultPage1, props: {key: 'DefaultPage1'}});
    } else {
      this.setState({contentAlert: messageAlert, isOpen: true});
    }

    console.log(this.state);
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  renderToolbar() {
        // console.log(this.props);
    return (
        <Toolbar className='navbar-toolbar__style'>
            <div className='left'><BackButton>Back</BackButton>
            </div>
            <div className='center navbar__centerLogo'>
                <img src={navBarLogo} height='33' />
            </div>
            <div className='right'>
            </div>
        </Toolbar>
    );
  }
  render() {
    console.log('-->', this.props);
    let smallScreen, wideScreen;
    if (this.state.width <= 525) {
      smallScreen = (
        <div className='wrap__submit__small'>
            <div className='onsen__button'>
                <Button
                    onClick={this.handleClick}
                    >
                    SUBMIT
                </Button>
            </div>
        </div>
      );
      wideScreen = (
        <div></div>
      );
    } else {
      smallScreen = (
        <div></div>
      );
      wideScreen = (
        <div className='wrap__submit'>
            <div className='onsen__button'>
                <Button
                    onClick={this.handleClick}
                    >
                    SUBMIT
                </Button>
            </div>
        </div>
      );
    }

    return (
      <Page renderToolbar={this.renderToolbar}>
        <div className='wrap__border'>
            <div className='title__head'>
                <div className='title__head__text'>
                    Join the Action Sports Network
                </div>
            </div>
            <div className='title__small'>
                <div className='title__small__text'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
            </div>
            <div className='title__reg'>
                <div className='title__reg__text'>Join With Your Facebook Account</div>
                <div className='title__reg__text_or'>Or</div>
                <div className='title__reg__text'>Fill Out The form Below</div>
            </div>
            <div className='wrap__regForm'>
                <div className='wrap__input'>
                    <div className='wrap__inline__seporator__col-wide'></div>
                    <div className='wrap__inline__input'>
                        <Input
                            style={{width: '100%'}}
                            value={this.state.fname}
                            onChange={(event) => { this.setState({fname: event.target.value}); this.preprocessing(); } }
                            modifier='material'
                            placeholder='First Name' />

                        <div className='wrap__inline__seporator__row'></div>

                        <Input
                            style={{width: '100%'}}
                            modifier='material'
                            value={this.state.lname}
                            onChange={(event) => { this.setState({lname: event.target.value}); this.preprocessing(); } }
                            placeholder='Last Name' />
                    </div>
                    <div className='wrap__inline__seporator__col'></div>
                    <div className='wrap__inline__input'>
                        <Input
                            style={{width: '100%'}}
                            modifier='material'
                            value={this.state.username}
                            onChange={(event) => { this.setState({username: event.target.value}); this.preprocessing(); } }
                            placeholder='Username'
                            />

                        <div className='wrap__inline__seporator__row'></div>
                        <Input
                            style={{width: '100%'}}
                            modifier='material'
                            value={this.state.email}
                            onChange={(event) => { this.setState({email: event.target.value}); this.preprocessing(); } }
                            placeholder='Email Address'
                            />
                    </div>
                    <div className='wrap__inline__seporator__col'></div>
                    <div className='wrap__inline__input'>
                        <Input
                            style={{width: '100%'}}
                            modifier='material'
                            value={this.state.password} float
                            onChange={(event) => { this.setState({password: event.target.value}); this.preprocessing(); } }
                            placeholder='Password'
                            />
                        <div className='wrap__inline__seporator__row'></div>
                        <Input
                            style={{width: '100%'}}
                            modifier='material'
                            value={this.state.password2}
                            onChange={(event) => { this.setState({password2: event.target.value}); this.preprocessing(); } }
                            placeholder='Confirm Password'
                            />
                    </div>
                </div>
                {wideScreen}

            </div>
            <div>
                <div className='wrap__inline__input'>
            <span>
            <label className='label__checkbox__text'>
              <input
                    type='checkbox'
                    checked={this.state.complete}
                    ref='complete'
                    onChange={(e) => { this.handleChange(e); this.preprocessing(); } }
              />
                I have read and agree to the terms of service.*
            </label>
            </span>
                </div>
            </div>
            {smallScreen}
        </div>
        <AlertDialog isOpen={this.state.isOpen} isCancelable={true} onCancel={this.handleAlertDialogCancel}>
          <div className='alert-dialog-title'>Warning</div>
            <div className='alert-dialog-content'>
              {this.state.contentAlert}
            </div>
            <div className='alert-dialog-footer'>
              <button onClick={this.handleAlertDialogCancel} className='alert-dialog-button'>
                Cancel
              </button>
              <button onClick={this.handleAlertDialogOk} className='alert-dialog-button'>
                OK
              </button>
          </div>
        </AlertDialog>
      </Page>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(
    undefined,
    mapDispatchToProps
)(FormRegister);
