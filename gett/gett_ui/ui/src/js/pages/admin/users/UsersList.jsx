import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import { ResponsiveTable, Icon, ButtonLink, ActionMenu, Search } from 'components';
import { debounce, startCase } from 'lodash';
import dispatchers from 'js/redux/admin/users.dispatchers';

import css from './components/style.css';

const { Item } = ActionMenu;
const searchDebounce = 300;

function mapStateToProps(state) {
  return state.users.list;
}

class UsersList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    can: PropTypes.object,
    pagination: PropTypes.object,
    query: PropTypes.object,
    getUsers: PropTypes.func
  };

  state = { search: this.props.query.search };

  componentDidMount() {
    const { getUsers, query } = this.props;

    getUsers(query);

    this.searchPassengers = debounce(() => {
      getUsers({ ...this.props.query, page: 1, search: this.state.search });
    }, searchDebounce);
  }

  onTableChange = (pagination, filters, sorter) => {
    const { query: { search }, getUsers } = this.props;
    const query = { page: pagination.current, search };

    if (filters.roleType) { query.role = filters.roleType; }
    if (sorter.field) { query.order = sorter.field; }
    if (sorter.order === 'descend') { query.reverse = true; }

    getUsers(query);
  };

  onSearch = (value) => {
    this.setState({ search: value }, this.searchPassengers);
  };

  render() {
    const { pagination, items, can } = this.props;

    const actionsFor = user => (
      <ActionMenu>
        <Item><Link to={ `/users/admins/${user.id}/edit` }>Edit</Link></Item>
      </ActionMenu>
    );
    const columns = [
      { title: 'Role', dataIndex: 'userRoleName', width: '10%', sorter: true, render: (_, record) => startCase(record.userRoleName) },
      { title: 'Name', dataIndex: 'firstName', width: '25%', sorter: true },
      { title: 'Surname', dataIndex: 'lastName', width: '25%', sorter: true },
      { title: 'Email', dataIndex: 'email', width: '30%', sorter: true }
    ];
    const mobileColumns = [
      { title: 'Details',
        key: 'details',
        render: record => (
          <div>
            <div className="mb-5">
              <span className="bold-text mr-5">Name:</span>
              { record.firstName }
            </div>
            <div className="mb-5">
              <span className="bold-text mr-5">Surname:</span>
              { record.lastName }
            </div>
            <div className="mb-5">
              <span className="bold-text mr-5">Email:</span>
              { record.email }
            </div>
          </div>
        )
      }
    ];
    const actionsColumn = {
      title: 'Actions',
      render: user => (
        <Dropdown overlay={ actionsFor(user) } trigger={ ['click'] }>
          <Icon icon="MdMoreVert" className="text-22 pointer" />
        </Dropdown>
      )
    };

    return (
      <Fragment>
        <div className="layout horizontal center xs-wrap mb-30">
          <div className="page-title flex xs-order-1">Gett Users</div>
          <Search
            placeholder="Search users by name or email..."
            value={ this.state.search }
            onChange={ this.onSearch }
            className={ `mr-20 xs-full-width xs-order-3 xs-mt-10 ${css.w360}` }
          />
          { can.createUser &&
            <ButtonLink type="primary" to="/users/admins/new" className="xs-order-2">
              <Icon className="text-20 mr-10" icon="MdAddCircle" />
              Create New User
            </ButtonLink>
          }
        </div>

        <ResponsiveTable
          className="table-expandable"
          rowKey="id"
          dataSource={ items }
          pagination={ pagination }
          onChange={ this.onTableChange }
          columns={ can.editGettUsers ? columns.concat(actionsColumn) : columns }
          mobileColumns={ can.editGettUsers ? mobileColumns.concat(actionsColumn) : mobileColumns }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(UsersList);
