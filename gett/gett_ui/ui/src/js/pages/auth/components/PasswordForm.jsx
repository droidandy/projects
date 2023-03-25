import React from 'react';
import PropTypes from 'prop-types';
import Form, { Input } from 'components/form';
import { Button } from 'components';

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
    const modifyYourPassword = resetMode ? 'Change your password' : 'Set your password';

    return (
      <div>
        <div className="text-30 mb-40 black-text text-center">
          { modifyYourPassword }
        </div>
        <div>
          <Input
            { ...$('password') }
            type="password"
            placeholder="New password"
            onPressEnter={ this.save }
            className="mb-20"
            icon="Password"
            iconClassName="light-grey-text"
          />

          <Input
            { ...$('passwordConfirmation') }
            type="password"
            placeholder="Confirm your new password"
            onPressEnter={ this.save }
            className="mb-30"
            icon="Password"
            iconClassName="light-grey-text"
          />
        </div>
        <Button
          onClick={ this.save }
          type="primary"
          size="large"
          className="block mb-20"
        >
          { modifyYourPassword }
        </Button>
        <div className="text-13">
          Password must be at least 8 characters long and include at least 1 uppercase letter and 1 symbol
        </div>
      </div>
    );
  }
}
