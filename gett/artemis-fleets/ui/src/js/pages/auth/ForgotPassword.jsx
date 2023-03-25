import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, notification } from 'antd';
import Form, { bindState, Input } from 'components/form';
import { Icon } from 'components';
import { put } from 'utils';

import css from './Auth.css';

export default class ForgotPassword extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  form = null;

  sendInstructions = () => {
    this.form.ifValid(() => {
      put('/user/forgot_password', this.state.form)
        .then(() => this.setState({ form: {} }))
        .then(() => this.context.router.history.push('/'))
        .then(() => {
          notification.success({
            message: 'Instructions Sent',
            description: 'Reset password instructions have been sent to specified email address (if such exists). ' +
              'Please check your mailbox and follow link in the email.',
            duration: 0
          });
        });
    });
  };

  render() {
    return (
      <div>
        <div className="text-26 mb-20">Forgot password?</div>
        <Form { ...bindState(this) } ref={ (form) => { this.form = form; } } validations={ { email: ['presence', 'email'] } }>
          { $ => (
            <div className="relative mb-20">
              <Icon className={ `text-26 grey-text ${css.inputIcon}` } icon="UserIcon" />
              <Input { ...$('email') } type="text" placeholder="Email" />
            </div>
          ) }
        </Form>
        <Button
          onClick={ this.sendInstructions }
          size="large"
          className="btn-blue block mb-20"
        >
          <span className="text-22">Send me instructions</span>
        </Button>
        <div className="text-center">
          <Link to="/" className="grey-text underline">Log In</Link>
        </div>
      </div>
    );
  }
}
