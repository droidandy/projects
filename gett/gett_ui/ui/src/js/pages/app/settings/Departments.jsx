import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { bindModalState } from 'components/form';
import { DepartmentForm } from './components';
import { ButtonIcon, ButtonEdit, notification, confirm } from 'components';
import dispatchers from 'js/redux/app/settings.dispatchers';

function mapStateToProps(state) {
  return {
    departments: state.settings.departments,
    formData: state.settings.departmentFormData
  };
}

class Departments extends PureComponent {
  static propTypes = {
    departments: PropTypes.arrayOf(PropTypes.object),
    formData: PropTypes.shape({
      members: PropTypes.arrayOf(PropTypes.object)
    }),
    getDepartments: PropTypes.func,
    getDepartmentFormData: PropTypes.func,
    saveDepartment: PropTypes.func,
    destroyDepartment: PropTypes.func
  };

  state = {
    sortOrder: 'ascend'
  };

  componentDidMount() {
    this.props.getDepartments();
  }

  showForm(record = {}) {
    this.setState({ formVisible: true, form: record });
  }

  getFormData = () => {
    this.props.getDepartmentFormData(this.state.form.id)
      .then(record => this.setState({ form: record }));
  };

  saveForm = (record, form) => {
    this.props.saveDepartment(record)
      .then(this.closeForm)
      .then(() => notification.success(`Department has been ${record.id ? 'updated' : 'created'}`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: {} });
  };

  destroyRecord(record) {
    const { id, name } = record;

    confirm({
      title: `Delete Department ${name}?`,
      content: `The Department field will be cleared for all users who is in "${name}" Department. Are you sure?`,
      onOk: () => {
        this.props.destroyDepartment(id)
          .then(() => notification.success('Department has been deleted'));
      }
    });
  }

  onTableChange = (_pagination, _filters, { order }) => {
    if (order) {
      this.setState({ sortOrder: order });
    }
  };

  render() {
    const { departments } = this.props;
    const { form, sortOrder } = this.state;

    return (
      <Fragment>
        <div className="layout horizontal center mb-30">
          <div className="page-title flex">Departments</div>
          <ButtonIcon type="primary" onClick={ () => this.showForm() } icon="Add">
            Add New Department
          </ButtonIcon>
        </div>

        <Table
          className="sm-mt-20"
          rowKey="id"
          dataSource={ departments }
          locale={ { emptyText: 'You don\'t have any departments set' } }
          onChange={ this.onTableChange }
          columns={ [
            { title: 'Department',
              dataIndex: 'name',
              key: 'name',
              width: '70%',
              sortOrder,
              sorter: (a, b) => a.name.localeCompare(b.name) },
            { title: 'Edit',
              width: '30%',
              render: record => (
                <div>
                  <ButtonEdit
                    className="mr-10 xs-mb-10"
                    type="secondary"
                    size="small"
                    onClick={ () => this.showForm(record) }
                  >
                    Edit
                  </ButtonEdit>
                  <ButtonEdit
                    type="danger"
                    size="small"
                    onClick={ () => this.destroyRecord(record) }
                  >
                    Delete
                  </ButtonEdit>
                </div>
              )
            }
          ] }
        />

        <DepartmentForm
          { ...bindModalState(this) }
          width={ 720 }
          title={ form && form.id ? `Edit Department #${form.id}` : 'New Department' }
          onOpen={ this.getFormData }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Departments);
