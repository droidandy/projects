import React from 'react';
import Form, { Input } from 'components/form';
import { Icon, ButtonLink } from 'components';
import { Row, Col, Button } from 'antd';

export default class ChangePasswordForm extends Form {
  save = this.save.bind(this);

  validations = {
    'currentPassword': 'presence',
    'password': ['presence', 'strongPassword'],
    'passwordConfirmation': {
      presence: true,
      equality: { to: 'password' }
    }
  };

  $render($) {
    return (
      <div className="p-20">
        <div className="text-24 bold-text mb-20">Change Password</div>
        <div className="text-12 black-text mb-20">
          Please use the form below to change your password.
        </div>
        <Row type="flex">
          <Col md={ 8 } xs={ 24 }>
            <Input { ...$('email') } disabled className="mb-20" label="Username" labelClassName="mb-5" />
            <Input { ...$('currentPassword') } className="mb-20" label="Current Password" labelClassName="required mb-5" type="password" />
            <Input { ...$('password') } className="mb-20" label="New Password" labelClassName="required mb-5" type="password" />
            <Input { ...$('passwordConfirmation') } className="mb-30" label="Confirm New Password" labelClassName="required mb-5" type="password" />
          </Col>
        </Row>
        <ButtonLink buttonClassName="btn-orange" className="mr-10" to="/">
          <Icon className="text-20 mr-10" icon="MdClose" />
          Cancel
        </ButtonLink>
        <Button type="primary" onClick={ this.save }>
          <Icon className="text-20 mr-10" icon="MdLock" />
          Change Password
        </Button>
        <div className="mt-10">
          *password should contain at least 1 uppercase, 1 symbol and minimum 8 characters.
        </div>
      </div>
    );
  }
}
