import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Button, message, Table, Dropdown } from 'antd';
import { Icon, ActionMenu } from 'components';
import { bindModalState } from 'components/form';
import UserForm from './components/UserForm';
import dispatchers from 'js/redux/app/users.dispatchers';
import { strFilter } from 'utils';
import upperFirst from 'lodash/upperFirst';
import sortBy from 'lodash/sortBy';
import every from 'lodash/every';

const { Item } = ActionMenu;

function mapStateToProps(state) {
  return {
    ...state.users,
    currentUserRole: state.settings.role,
    currentUserId: state.settings.id
  };
}

const DEFAULT_SORTER = {
  field: 'id',
  order: 'descend'
};

class Users extends PureComponent {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object),
    currentUserRole: PropTypes.string,
    currentUserId: PropTypes.number,
    getUsers: PropTypes.func,
    saveUser: PropTypes.func,
    destroyUser: PropTypes.func
  };

  state = {
    searchValue: '',
    filters: {},
    sorter: DEFAULT_SORTER
  };

  componentDidMount() {
    this.props.getUsers();
  }

  onSearch = (event) => {
    const searchValue = event.target.value;

    this.setState({ searchValue });
  };

  onEdit = (userId) => {
    this.setState({ formVisible: true, form: this.props.users.find(u => u.id === userId) });
  };

  saveForm = (user, form) => {
    const { saveUser, getUsers } = this.props;

    saveUser(user)
      .then(this.closeForm)
      .then(getUsers)
      .then(() => message.success(`${upperFirst(user.role)} has been ${user.id ? 'updated' : 'created'}`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  showForm = () => {
    this.setState({
      formVisible: true,
      form: {
        active: true,
        role: 'admin'
      }
    });
  };

  closeForm = () => {
    this.setState({ formVisible: false });
  };

  toggleUserActivation = (user) => {
    const nextState = !user.active;
    this.props.saveUser({ ...user, active: nextState })
      .then(() => message.success(`${user.firstName} ${user.lastName} has been ${nextState ? 'activated' : 'deactivated'}`));
  };

  onTableChange = (_, filters, sorter) => {
    this.setState({ filters, sorter });
  };

  get filteredUsers() {
    const { searchValue, filters } = this.state;
    return this.props.users.filter(u =>
      strFilter(u.firstName + u.lastName + u.phone + u.email, searchValue) &&
      every(filters, (v, k) => v.includes(u[k]) || v.length === 0)
    );
  }

  get sortedUsers() {
    const { field, order } = Object.keys(this.state.sorter).length ? this.state.sorter : DEFAULT_SORTER;
    let sortedUsers = sortBy(this.filteredUsers, field);
    if (order === 'ascend') { sortedUsers.reverse(); }
    return sortedUsers;
  }

  get isAdmin() {
    return this.props.currentUserRole === 'admin';
  }

  get canEditRole() {
    return this.isAdmin && this.props.users.filter(u => u.role === 'admin').length > 1;
  }

  render() {
    const actionsFor = user => (
      <ActionMenu>
        <Item onClick={ () => this.onEdit(user.id) }>Edit</Item>
        { this.isAdmin &&
          <Item onClick={ () => this.toggleUserActivation(user) }>{ user.active ? 'Deactivate' : 'Activate' }</Item>
        }
      </ActionMenu>
    );

    return (
      <div className="p-20 sm-p-10">
        <div className="layout horizontal justified mb-10">
          <Input.Search
            style={ { width: 320 } }
            placeholder="Search users by name, email or phone..."
            value={ this.state.searchValue }
            onChange={ this.onSearch }
          />
          { this.isAdmin &&
            <Button type="primary" onClick={ this.showForm }>
              <Icon className="text-20 mr-10" icon="MdAddCircle" />
              Create New Staff
            </Button>
          }
        </div>
        <Table
          rowKey="id"
          dataSource={ this.sortedUsers }
          onChange={ this.onTableChange }
          columns={ [
            { title: 'ID', dataIndex: 'id', width: '5%', sorter: true },
            { title: 'Name', dataIndex: 'firstName', width: '20%', sorter: true },
            { title: 'Surname', dataIndex: 'lastName', width: '20%', sorter: true },
            { title: 'Role', dataIndex: 'role', width: '10%', filterMultiple: false, filters: [
              { text: 'Admin', value: 'admin' },
              { text: 'User', value: 'user' },
              { text: 'Finance', value: 'finance' }
            ] },
            { title: 'Phone', dataIndex: 'phone', width: '20%', sorter: true },
            { title: 'Email', dataIndex: 'email', width: '25%', sorter: true },
            { title: 'Actions', render: user => (
              <div className="text-center">
                <Dropdown className="text-center" overlay={ actionsFor(user) } trigger={ ['click'] }>
                  <Icon icon="MdMoreVert" className="text-22 pointer" />
                </Dropdown>
              </div>
            ) }
          ] }
        />

        <UserForm
          { ...bindModalState(this) }
          width={ 720 }
          currentUserId={ this.props.currentUserId }
          canEditRole={ this.canEditRole }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Users);
