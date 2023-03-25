import React from 'react';
import PropTypes from 'prop-types';
import Form, { Input, Select, ImageEditor, CompanySelector, PhoneInput } from 'components/form';
import { Row, Col, Switch, Alert } from 'antd';
import { Avatar, ButtonLink, Button, Icon, Desktop } from 'components';
import { map, startCase, find } from 'lodash';
import { get } from 'utils';
import CN from 'classnames';

import css from './style.css';

const { Option } = Select;

export default class UserForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    loading: PropTypes.bool,
    data: PropTypes.object,
    verifyEmail: PropTypes.func
  };

  state = {
    emailVerified: false,
    existingMember: false,
    createMember: false,
    payrollRequired: false,
    costCentreRequired: false
  };

  save = this.save.bind(this);

  baseValidations = {
    'firstName': 'presence',
    'lastName': 'presence',
    'email': function() {
      if (!this.emailActuallyVerified) {
        return 'Please click on Verify button to check email';
      }
    }
  };

  validations() {
    const validations = { ...this.baseValidations };
    const { existingMember, createMember } = this.state;
    const { payrollRequired, costCentreRequired } = this.selectedCompany;

    if (this.isNew && !existingMember) {
      Object.assign(validations, {
        password: ['presence', 'strongPassword'],
        passwordConfirmation: {
          presence: true,
          equality: { to: 'password' }
        }
      });
    }

    if (createMember || this.isEditableMember) {
      Object.assign(validations, {
        companyId: 'presence',
        memberRoleType: 'presence',
        phone: ['presence', 'phoneNumber']
      });

      if (payrollRequired) {
        validations.payroll = 'presence';
      }

      if (costCentreRequired) {
        validations.costCentre = 'presence';
      }
    }

    return validations;
  }

  verifyEmail = () => {
    const { id, email } = this.get();
    const error = Form.validations.presence(email) || Form.validations.email(email);

    if (error) {
      return this.setErrors({
        ...this.state.errors,
        email: error
      });
    }

    get('/admin/users/verify_email', { id, email })
      .then((res) => {
        const { verified, message, error, member } = res.data;

        const nextState = {
          emailVerified: verified,
          verificationMessage: message,
          errors: { ...this.state.errors, email: error }
        };

        if (member) {
          nextState.existingMember = true;
          nextState.errors = {};
          this.set(member);
        }

        this.setState(nextState);
      });
  };

  changeEmail(email) {
    this.emailChanged = true;

    const attrs = { email };

    if (this.state.existingMember) {
      Object.assign(attrs, this.getNullifiedMemberAttributes(), {
        firstName: null,
        lastName: null
      });
    }

    this.setState({ emailVerified: false, verificationMessage: null, existingMember: false });
    this.set(attrs);
  }

  switchCreateMember = (createMember) => {
    this.setState({ createMember }, () => {
      this.set(this.getNullifiedMemberAttributes());
    });
  };

  getNullifiedMemberAttributes() {
    const emptyValue = this.state.createMember ? null : undefined;

    return {
      companyId: emptyValue,
      memberRoleName: emptyValue,
      phone: emptyValue,
      payroll: emptyValue,
      costCentre: emptyValue
    };
  }

  get isEditableMember() {
    return this.get('editableMember');
  }

  get isEditableSuperadmin() {
    return this.get('superadmin');
  }

  get emailActuallyVerified() {
    return this.state.emailVerified || (!this.isNew && !this.emailChanged);
  }

  get selectedCompany() {
    return find(this.props.data.companies, { id: +this.get('companyId') }) || {};
  }

  $render($) {
    const { loading, data: { userRoles, memberRoles, can } } = this.props;
    const { createMember, verificationMessage, existingMember } = this.state;
    const { payrollRequired, costCentreRequired } = this.selectedCompany;

    return (
      <div>
        <Row type="flex" gutter={ 20 }>
          <Col md={ { span: 16, order: 0 } } xs={ { span: 24, order: 1 } }>
            <Row type="flex" gutter={ 20 }>
              <Col md={ 12 } xs={ 24 }>
                <Select { ...$('userRoleName') } className="block mb-20" label="Role" labelClassName="required mb-5" disabled={ !can.changeUserRole }>
                  { map(userRoles, role => <Option key={ role }>{ startCase(role) }</Option>) }
                </Select>
                <Input { ...$('firstName') } className="mb-20" label="First Name" labelClassName="required mb-5" disabled={ existingMember } />
                <Input { ...$('lastName') } className="mb-20" label="Last Name" labelClassName="required mb-5" disabled={ existingMember } />
                <div className="mb-20">
                  Create user for Front Office
                  <Switch
                    checked={ createMember || existingMember || this.isEditableMember }
                    onChange={ this.switchCreateMember }
                    disabled={ existingMember || this.isEditableMember }
                    className="ml-20"
                    data-name="createUserForFrontOffice"
                  />
                </div>
              </Col>
              <Col md={ 12 } xs={ 24 }>
                <div className="layout horizontal mb-20">
                  <Input { ...$('email')(this.changeEmail) } className="flex" label="Email" labelClassName="required mb-5" />

                  <Button
                    className={ CN('ml-5 mt-23', css.verify, { [css.verified]: this.emailActuallyVerified }) }
                    type="primary"
                    icon="check"
                    onClick={ this.verifyEmail }
                    data-name="emailVerify"
                  >
                    { this.emailActuallyVerified ? 'Verified' : 'Verify' }
                  </Button>
                </div>
                { verificationMessage &&
                  <Alert type="warning" message={ verificationMessage } className="mb-10" />
                }
                { (this.isNew && !existingMember) &&
                  <div>
                    <Input { ...$('password') } type="password" className="mb-20" label="Password" labelClassName="required mb-5" />
                    <Input { ...$('passwordConfirmation') } type="password" className="mb-10" label="Confirm Password" labelClassName="required mb-5" />
                    <div className="mb-20 grey-text text-12">*password should contain at least 1 uppercase, 1 symbol and minimum 8 characters.</div>
                  </div>
                }
              </Col>
            </Row>
            { (createMember || existingMember || this.isEditableMember) &&
              <div>
                <div className="mb-20">
                  <CompanySelector
                    { ...$('companyId') }
                    onlyActive
                    label="Company"
                    labelClassName="required mb-5"
                    disabled={ existingMember || !can.changeCompany }
                  />
                </div>
                <Select
                  { ...$('memberRoleType') }
                  className="block mb-20"
                  label="Role"
                  labelClassName="required mb-5"
                  disabled={ existingMember || !can.changeMemberRole }
                >
                  { map(memberRoles, role => (
                      <Option key={ role }>{ startCase(role) }</Option>
                    ))
                  }
                </Select>
                <PhoneInput
                  { ...$('phone') }
                  className="mb-20"
                  label="Phone"
                  labelClassName="required mb-5"
                  disabled={ existingMember }
                />

                { payrollRequired && (createMember || this.isEditableMember) &&
                  <Input { ...$('payroll') } className="mb-20" label="Payroll" labelClassName="required mb-5" />
                }
                { costCentreRequired && (createMember || this.isEditableMember) &&
                  <Input { ...$('costCentre') } className="mb-20" label="Cost Centre" labelClassName="required mb-5" />
                }
              </div>
            }
          </Col>

          <Col md={ 8 } xs={ 24 } className="text-center">
            { existingMember
              ? <Avatar className="mb-20 center-block" name={ `${ this.get('firstName') } ${ this.get('lastName') }` }  src={ this.get('avatar') || this.get('avatarUrl') } />
              : <ImageEditor { ...$('avatar') } uploadText="Edit Photo" className="mb-30 sm-mb-20">
                  <Avatar className="mb-20 center-block" name={ `${ this.get('firstName') } ${ this.get('lastName') }` } src={ this.get('avatar') || this.get('avatarUrl') } />
                </ImageEditor>
            }

            { this.isEditableSuperadmin &&
              <div className="mb-20">
                Master token
                <Switch
                  { ...$('masterTokenEnabled') }
                  checked={ this.get('masterTokenEnabled') }
                  className="ml-20"
                />
              </div>
            }

            { this.isEditableSuperadmin && this.get('masterTokenEnabled') && this.get('masterToken') &&
              <div className="mb-20">{ this.get('masterToken') }</div>
            }
          </Col>
        </Row>
        <Row type="flex" justify="end" className="border-top pt-20 mb-20 layout xs-center-justified">
          <ButtonLink type="secondary" className="mr-10" to="/users/admins">
            <Desktop><Icon className="text-20 mr-10" icon="MdClose" /></Desktop>
            Cancel
          </ButtonLink>
          <Button type="primary" onClick={ this.save } loading={ loading } data-name="saveGettUser">
            <Desktop><Icon className="text-20 mr-10" icon="MdAdd" /></Desktop>
            { this.get('id') ? 'Update User' : 'Create User' }
          </Button>
        </Row>
      </div>
    );
  }
}
