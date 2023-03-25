import React from 'react';
import { connect } from 'react-redux';
import { Desktop } from 'components';
import BaseBookingsList from 'pages/shared/bookings/BookingsList';
import { bookingStatuses, companyTypes, statusLabels } from 'pages/shared/bookings/data';
import { upperFirst, isEmpty, find } from 'lodash';
import { subscribe } from 'utils';

import dispatchers from 'js/redux/admin/bookings.dispatchers';

import CN from 'classnames';
import css from 'pages/shared/bookings/style.css';

function mapStateToProps(state, { match: { params: { id } } }) {
  return {
    ...state.bookings.list,
    bookingsChannel: state.app.session.bookingsChannel,
    can: state.app.session.can,
    expandedId: +id
  };
}

const filters = ['active', 'future', 'completed', 'affiliate', 'enterprise', 'all', 'alert', 'critical'];
const reversedOrderFilters = ['completed', 'affiliate', 'enterprise', 'all'];

class BookingsList extends BaseBookingsList {
  static defaultProps = {
    ...BaseBookingsList.defaultProps,
    defaultStatuses: bookingStatuses.all
  };

  isAdminPage = true;

  state = { ...this.state, currentTab: 'all' };

  getSearchPlaceholder() {
    return 'Search bookings by company name, passenger or order ID...';
  }

  isFilterActive(value) {
    return this.state.currentTab === value;
  }

  handleFilterChange(filter) {
    const { getBookings, query } = this.props;
    const companyType = find(companyTypes, t => t === filter);
    const withAlerts = filter === 'alert';
    const critical = filter === 'critical';

    const nextQuery = {
      ...query,
      companyType,
      withAlerts,
      critical,
      status: bookingStatuses[filter] || [],
      page: 1,
      order: 'scheduledAt',
      reverse: reversedOrderFilters.includes(filter) || null
    };

    this.setState({ currentTab: filter, companyType, statusFilters: [] }, () => {
      getBookings(nextQuery, true, true);
      this.table.dropSort();
    });
  }

  getDefaultOrder() {
    return {
      order: 'scheduledAt',
      reverse: this.props.query.reverse
    };
  }

  getFilterCount(filter) {
    const { counts } = this.props;
    return filter in counts ? `(${counts[filter]})` : '';
  }

  getStatusFilterOptions() {
    return bookingStatuses[this.state.currentTab].map(status => ({ value: status, text: statusLabels[status] }));
  }

  getStatusQuery(filterStatus) {
    return isEmpty(filterStatus) ? bookingStatuses[this.state.currentTab] : filterStatus;
  }

  renderFilterBtns() {
    return (
      <Desktop>
        <div className={ CN('layout horizontal center-center mb-20 contentContainer', css.filterContainer) } data-name="bookingTabs">
          { filters.map(f => (
              <div
                key={ f }
                className={ CN('medium-grey-text layout horizontal center-center relative pointer', css.filterItem, { [css.active]: this.isFilterActive(f) }) }
                onClick={ () => this.handleFilterChange(f) }
                data-name={ f }
              >
                { upperFirst(f) }{ this.getFilterCount(f) }
              </div>
            ))
          }
        </div>
      </Desktop>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(
  subscribe('bookingsChannel', 'handleBookingUpdate')(BookingsList)
);
