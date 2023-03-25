import fetch from 'isomorphic-fetch';

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';
import {
    Input,
    Button
} from 'react-onsenui';

@connect((state) => ({ navigator: state.navigator, auth: state.auth, utility: state.utility }), (dispatch) => ({ actions: bindActionCreators(navigatorActions, dispatch) }))

class Help extends React.Component {
  constructor(props) {
    super(props);
    this.sendEmail = this.sendEmail.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleAlertDialogCancel = this.handleAlertDialogCancel.bind(this);
    this.handleAlertDialogOk = this.handleAlertDialogOk.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onCaptureChange = this.onCaptureChange.bind(this);
    this.state = {
      isOpenModel: false,
      capturePass: false,
      width: null,
      height: null,
      contentAlert: '',
      name: '',
      email: '',
      subject: '',
      message: ''};
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
    this.setState({width, height});
  }

  handleAlertDialogCancel() {
    this.setState({contentAlert: '', isOpenModel: false});
  }

  handleAlertDialogOk() {
    this.setState({contentAlert: '', isOpenModel: false});
  }

  onCaptureChange(value) {
    this.setState({capturePass: !!value});
  }

  handleClick() {
    let messageAlert = '';

    if (!this.state.subject || !this.state.message) {
      messageAlert = 'Please fill out all fields. ';
    } else messageAlert = 'Everything is fine';

    if (messageAlert === 'Everything is fine') {
      this.setState({isOpenModel: true});
      this.sendEmail();
    } else {
      this.setState({contentAlert: messageAlert, isOpenModel: true});
    }
  }

  sendEmail() {
    this.setState({contentAlert: 'Your message is in process of being sent. You can wait now for confirmation.'});
    fetch('https://api.sendgrid.com/api/mail.send.json', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: 'to=xsc@xschristians.org&' +
      `subject=${encodeURIComponent(this.state.subject)}&` +
      `text=${encodeURIComponent(this.state.message)}${this.props.utility.isDevice ? '' : `\n\nSystemInfo/userAgent:\n\n${encodeURIComponent(window.navigator.userAgent)}`}&` +
      `from=${this.props.auth.authData.email}&` +
      `fromname=${this.props.auth.authData.name}&` +
      'api_user=' +
      'api_key='
    }).then(response => {
      if (response.status >= 400) {
        this.setState({contentAlert: 'Sorry, there was a problem sending your message', name: '', email: '', subject: '', message: ''});
      } else {
        this.setState({contentAlert: 'Your message was sent successfully', name: '', email: '', subject: '', message: ''});
      }
    });
  }

  render() {
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
        <div>
            <div className='wrap__border'>
                <div className='title__head'>
                        Help page
                    <div className='title__head__text'>
                        Please fill out the form below and make sure @xschristians.org is a safe sender domain before submitting.
                    </div>
                </div>
                <div className='wrap__regForm'>
                    <div className='wrap__input'>
                        {/* <div className='wrap__inline__seporator__col-wide'></div>*/}
                        {/* <div className='wrap__inline__input'>
                          <Input
                              style={{width: '100%'}}
                              value={this.state.name}
                              onChange={(event) => { this.setState({name: event.target.value}); } }
                              modifier='material'
                              placeholder='Name' />
                        </div>
                        <div className='wrap__inline__seporator__col' ></div>
                        <div className='wrap__inline__input'>
                          <Input
                              style={{width: '100%'}}
                              modifier='material'
                              value={this.state.email}
                              onChange={(event) => { this.setState({email: event.target.value}); } }
                              placeholder='Email Address'
                              />
                        </div>*/}
                        {/* <div className='wrap__inline__seporator__col' ></div>*/}
                        <div className='wrap__inline__input'>
                          <Input
                              style={{width: '100%'}}
                              modifier='material'
                              value={this.state.subject} float
                              onChange={(event) => { this.setState({subject: event.target.value}); } }
                              placeholder='Subject'
                              />
                        </div>
                        <div className='wrap__inline__seporator__col' ></div>
                        <div className='wrap__inline__input ons-input .text-input__container'>
                          <textarea
                            className='textarea contact__textarea'
                            rows='3'
                            placeholder='Message'
                            value={this.state.message}
                            onChange={(event) => { this.setState({message: event.target.value}); } } />
                        </div>
                        <div className='wrap__inline__seporator__col' ></div>
                    </div>
                    {wideScreen}

                </div>
                {smallScreen}
                {
                  this.state.isOpenModel
                  ? <div className='title__head__text'>{this.state.contentAlert}</div>
                  : null
                }
            </div>
        </div>

    );
  }
}

export default Help;
