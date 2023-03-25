import React, { Fragment } from 'react';
import Form, { Input } from 'components/form';
import { Button } from 'components';
import { Row, Col } from 'antd';

import css from './settings.css';

export default class ChangePasswordForm extends Form {
  save = this.save.bind(this);

  validations = {
    currentPassword: {
      presence: { message: 'Please enter your password' }
    },
    password: {
      presence: { message: 'Please enter your password' },
      strongPassword: true
    },
    passwordConfirmation: {
      presence: { message: 'Please enter your password' },
      equality: { to: 'password', message: 'These passwords do not match' }
    }
  };

  $render($) {
    return (
      <Fragment>
        <div className="page-title mb-30">Change Password</div>
        <Row type="flex" justify="center">
          <Col xs={ 24 } sm={ 12 } md={ 10 } lg={ 10 } xl={ 8 }>
            <Input { ...$('email') } disabled className="mb-20" label="Username" />
            <Input { ...$('currentPassword') } className="mb-20" label="Current Password" labelClassName="required" type="password" />
            <Input { ...$('password') } className="mb-20" label="New Password" labelClassName="required" type="password" />
            <Input { ...$('passwordConfirmation') } className="mb-30" label="Confirm New Password" labelClassName="required" type="password" />
          </Col>
        </Row>
        <Row type="flex">
          <Col xs={ 24 } className="text-center">
            <Button type="primary" onClick={ this.save }>
              Apply
            </Button>
            <div className={ `mt-10 grey-text ${css.constrainedBox}` }> 
              Password must be at least 8 characters long and include at least 1 uppercase letter and 1 symbol.
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
