import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, Tag } from 'antd';
import { ResponsiveTable, Icon, ActionMenu, Search, notification, CompanyType } from 'components';
import { bindModalState } from 'components/form';
import { PasswordForm, PassengerDetails, MemberComments } from './components';
import { debounce } from 'lodash';
import dispatchers from 'js/redux/admin/members.dispatchers';
import { roleNameToLabel } from 'utils/labels';

import css from './components/style.css';

const { Item } = ActionMenu;
const searchDebounce = 300;

function mapStateToProps(state) {
  return state.members.list;
}

class MembersList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object,
    query: PropTypes.object,
    getMembers: PropTypes.func,
    savePassword: PropTypes.func
  };

  state = {
    search: this.props.query.search,
    memberId: undefined,
    commentsVisible: false
  };

  componentDidMount() {
    const { getMembers, query } = this.props;

    getMembers(query);

    this.searchMembers = debounce(() => {
      getMembers({ ...this.props.query, page: 1, search: this.state.search });
    }, searchDebounce);
  }

  onTableChange = (pagination, filters, sorter) => {
    const { query: { search }, getMembers } = this.props;
    const query = { page: pagination.current, search };

    if (filters.memberRoleName) { query.memberRoleName = filters.memberRoleName; }
    if (filters.companyType) { query.companyType = filters.companyType; }
    if (sorter.field) { query.order = sorter.field; }
    if (sorter.order === 'descend') { query.reverse = true; }

    getMembers(query);
  };

  onSearch = (value) => {
    this.setState({ search: value }, this.searchMembers);
  };

  expandRow = ({ id }) => {
    this.setState(state => ({ expandedId: state.expandedId === id ? null : id }));
  };

  showPasswordForm(id) {
    this.setState({ passwordFormVisible: true, passwordForm: { id } });
  }

  closePasswordForm = () => {
    this.setState({ passwordFormVisible: false });
  };

  savePassword = (data, form) => {
    this.props.savePassword(data)
      .then(this.closePasswordForm)
      .then(() => notification.success('Password has been saved'))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  toggleComments = (memberId) => {
    this.setState(state => ({
      memberId,
      commentsVisible: !state.commentsVisible
    }));
  };

  render() {
    const { pagination, items } = this.props;
    const { memberId, expandedId, commentsVisible } = this.state;

    const actionsFor = user => (
      <ActionMenu>
        <Item><Link to={ `/users/members/${user.id}/edit` }>Edit</Link></Item>
        <Item onClick={ () => this.showPasswordForm(user.id) }>Set Password</Item>
        <Item onClick={ () => this.toggleComments(user.id) }>
          Comments
          { user.commentsCount > 0 &&
            <div className={ css.commentsCount }>{ user.commentsCount }</div>
          }
        </Item>
      </ActionMenu>
    );

    return (
      <Fragment>
        <div className="layout horizontal center wrap mb-30">
          <div className="page-title flex">All Users</div>
          <Search
            className={ css.w360 }
            placeholder="Search users by name, email, or company name..."
            value={ this.state.search }
            onChange={ this.onSearch }
            name="searchMember"
          />
        </div>

        <ResponsiveTable
          className="table-expandable"
          rowKey="id"
          dataSource={ items }
          pagination={ pagination }
          onRow={ (company) => { return { onClick: () => this.expandRow(company) }; } }
          rowClassName={ record => expandedId == record.id ? 'expanded-parent-highlight' : '' }
          expandedRowRender={ member => <PassengerDetails editPath="/users/members" passenger={ member } /> }
          expandedRowKeys={ expandedId ? [expandedId] : [] }
          onChange={ this.onTableChange }
          columns={ [
            { title: 'Company Name', dataIndex: 'companyName', width: '10%', sorter: true },
            { title: 'Type', sorter: true, filterIcon: <Icon icon="Filter" />, dataIndex: 'companyType', width: '5%', filters: [
              { text: 'Enterprise', value: 'enterprise' },
              { text: 'Affiliate', value: 'affiliate' },
              { text: 'BBC', value: 'bbc' }
            ], render: CompanyType
            },
            { title: 'Role', dataIndex: 'memberRoleName', filterIcon: <Icon icon="Filter" />, width: '10%', filters: [
              { text: roleNameToLabel('admin'), value: 'admin' },
              { text: roleNameToLabel('booker'), value: 'booker' },
              { text: roleNameToLabel('finance'), value: 'finance' },
              { text: roleNameToLabel('travelmanager'), value: 'travelmanager' },
              { text: roleNameToLabel('passenger'), value: 'passenger' }
            ], render: roleNameToLabel },
            { title: 'Name', dataIndex: 'firstName', width: '15%', sorter: true },
            { title: 'Surname', dataIndex: 'lastName', width: '15%', sorter: true },
            { title: 'Email', dataIndex: 'email', width: '15%', sorter: true },
            { title: 'VIP', dataIndex: 'vip', width: '15%', render: vip => (
              vip && <Tag color="orange">VIP</Tag>
            ) },
            { title: 'Last Login Time', sorter: true, dataIndex: 'lastLoggedInAt', width: '10%' },
            { title: 'Login Count', sorter: true, dataIndex: 'loginCount', width: '5%' },
            { title: 'Actions', width: '5%', render: user => (
              <Dropdown overlay={ actionsFor(user) } trigger={ ['click'] }>
                <Icon icon="MdMoreVert" className="text-22 pointer" />
              </Dropdown>
            ) }
          ] }
          mobileColumns={ [
            { title: 'Details',
              key: 'details',
              render: record => (
                <div>
                  <div className="mb-5">
                    <span className="bold-text mr-5">Company Name:</span>
                    { record.companyName }
                  </div>
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
            },
            { title: 'Actions', render: user => (
              <Dropdown overlay={ actionsFor(user) } trigger={ ['click'] }>
                <Icon icon="MdMoreVert" className="text-22 pointer" />
              </Dropdown>
            ) }
          ] }
        />
        <PasswordForm
          { ...bindModalState(this, 'passwordForm') }
          title="Set Password"
          width={ 400 }
          onRequestSave={ this.savePassword }
          onRequestClose={ this.closePasswordForm }
        />
        <MemberComments memberId={ memberId } visible={ commentsVisible } onClose={ this.toggleComments } />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(MembersList);
