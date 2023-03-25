import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import Form, { bindState, Input } from 'components/form';
import { Button } from 'components';
import { put } from 'utils';
import CN from 'classnames';

import css from './Auth.css';

export default class ForgotPassword extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  form = null;

  setFormRef = form => this.form = form;

  sendInstructions = () => {
    this.form.ifValid(() => {
      put('/user/forgot_password', this.state.form)
        .then(() => this.setState({ form: {} }))
        .then(() => this.context.router.history.push('/'))
        .then(() => {
          notification.success({
            message: 'Instructions Sent',
            description: "We've sent you an email with instructions on how to reset your password. " +
              'Please check your inbox and follow link in the email.',
            duration: 0
          });
        });
    });
  };

  render() {
    return (
      <div>
        <div className="text-30 mb-40 black-text text-center light-text">Forgot password?</div>
        <Form { ...bindState(this) } ref={ this.setFormRef } validations={ { email: ['presence', 'email'] } }>
          { $ => (
            <Input
              { ...$('email') }
              type="email"
              placeholder="Email"
              onPressEnter={ this.sendInstructions }
              className="mb-30"
              icon="Email"
              iconClassName="light-grey-text"
              size="large"
            />
          ) }
        </Form>
        <div className="layout horizontal center">
          <Button
            onClick={ this.sendInstructions }
            type="primary"
            size="large"
            className={ CN('mr-40', css.loginBtn) }
          >
            Reset now
          </Button>
          <Link to="/" className="blue-text underline bold-text">Log In</Link>
        </div>
      </div>
    );
  }
}
