import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Form, { Input } from 'components/form';
import { Icon } from 'components';

import css from '../Auth.css';

export default class PasswordForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    resetMode: PropTypes.bool
  };

  validations = {
    password: ['presence', 'strongPassword'],
    passwordConfirmation: {
      presence: true,
      equality: { to: 'password' }
    }
  };

  save = this.save.bind(this);

  $render($) {
    const { resetMode } = this.props;

    return (
      <div>
        <div className="text-26 mb-20">
          { resetMode ? 'Change your password' : 'Set your password' }
        </div>
        <div>
          { this.form && this.form.getError('user') &&
            <div className={ `pl-15 pr-15 pb-10 pt-10 mb-20 ${css.error}` }>{ this.form.getError('user') }</div>
          }
          <div className="relative mb-20">
            <Icon className={ `text-26 grey-text ${css.inputIcon}` } icon="MdVpnKey" />
            <Input { ...$('password') } type="password" placeholder="New password" />
          </div>

          <div className="relative mb-20">
            <Icon className={ `text-26 grey-text ${css.inputIcon}` } icon="MdVpnKey" />
            <Input { ...$('passwordConfirmation') } type="password" placeholder="Confirm your new password" />
          </div>
        </div>
        <Button
          onClick={ this.save }
          size="large"
          className="btn-blue block mb-20"
        >
          <span className="text-22">{ resetMode ? 'Change my password' : 'Set my password' }</span>
        </Button>
        <div className="text-13 mt-5">*password should contain at least 1 uppercase, 1 symbol and minimum 8 characters.</div>
      </div>
    );
  }
}
