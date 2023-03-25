import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, PhoneInput } from 'components/form';
import { Row, Col } from 'antd';
import find from 'lodash/find';
import { roleNameToLabel } from 'utils/labels';

const { Option } = Select;

export default class MemberFormBlock extends Component {
  static propTypes = {
    $: PropTypes.func,
    attrs: PropTypes.object,
    can: PropTypes.object,
    roles: PropTypes.arrayOf(PropTypes.string),
    onRoleChange: PropTypes.func,
    workRoles: PropTypes.arrayOf(PropTypes.object),
    departments: PropTypes.arrayOf(PropTypes.object),
    isBbcCompany: PropTypes.bool
  };

  static validations = {
    email: {
      presence: { message: 'Please add in email' },
      email: true
    },
    firstName: {
      presence: { message: 'Please add in first name' },
      personName: { length: 30 }
    },
    lastName: {
      presence: { message: 'Please add in last name' },
      personName: { length: 30 }
    },
    phone: {
      presence: { message: 'Please add in phone number' }
    }
  };

  getMemberDepartmentName() {
    const { departments, attrs } = this.props;
    const department = find(departments, { id: attrs.departmentId });

    return department && department.name;
  }

  getMemberWorkRoleName() {
    const { workRoles, attrs } = this.props;
    const workRole = find(workRoles, { id: attrs.workRoleId });

    return workRole && workRole.name;
  }

  render() {
    const { $, can, roles, workRoles, departments, onRoleChange, isBbcCompany } = this.props;
    const editAll = !('editAll' in can) || can.editAll;
    const roleTypeProps = onRoleChange ? $('roleType')(onRoleChange) : $('roleType');

    return (
      <Row type="flex" gutter={ 20 }>
        <Col md={ { span: 24, order: 0 } } xs={ { span: 24, order: 1 } }>
          <Row type="flex" gutter={ 20 } className="pl-30 pr-30">
            <Col md={ { span: 12, order: 0 } } xs={ { span: 24, order: 1 } }>
              <Select { ...roleTypeProps } className="block mb-20" label="Role" labelClassName="required mb-5" disabled={ !can.changeRole }>
                { roles.map(role => <Option key={ role }>{ roleNameToLabel(role) }</Option>) }
              </Select>
              <Input { ...$('firstName') } className="mb-20" label="First name" labelClassName="required mb-5" />
              <Input { ...$('lastName') } className="mb-20" label="Last name" labelClassName="required mb-5" />

              { editAll &&
                <Select { ...$('departmentId') } allowClear className="block mb-20" label="Department" labelClassName="mb-5" disabled={ !can.changeDepartment }>
                  { departments.map(dep => <Option key={ dep.id }>{ dep.name }</Option>) }
                </Select>
              }
              { editAll && isBbcCompany &&
                <Select
                  { ...$('customAttributes.pdType') }
                  className="block mb-20"
                  label="Passenger categorisation"
                  labelClassName="required mb-5"
                  disabled={ !can.changePd }
                >
                  <Option key="freelancer">Freelancer</Option>
                  <Option key="staff">Staff</Option>
                </Select>
              }
            </Col>
            <Col md={ { span: 12, order: 0 } } xs={ { span: 24, order: 1 } }>
              <PhoneInput
                { ...$('phone') }
                label="Phone"
                className="mb-20"
                labelClassName="required mb-5"
              />
              <PhoneInput
                { ...$('mobile') }
                label="Other Phone"
                className="mb-20"
                labelClassName="mb-5"
              />
              <Input { ...$('email') } className="mb-20" label="Email" labelClassName="required mb-5" disabled={ !can.changeEmail } />

              { editAll &&
                <Select { ...$('workRoleId') } allowClear className="block mb-20" label="Work role" labelClassName="mb-5" disabled={ !can.changeWorkRole }>
                  { workRoles.map(role => <Option key={ role.id }>{ role.name }</Option>) }
                 </Select>
              }
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
