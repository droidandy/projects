import React from 'react';
import { ModalForm, Input, Select, ImageEditor } from 'components/form';
import { Row, Col } from 'antd';
import { Avatar } from 'components';

const { Option } = Select;

export default class UserForm extends ModalForm {

  validations = {
    email: ['presence', 'email'],
    firstName: 'presence',
    lastName: 'presence',
    phone: 'presence'
  };

  getTitle() {
    return this.get('id') ? `Edit User: ${this.get('firstName')} ${this.get('lastName')}` : 'New User';
  }

  $render($) {
    const { canEditRole, currentUserId } = this.props;
    const isRoleDisabled = !canEditRole && this.get('id') === currentUserId;
    return (
      <div>
        <Row type="flex" gutter={ 20 }>
          <Col md={ 8 }>
            <Select { ...$('role') } disabled={ isRoleDisabled } className="block mb-20" label="Role" labelClassName="required mb-5">
              <Option value="admin">Admin</Option>
              <Option value="finance">Finance</Option>
              <Option value="user">User</Option>
            </Select>
            <Input { ...$('firstName') } className="mb-20" label="First Name" labelClassName="required mb-5" />
            <Input { ...$('lastName') } className="mb-20" label="Last Name" labelClassName="required mb-5" />
          </Col>
          <Col md={ 8 }>
            <Input { ...$('phone') } className="mb-20" label="Phone" labelClassName="required mb-5" />
            <Input { ...$('mobile') } className="mb-20" label="Other Phone" labelClassName="mb-5" />
          </Col>
          <Col md={ 8 } className="text-center sm-mb-20">
            <ImageEditor { ...$('avatar') } uploadText="Edit Photo">
              <Avatar className="mb-20 center-block" src={ this.get('avatar') || this.get('avatarUrl') } />
            </ImageEditor>
          </Col>
        </Row>
        <Row type="flex" gutter={ 20 } align="bottom">
          <Col md={ 8 }>
            <Input { ...$('email') } className="mb-20" label="Email" labelClassName="required mb-5" />
          </Col>
        </Row>
      </div>
    );
  }
}
