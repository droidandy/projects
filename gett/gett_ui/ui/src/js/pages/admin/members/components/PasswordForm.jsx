import React from 'react';
import { ModalForm, Input } from 'components/form';

export default class PasswordForm extends ModalForm {
  validations = {
    password: ['presence'],
    passwordConfirmation: {
      presence: true,
      equality: { to: 'password' }
    }
  };

  $render($) {
    return (
      <div>
        <Input
          { ...$('password') }
          label="Password"
          labelClassName="bold-text mb-10"
          className="mb-20"
        />
        <Input
          { ...$('passwordConfirmation') }
          label="Confirm Password"
          labelClassName="bold-text mb-10"
          className="mb-20"
        />
      </div>
    );
  }
}
