import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ModalForm, Input, Select } from 'components/form';

const { Option } = Select;

function mapStateToProps(state) {
  return { data: state.settings.departmentFormData };
}

class DepartmentForm extends ModalForm {
  static propTypes = {
    ...ModalForm.propTypes,
    data: PropTypes.shape({
      members: PropTypes.arrayOf(PropTypes.object)
    })
  };

  validations = {
    name: 'presence'
  };

  $render($) {
    const { members } = this.props.data;

    return (
      <div id={ this.componentName }>
        <Input { ...$('name') } label="Department Name" className="mb-20" labelClassName="required mb-5" />
        <Select
          { ...$('memberPks') }
          mode="multiple"
          placeholder="Please select employees"
          label="Assign Employees to the Selected Department"
          labelClassName="mb-5"
          filterOption={ Select.caseInsensitiveFilter }
          containerId={ this.componentName }
        >
          { members.map(member =>
              <Option key={ member.id }>{ `${member.firstName} ${member.lastName}` }</Option>
          ) }
        </Select>
      </div>
    );
  }
}

export default connect(mapStateToProps)(DepartmentForm);
