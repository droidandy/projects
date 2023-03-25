import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Dropdown, Menu } from 'antd';
import { Phone } from 'components';
import { bindModalState } from 'components/form';
import { WorkRoleForm } from './components';
import { Button, ButtonIcon, notification, confirm } from 'components';
import dispatchers from 'js/redux/app/settings.dispatchers';

const locale = { emptyText: 'You don\'t have any user roles set.' };

function mapStateToProps(state) {
  return { workRoles: state.settings.workRoles };
}

class WorkRoles extends PureComponent {
  static propTypes = {
    workRoles: PropTypes.arrayOf(PropTypes.object),
    getWorkRoles: PropTypes.func,
    getWorkRoleFormData: PropTypes.func,
    saveWorkRole: PropTypes.func,
    destroyWorkRole: PropTypes.func
  };

  state = {
    sortOrder: 'ascend'
  };

  componentDidMount() {
    this.props.getWorkRoles();
  }

  showForm(record = {}) {
    this.setState({ formVisible: true, form: record });
  }

  getFormData = () => {
    this.props.getWorkRoleFormData(this.state.form.id)
      .then(record => this.setState({ form: record }));
  };

  saveForm = (record, form) => {
    this.props.saveWorkRole(record)
      .then(this.closeForm)
      .then(() => notification.success(`Work Role has been ${record.id ? 'updated' : 'created'}`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  closeForm = () => {
    this.setState({ formVisible: false, form: {} });
  };

  destroyRecord(record) {
    const { id, name } = record;

    confirm({
      title: `Delete Work Role ${name}`,
      content: `The Work Role field will be cleared for all users who has "${name}" Work Role. Are you sure?`,
      onOk: () => {
        this.props.destroyWorkRole(id)
          .then(() => notification.success('Work Role has been deleted'));
      }
    });
  }

  onTableChange = (_pagination, _filters, { order }) => {
    if (order) {
      this.setState({ sortOrder: order });
    }
  };

  dropdownMenu = record => (
    <Menu>
      <Menu.Item key="menuShowForm">
        <a onClick={ () => this.showForm(record) }>
          Edit
        </a>
      </Menu.Item>
      <Menu.Item key="menuDeleteNotification">
        <a onClick={ () => this.destroyRecord(record) }>
          Delete
        </a>
      </Menu.Item>
    </Menu>
  )

  render() {
    const { workRoles } = this.props;
    const { form } = this.state;

    return (
      <Fragment>
        <div className="layout horizontal center mb-30">
          <div className="page-title flex">Roles</div>
          <ButtonIcon type="primary" onClick={ () => this.showForm() } icon="Add" >
            <span>Create role</span>
          </ButtonIcon>
        </div>

        <Table
          className="sm-mt-20"
          rowKey="id"
          locale={ locale }
          dataSource={ workRoles }
          onChange={ this.onTableChange }
          columns={ [
            { title: 'Role', dataIndex: 'name', key: 'name', width: '50%' },
            { width: '50%',
              render: record => (
                <div className="text-right">
                  <Phone>
                    { match => (
                      match
                        ? <Dropdown
                            overlay={ this.dropdownMenu(record) }
                            trigger={ ['click'] }
                            placement="bottomRight"
                          >
                            <a className="dots-dropdown-trigger" href="#">...</a>
                          </Dropdown>
                        : <Fragment>
                            <Button
                              className="mr-10"
                              type="secondary"
                              onClick={ () => this.showForm(record) }
                            >
                              Edit
                            </Button>
                            <Button
                              type="danger"
                              onClick={ () => this.destroyRecord(record) }
                            >
                              Delete
                            </Button>
                          </Fragment>
                    )}
                  </Phone>
                </div>
              )
            }
          ] }
        />

        <WorkRoleForm
          { ...bindModalState(this) }
          width={ 720 }
          title={ form && form.id ? `Edit Work Role #${form.id}` : 'New Work Role' }
          onOpen={ this.getFormData }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(WorkRoles);
