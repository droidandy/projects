import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';

import commonUtils from '../utils/commonUtils';

import {
    Button,
    Dialog,
    Input
} from 'react-onsenui';

@connect((state) => ({ ...state }),
    (dispatch) => ({ actions: bindActionCreators({ ...navigatorActions }, dispatch) }))

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: ''
    };
  }

  handleChange(e) {
    // console.log(e.currentTarget.id);
    this.setState({[e.currentTarget.id]: e.target.value});
  }

  render() {
    return (
        <div className='login-form'>
          <Dialog
            isOpen={!!this.state.openDialog}
            isCancelable={false}
            onCancel={() => { this.setState({openDialog: false}); }}>
            <div>
              <div
                style={{color: commonUtils.isAndroid() ? '#fff' : null}}
                className='alert-dialog-content' >
                  Email has not been finded.
              </div>
              <div className='alert-dialog-footer'>
                  <button onClick={() => { this.setState({openDialog: false}); }} className='alert-dialog-button'>
                      OK
                  </button>
              </div>
            </div>
          </Dialog>

          <div className='title__reg__text'>
              Enter your email
          </div>

          <div className='profile__input__child' >
            <Input
                className='profile__input__wide'
                value={this.state.email}
                id='email'
                onChange={this.handleChange}
                modifier='material'
                placeholder='Email' />
          </div>
          <br/><br/>
          <Button modifier='large'
                  className='login-button'
                  disabled={!this.state.email}
                  onClick={() => {
                    // console.log('RESET PASSWORD');
                    this.setState({openDialog: true});
                  } } >Reset password</Button>

        </div>
    );
  }
}

export default ForgotPassword;
