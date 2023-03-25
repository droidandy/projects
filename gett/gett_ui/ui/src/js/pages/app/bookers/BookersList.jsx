import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ResponsiveTable, ButtonLink, Search, Phone, Button, ButtonLinkAdd, Icon, PhoneNumber, notification } from 'components';
import BookerDetails from './components/BookerDetails';
import debounce from 'lodash/debounce';
import { urlFor, withoutPropagation } from 'utils';
import { roleNameToLabel } from 'utils/labels';
import { compact } from 'lodash';
import CN from 'classnames';
import dispatchers from 'js/redux/app/bookers.dispatchers';

import css from './components/style.css';

const searchDebounce = 300;

function mapStateToProps(state) {
  return {
    ...state.bookers.list,
    currentMemberId: state.session.memberId,
    isAffiliate: state.session.isAffiliate,
    isBbc: state.session.isBbc
  };
}

class BookersList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object,
    query: PropTypes.object,
    can: PropTypes.object,
    currentMemberId: PropTypes.number,
    isAffiliate: PropTypes.bool,
    isBbc: PropTypes.bool,
    getBookers: PropTypes.func,
    saveBooker: PropTypes.func,
    toggleCurrentMemberBooker: PropTypes.func
  };

  state = { search: this.props.query.search };

  componentDidMount() {
    const { getBookers, query } = this.props;

    getBookers(query);

    this.searchBookers = debounce(() => {
      getBookers({ ...this.props.query, page: 1, search: this.state.search });
    }, searchDebounce);
  }

  expandRow = (booker) => {
    const { expandedId } = this.state;

    if (!booker.can.beExpanded) { return; }

    this.setState({ expandedId: expandedId === booker.id ? null : booker.id });
  };

  onTableChange = (pagination, filters, sorter) => {
    const { query: { search }, getBookers } = this.props;
    const query = { page: pagination.current, search };

    if (filters.roleType) { query.role = filters.roleType; }
    if (sorter.field) { query.order = sorter.field; }
    if (sorter.order === 'descend') { query.reverse = true; }

    getBookers(query);
  };

  onSearch = (value) => {
    this.setState({ search: value }, this.searchBookers);
  };

  toggleCurrentMemberBooker = (bookerId) => {
    this.props.toggleCurrentMemberBooker(bookerId)
      .then(booker => notification.success(
        `${booker.isBookerForCurrentMember ? 'Added' : 'Removed'} ${booker.firstName} ${booker.lastName} successfully!`
      ));
  };

  renderToggleCurrentMemberBookerButton = (booker) => {
    if (booker.id === this.props.currentMemberId) return null;

    return (
      <Button type="primary" className="w-150 text-uppercase" onClick={ withoutPropagation(this.toggleCurrentMemberBooker, booker.id) }>
        { booker.isBookerForCurrentMember ? 'Remove' : 'Make Booker' }
      </Button>
    );
  };

  render() {
    const { pagination, items, can, isAffiliate, isBbc } = this.props;
    const { expandedId, search } = this.state;

    return (
      <Fragment>
        <Phone>
          { matches => (
            <div className="layout horizontal sm-wrap mb-20">
              <div className="page-title mr-10 flex">Bookers</div>
              <div className={ css.w360 }>
                <Search
                  placeholder="Search bookers by name, email or phone..."
                  value={ search }
                  onChange={ this.onSearch }
                  name="searchBooker"
                />
              </div>
              <div className={ CN('layout horizontal m-0 justified-end', css.exportBtnWrapper) }>
                { can.exportBookers &&
                  <ButtonLink
                    className={ CN('mr-10', { [css.exportBtn]: matches }) }
                    type="secondary"
                    onClick={ urlFor.download('/api/bookers/export') }
                  >
                    <Icon className={ CN('text-18', { 'mr-10': !matches }) } icon="MdFileDownload" />
                    { !matches && 'Export' }
                  </ButtonLink>
                }
                { can.addBooker &&
                  <ButtonLinkAdd to="/bookers/new" value="Create new booker/admin" />
                }
              </div>
            </div>
          ) }
        </Phone>
        <ResponsiveTable
          className="table-expandable"
          rowKey="id"
          dataSource={ items }
          pagination={ pagination }
          onChange={ this.onTableChange }
          onRow={ booker => ({ onClick: () => this.expandRow(booker) }) }
          rowClassName={ record => expandedId == record.id ? 'expanded-parent-highlight' : '' }
          expandedRowKeys={ expandedId ? [expandedId] : [] }
          expandedRowRender={ booker => <BookerDetails booker={ booker } /> }
          columns={ compact([
            { title: 'First Name', dataIndex: 'firstName', width: '20%', sorter: true },
            { title: 'Last Name', dataIndex: 'lastName', width: '20%', sorter: true },
            { title: 'Role',
              dataIndex: 'roleType',
              width: '10%',
              render: roleNameToLabel,
              filterIcon: <Icon icon="Filter" />,
              filters: isAffiliate
                ? [ { text: roleNameToLabel('admin'), value: 'admin' },
                    { text: roleNameToLabel('booker'), value: 'booker' }
                  ]
                : [ { text: roleNameToLabel('admin'), value: 'admin' },
                    { text: roleNameToLabel('booker'), value: 'booker' },
                    { text: roleNameToLabel('finance'), value: 'finance' },
                    { text: roleNameToLabel('travelmanager'), value: 'travelmanager'}
                  ]
            },
            { title: 'Phone', dataIndex: 'phone', width: '25%', sorter: true, render: phone => <PhoneNumber phone={ phone } /> },
            { title: 'Email', dataIndex: 'email', width: '25%', sorter: true },
            isBbc && { render: this.renderToggleCurrentMemberBookerButton }
          ]) }
          mobileColumns={ [
            { title: 'First Name', dataIndex: 'firstName', width: '33%', sorter: true },
            { title: 'Last Name', dataIndex: 'lastName', width: '33%', sorter: true },
            { title: 'Phone', dataIndex: 'phone', width: '33%', sorter: true, render: phone => <PhoneNumber phone={ phone } /> }
          ] }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(BookersList);
