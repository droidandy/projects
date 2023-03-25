import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip, Dropdown } from 'antd';
import MediaQuery from 'react-responsive';
import { ResponsiveTable, ButtonLink, ActionMenu, ButtonLinkAdd, Avatar, Search, Button, ButtonIcon, PhoneNumber, notification, confirm } from 'components';
import PassengerDetails from './components/PassengerDetails';
import ImportUsersPopup from './components/ImportUsersPopup';
import { compact, debounce } from 'lodash';
import { withoutPropagation, urlFor } from 'utils';
import dispatchers from 'js/redux/app/passengers.dispatchers';

import css from './components/style.css';

const phoneBreakpoint = 768;
const searchDebounce = 300;
const { Item } = ActionMenu;

function mapStateToProps(state) {
  return {
    ...state.passengers.list,
    isBbc: state.session.isBbc,
    currentMemberId: state.session.memberId
  };
}

class PassengersTable extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object,
    query: PropTypes.object,
    can: PropTypes.object,
    statistics: PropTypes.object,
    getPassengers: PropTypes.func,
    inviteAll: PropTypes.func,
    isBbc: PropTypes.bool,
    toggleCurrentMemberPassenger: PropTypes.func,
    currentMemberId: PropTypes.number
  };

  state = {
    search: this.props.query.search,
    loading: false
  };

  componentDidMount() {
    const { getPassengers, query } = this.props;

    getPassengers(query);

    this.searchPassengers = debounce(() => {
      getPassengers({ ...this.props.query, page: 1, search: this.state.search });
    }, searchDebounce);
  }

  setPopupRef = popup => this.popup = popup;

  openImportPopup = () => {
    this.popup.open();
  };

  reloadPassengers = () => {
    this.props.getPassengers(this.props.query);
  };

  confirmInviteAll = () => {
    const { yetToInvite, total } = this.props.statistics;

    confirm({
      title: 'Invite All?',
      content: `You are about to invite ${yetToInvite} out of ${total} company members. Proceed?`,
      autoFocusButton: null,
      onOk: this.inviteAll
    });
  };

  inviteAll = () => {
    this.setState({ loading: true });

    this.props.inviteAll()
      .then(({ invitedMembersCount, totalMembersCount }) => {
        this.setState({ loading: false });
        notification.success(`${invitedMembersCount} from ${totalMembersCount} users were successfully invited`);
      })
      .catch(() => {
        this.setState({ loading: false });
        notification.error('An error occurred while trying to invite all users');
      });
  };

  expandRow = (passenger) => {
    const { expandedId } = this.state;

    if (!passenger.can.beExpanded) { return; }

    this.setState({ expandedId: expandedId === passenger.id ? null : passenger.id });
  };

  onTableChange = (pagination, filters, sorter) => {
    const { query: { search }, getPassengers } = this.props;
    const query = { page: pagination.current, search };

    if (filters.roleType) { query.role = filters.roleType; }
    if (sorter.field) { query.order = sorter.field; }
    if (sorter.order === 'descend') { query.reverse = true; }

    getPassengers(query);
  };

  onSearch = (value) => {
    this.setState({ search: value }, this.searchPassengers);
  };

  contactLinkHandler = (event, type, data) => {
    event.stopPropagation();

    window.location.href = `${type}:${data}`;
  };

  toggleCurrentMemberPassenger = (passengerId) => {
    this.props.toggleCurrentMemberPassenger(passengerId)
      .then(passenger => notification.success(
        `${passenger.isPassengerForCurrentMember ? 'Added' : 'Removed'} ${passenger.firstName} ${passenger.lastName} successfully!`
      ));
  };

  renderToggleCurrentMemberPassengerButton = (passenger) => {
    if (passenger.id === this.props.currentMemberId) return null;

    return (
      <Button type="primary" className="w-150 text-uppercase" onClick={ withoutPropagation(this.toggleCurrentMemberPassenger, passenger.id) }>
        { passenger.isPassengerForCurrentMember ? 'Remove' : 'Add to my list' }
      </Button>
    );
  };

  renderEmailLink = (email) => {
    return <span onClick={ event => this.contactLinkHandler(event, 'mailto', email) } className="underline">{ email } </span>;
  };

  renderPhoneLink = (phone) => {
    return <PhoneNumber phone={ phone } onClick={ event => this.contactLinkHandler(event, 'tel', phone) } className="underline" />;
  };

  renderActionMenu(can) {
    return (
      <ActionMenu>
        { can.inviteAllPassengers &&
          <Item onClick={ this.confirmInviteAll }>
            Invite All
          </Item>
        }
        { can.exportPassengers &&
          <Item onClick={ urlFor.download('/api/passengers/export') }>
            Export
          </Item>
        }
        { can.importPassengers && [
          <Item onClick={ this.openImportPopup } key="link">
            Import
          </Item>,
          <ImportUsersPopup ref={ this.setPopupRef } onClose={ this.reloadPassengers } key="popup" />
        ] }
      </ActionMenu>
    );
  }

  renderActionButtons(isPhone, can, loading) {
    return (
      isPhone ?
      <Fragment>
        { can.inviteAllPassengers &&
          <ButtonLink className="mr-10" type="secondary" onClick={ this.confirmInviteAll } loading={ loading }>
            Invite All
          </ButtonLink>
        }
        { can.exportPassengers &&
          <Tooltip title="Click here to download all of your passengers details.">
            <ButtonLink className="mr-10" type="secondary" onClick={ urlFor.download('/api/passengers/export') }>
              Export
            </ButtonLink>
          </Tooltip>
        }
        { can.importPassengers &&
          <Fragment>
            <Button type="secondary" className="mr-10" onClick={ this.openImportPopup } key="btn">
              Import
            </Button>
            <ImportUsersPopup ref={ this.setPopupRef } onClose={ this.reloadPassengers } key="popup" />
          </Fragment>
        }
      </Fragment>
      :
      <div className="mr-20">
        <Dropdown overlay={ this.renderActionMenu(can) } trigger={ ['click'] }>
          <ButtonIcon type="secondary" icon="Dots" className="text-24 pointer" iconClassName="dark-grey-text" />
        </Dropdown>
      </div>
    );
  }

  render() {
    const { pagination, items, can, statistics, isBbc } = this.props;
    const { search, loading } = this.state;
    const { expandedId } = this.state;
    const locale = { emptyText: search ? 'No results found' : 'You haven\'t added any passengers to your account yet' };

    return (
      <Fragment>
        <div className="mb-30 sm-mb-10 layout horizontal center">
          <div className="page-title flex">Passengers</div>
          <MediaQuery minWidth={ phoneBreakpoint } className="layout horizontal center">
            { isPhone => this.renderActionButtons(isPhone, can, loading) }
          </MediaQuery>
          { can.addPassenger &&
            <ButtonLinkAdd to="/passengers/new" value="New Passenger" />
          }
        </div>

        <div className="layout horizontal center justified wrap">
          <div className={ `mb-30 xs-mb-20 mr-20 sm-mr-0 ${css.searchWidth}` }>
            <Search
              placeholder="Search passengers by name, email or phone..."
              value={ search }
              onChange={ this.onSearch }
              data-name="searchPassenger"
            />
          </div>
          <MediaQuery minWidth={ phoneBreakpoint }>
            <div className="layout horizontal center bold-text mb-30">
              <div className="mr-40">
                <div className="text-20 grey-text">{ statistics.total }</div>
                <div className="text-12 medium-grey-text">Total passengers</div>
              </div>
              <div>
                <div className="text-20 grey-text">{ statistics.active }</div>
                <div className="text-12 medium-grey-text">Active passengers</div>
              </div>
            </div>
          </MediaQuery>
        </div>

        <ResponsiveTable
          className="table-expandable"
          rowKey="id"
          locale={ locale }
          dataSource={ items }
          pagination={ pagination }
          onChange={ this.onTableChange }
          onRow={ passenger => ({ onClick: () => this.expandRow(passenger) }) }
          rowClassName={ record => expandedId == record.id ? 'expanded-parent-highlight' : '' }
          expandedRowKeys={ expandedId ? [expandedId] : [] }
          expandedRowRender={ passenger => <PassengerDetails editPath="/passengers" passenger={ passenger } /> }
          columns={ compact([
            { dataIndex: 'avatarUrl', width: '5%', render: (avatarUrl, passenger) => <Avatar size={ 40 } src={ avatarUrl } name={ `${passenger.firstName} ${passenger.lastName}` } /> },
            { title: 'First Name', dataIndex: 'firstName', width: '20%', sorter: true },
            { title: 'Last Name', dataIndex: 'lastName', width: '20%', sorter: true },
            { title: 'Phone', dataIndex: 'phone', width: '30%', sorter: true, render: this.renderPhoneLink },
            { title: 'Email', dataIndex: 'email', width: '25%', sorter: true, render: this.renderEmailLink },
            isBbc && can.havePassenger && { render: this.renderToggleCurrentMemberPassengerButton }
          ]) }
          mobileColumns={ [
            { title: 'Details', key: 'details',
              render: passenger => (
                <div className="layout horizontal center mt-10 mb-10">
                  <Avatar
                    size={ 28 }
                    src={ passenger.avatarUrl }
                    name={ `${passenger.firstName} ${passenger.lastName}` }
                    className="mr-25 flex none"
                  />
                  <div className="flex">
                    <div className="layout horizontal center mb-5">
                      <div className="medium-grey-text bold-text text-12 w-70 flex none">First name:</div>
                      <div className="text-14 ml-10 flex">{ passenger.firstName }</div>
                    </div>
                    <div className="layout horizontal center mb-5">
                      <div className="medium-grey-text bold-text text-12 w-70 flex none">Last name:</div>
                      <div className="text-14 ml-10 flex">{ passenger.lastName }</div>
                    </div>
                    <div className="layout horizontal center mb-5">
                      <div className="medium-grey-text bold-text text-12 w-70 flex none">Phone:</div>
                      <div className="text-14 ml-10 flex">{ passenger.phone }</div>
                    </div>
                    <div className="layout horizontal center">
                      <div className="medium-grey-text bold-text text-12 w-70 flex none">Email:</div>
                      <div className="text-14 ml-10 flex">{ passenger.email }</div>
                    </div>
                  </div>
                </div>
              )
            }
          ] }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(PassengersTable);
