import fetch from 'isomorphic-fetch';

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';
import ReCAPTCHA from 'react-google-recaptcha';
import {
    Input,
    // Dialog,
    Button
} from 'react-onsenui';

@connect((state) => ({ navigator: state.navigator }), (dispatch) => ({ actions: bindActionCreators(navigatorActions, dispatch) }))

class Contact extends React.Component {
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
    // console.time('time from submit to show dialog');
    let messageAlert = '';

    let re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.state.name || !this.state.email || !this.state.subject || !this.state.message) {
      messageAlert = 'Please fill out all fields. ';
    } else if (re.test(this.state.email)) {
      messageAlert = 'Everything is fine';
    } else messageAlert += 'Invalid email address. ';

    if (!this.state.capturePass) {
      messageAlert += 'Captcha failed. ';
    }

    if (messageAlert === 'Everything is fine') {
      this.setState({isOpenModel: true});
      this.sendEmail();
    } else {
      this.setState({contentAlert: messageAlert, isOpenModel: true});
    }
  }

  sendEmail() {
    // console.log('send email');
    // this.setState({contentAlert: 'Sending'});
    this.setState({contentAlert: 'Your message is in process of being sent. You can wait now for confirmation.'});
    fetch('https://api.sendgrid.com/api/mail.send.json', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: 'to=xsc@xschristians.org&' +
      `subject=${encodeURIComponent(this.state.subject)}&` +
      `text=${encodeURIComponent(this.state.message)}&` +
      `from=${this.state.email}&` +
      `fromname=${this.state.name}&` +
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
                        Contact
                    <div className='title__head__text'>
                        Please fill out the form below and make sure @xschristians.org is a safe sender domain before submitting.
                    </div>
                </div>
                <div className='wrap__regForm'>
                    <div className='wrap__input'>
                        <div className='wrap__inline__seporator__col-wide'></div>
                        <div className='wrap__inline__input'>
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
                        </div>
                        <div className='wrap__inline__seporator__col' ></div>
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
                        <div style={{display: 'flex'}}>
                          <div style={{margin: 'auto'}}>
                            <ReCAPTCHA
                              ref='recaptcha'
                              sitekey='6Ldw9AsUAAAAAJvROXuGDwOQik0fn0463vzbTxh9'
                              theme='dark'
                              onChange={this.onCaptureChange}
                            />
                          </div>
                        </div>
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

            {/* <Dialog
              isOpen={!!this.state.isOpenModel11}
              isCancelable={false}
              onPreShow={() => {
                // console.time('show dialog');
              }}
              onPostShow={() => {
                // console.timeEnd('time from submit to show dialog');
                // console.timeEnd('show dialog');
              }}
              onCancel={this.handleAlertDialogCancel}>
              <div>
                {this.state.contentAlert !== 'Sended' ? <div className='alert-dialog-title'>Information</div> : null}
                <div className='alert-dialog-content'>
                    {this.state.contentAlert}
                </div>
                <div className='alert-dialog-footer'>
                    <button onClick={this.handleAlertDialogOk} className='alert-dialog-button'>
                        OK
                    </button>
                </div>
              </div>
            </Dialog>*/}

        </div>

    );
  }
}

export default Contact;
