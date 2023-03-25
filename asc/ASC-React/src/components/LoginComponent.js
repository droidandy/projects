import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Button, AlertDialog } from 'react-onsenui';
import LoginButton from './ButtonFB';
import InputField from './InputField';

const renderAlert = (message) => (
  <AlertDialog isOpen isCancelable>
    <div className='alert-dialog-title'>Server Error</div>
    <div className='alert-dialog-content'>{message}</div>
  </AlertDialog>
);

const LoginComponent = ({
  onSubmit,
  pristine,
  submitSucceeded,
  auth: { errors: serverErrors }
}) => (
  <div className='login-form'>
    {
      serverErrors.loginEmail &&
      submitSucceeded &&
      !pristine &&
      renderAlert(serverErrors.loginEmail.message)
    }
    <div className='title__reg__text'>
      <span style={{ marginRight: '10px' }}>
        Join With Your Facebook Account
      </span>
      <LoginButton/>
    </div>
    <div className='profile__input__child'>
      <Field
        name='email'
        type='text'
        label='Email'
        css='profile__input__wide'
        component={InputField}
      />
    </div>
    <div className='profile__input__child'>
      <Field
        name='password'
        type='password'
        label='Password'
        css='profile__input__wide'
        component={InputField}
      />
    </div>
    <br/><br/>
    <Button
      modifier='large'
      className='login-button'
      onClick={onSubmit}
      disabled={pristine}
    >
      Log In
    </Button>
    <Button
      modifier='quiet'
      className='forgot-password'
      onClick={() => console.log('Forgot password? click')}
    >
      Forgot password?
    </Button>
  </div>
);

LoginComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitSucceeded: PropTypes.bool.isRequired,
  serverErrors: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ])
};

export default LoginComponent;
