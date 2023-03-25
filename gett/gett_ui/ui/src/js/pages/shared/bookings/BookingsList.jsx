import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Checkbox, Tooltip, Spin, DatePicker, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import BookingTable from './components/BookingTable';
import { Button, ButtonLinkAdd, Desktop, Search, confirm, Icon } from 'components';
import { find, debounce, throttle, isEmpty, isEqual, without, map, xor } from 'lodash';
import { statusLabels, activeStatuses } from 'pages/shared/bookings/data';
import ExportReceipts from 'pages/shared/settings/components/ExportReceipts';
import moment from 'moment';
import { urlFor } from 'utils';

const searchDebounce = 300;
const getBookingsThrottle = 7500;

export default class BookingsList extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    isReportsPage: PropTypes.bool,
    bookingsChannel: PropTypes.string,
    loading: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.object),
    can: PropTypes.object,
    paymentMethods: PropTypes.arrayOf(PropTypes.string),
    pagination: PropTypes.object,
    getBookings: PropTypes.func,
    getBookingItem: PropTypes.func,
    query: PropTypes.object,
    defaultStatuses: PropTypes.array,
    emptyText: PropTypes.string,
    cancelBooking: PropTypes.func,
    clearAlert: PropTypes.func,
    getPricing: PropTypes.func,
    savePricing: PropTypes.func,
    expandedId: PropTypes.number,
    getComments: PropTypes.func,
    addComment: PropTypes.func,
    resendOrder: PropTypes.func,
    companies: PropTypes.array,
    getBooking: PropTypes.func,
    toggleCriticalFlag: PropTypes.func,
    vendorsList: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    defaultStatuses: activeStatuses,
    emptyText: 'You haven\'t got any bookings.'
  };

  state = {
    search: this.props.query.search,
    updatedBookings: [],
    paymentMethodFilters: [],
    statusFilters: [],
    labelFilters: [],
    vehicleTypeFilters: [],
    followUpdates: true,
    emptyText: this.props.query.search ? 'No results found' : this.props.emptyText,
    dateRangeFilter: {
      from: null,
      to: null
    }
  };

  componentDidMount() {
    const { getBookings, defaultStatuses, expandedId } = this.props;
    const { search } = this.state;
    const bookingId = isFinite(expandedId) ? expandedId : null;

    this.throttledGetBookings = throttle(this.getBookings, getBookingsThrottle, {
      leading: true,
      trailing: true
    });

    this.throttledGetBookings({
      page: bookingId ? 'auto' : 1,
      bookingId,
      search,
      status: defaultStatuses,
      ...this.getDefaultOrder()
    }, true);

    this.searchBookings = debounce(() => {
      const { search, followUpdates } = this.state;

      getBookings({ ...this.props.query, page: 1, search }, followUpdates, true);
    }, searchDebounce);
  }

  componentDidUpdate(prevProps, prevState) {
    const { dateRangeFilter, dateRangeFilter: { from, to } } = this.state;
    const { query } = this.props;

    if (from && to && !isEqual(prevState.dateRangeFilter, dateRangeFilter)) {
      this.getImmediateBookings({ ...query, from, to });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.throttledGetBookings.cancel();
  }

  isAdminPage = false;

  setTableRef = table => this.table = table;

  getDefaultOrder() {
    return {
      order: 'scheduledAt',
      reverse: this.props.isReportsPage || null
    };
  }

  getBookings = (query, setLoading) => {
    if (this.unmounted || this.filterDropdownVisible) return;

    query = query || this.props.query;

    const { followUpdates } = this.state;

    this.props.getBookings(query, followUpdates, setLoading)
      .then((resp) => {
        if (resp && xor(map(this.props.items, 'id'), map(resp.items, 'id')).length > 0) {
          this.setState({ hasUpdates: true });
        }
      });
  };

  getImmediateBookings(query) {
    clearTimeout(this.throttledGetBookingsTimeout);
    this.throttledGetBookings.cancel();

    this.props.getBookings(query, true, true)
      .then(() => this.setState({ hasUpdates: false }));
  }

  reloadBookingsList = () => {
    this.getImmediateBookings(this.props.query);
  };

  shouldPollBookings() {
    const { status = [] } = this.props.query;

    return status.includes('creating') || status.includes('order_received');
  }

  handleBookingUpdate({ bookingId, action, indicator }) {
    if (this.shouldPollBookings()) {
      this.throttledGetBookings();
    }

    if (action === 'created') return;

    const { items, getBookingItem, expandedId } = this.props;

    if (find(items, { id: bookingId })) {
      getBookingItem(bookingId)
        .then(() => {
          if (indicator && expandedId != bookingId && !this.unmounted) {
            this.setState({ updatedBookings: this.state.updatedBookings.concat(bookingId) });
          }
        });
    }
  }

  expandRow = (booking) => {
    const { expandedId, isReportsPage } = this.props;
    const { id } = booking;
    const { updatedBookings } = this.state;
    let nextUrl = isReportsPage ? '/reports/bookings' : '/bookings';
    if (expandedId !== id) {
      nextUrl = nextUrl + `/${id}`;
    }
    this.context.router.history.replace(nextUrl);
    this.setState({ updatedBookings: without(updatedBookings, id) });
  };

  onTableChange = (pagination, filters, sorter) => {
    const { query: prevQuery } = this.props;
    const query = { ...prevQuery, page: pagination.current };
    if (sorter.field) {
      query.order = sorter.field;
      query.reverse = sorter.order === 'descend' || null;
    } else {
      Object.assign(query, this.getDefaultOrder());
    }

    query.paymentMethod = filters.paymentMethod;
    query.status = this.getStatusQuery(filters.status);
    query.vehicleTypes = filters.vehicleType;
    query.labels = filters.labels;

    this.setState({
      paymentMethodFilters: filters.paymentMethod,
      statusFilters: filters.status,
      labelFilters: filters.labels,
      vehicleTypeFilters: filters.vehicleType,
      emptyText: 'No results found'
    });

    this.getImmediateBookings(query);
  };

  onDatesFilterChange = (_dates, [from, to]) => {
    this.setState({ dateRangeFilter: { from, to } });
  };

  getStatusQuery(statusFilter) {
    return isEmpty(statusFilter) ? this.props.defaultStatuses : statusFilter;
  }

  onSearch = (value) => {
    this.setState({
      search: value,
      emptyText: value ? 'No results found' : this.props.emptyText
    }, this.searchBookings);
  };

  getStatusFilterOptions() {
    return this.props.defaultStatuses.map(status => ({ value: status, text: statusLabels[status] }));
  }

  getStatusFilterOptions = this.getStatusFilterOptions.bind(this)

  onFilterDropdownVisibleChange = (visible) => {
    // need this to prevent interval bookings fetching so that
    // filters don't get inadvertently reset whilst the popup is open
    this.filterDropdownVisible = visible;

    if (!visible) {
      // a small (search debounce value is reused) timeout is applied here to prevent
      // possible double requests: one in this handler at line bellow, and second one
      // at the end of `onTableChange`, if filter popup was closed with values changed
      // in it, resulting in a new query that has to be applied immediately.
      this.throttledGetBookingsTimeout = setTimeout(this.throttledGetBookings, searchDebounce);
    }
  };

  getSearchPlaceholder() {
    return 'Search bookings by passenger or booking order ID...';
  }

  onFollowUpdatesChange = (e) => {
    this.setState({ followUpdates: e.target.checked });
  };

  cancelBooking = (id, params = {}) => {
    return this.props.cancelBooking(id, params);
  };

  clearAlert = (id, bookingId) => {
    return this.props.clearAlert(id, bookingId);
  };

  onCompanySelect = (companyId) => {
    const { getBookings, query } = this.props;

    getBookings({ ...query, companyId: companyId == query.companyId ? undefined : companyId }, true);
  };

  onFromDateChange = (date) => {
    this.setState({ from: date });
  };

  onToDateChange = (date) => {
    this.setState({ to: date });
  };

  chooseDateRange = () => {
    this.setState({ from: moment().subtract(1, 'month'), to: moment() }, () => {
      confirm({
        title: 'Select date range to export',
        content: this.renderDates(),
        cancelText: 'Cancel',
        okText: 'Export',
        width: 600,
        onOk: () => {
          const { from, to } = this.state;
          const url = `/api/bookings/export?from=${from.format('DD-MM-YYYY')}&to=${to.format('DD-MM-YYYY')}`;

          urlFor.download(url)();
        }
      });
    });
  };

  onSupplierSelect = (vendorName) => {
    const { getBookings, query } = this.props;

    getBookings({ ...query, vendorName: vendorName === query.vendorName ? undefined : vendorName }, true);
  };

  renderFilterBtns() {
    // overwritten in ui/src/js/pages/admin/bookings/BookingList.jsx
    return null;
  }

  renderSuffixIcon() {
    return <Icon className="datepicker-icon" icon="Calendar" />;
  }

  renderNewBookingBtn = () => {
    return <ButtonLinkAdd to="/bookings/new" value="New booking" />;
  };

  renderExportBtn = () => {
    return (
      <Desktop>
        <Button onClick={ this.chooseDateRange } type="secondary" className="mr-10">
          Export
        </Button>
      </Desktop>
    );
  };

  renderDates() {
    const { from, to } = this.state;

    return (
      <LocaleProvider locale={ enUS }>
        <div>
          <div className="text-14 mb-10">Select the date range for the bookings you would like to download and click 'export'. Booking data will be exported as a .CSV file</div>
          <DatePicker defaultValue={ from } onChange={ this.onFromDateChange } className="flex" allowClear={ false } suffixIcon={ this.renderSuffixIcon() } />
          <span className="m-15">-</span><DatePicker defaultValue={ to } onChange={ this.onToDateChange } className="flex" allowClear={ false } suffixIcon={ this.renderSuffixIcon() } />
        </div>
      </LocaleProvider>
    );
  }

  render() {
    const {
      pagination, items, paymentMethods, getPricing, savePricing, expandedId,
      getComments, addComment, clearAlert, cancelBooking, companies, vendorsList,
      resendOrder, can, loading, isReportsPage, query: { companyId, vendorName },
      getBooking, toggleCriticalFlag
    } = this.props;
    const {
      search, followUpdates, hasUpdates, paymentMethodFilters, updatedBookings,
      statusFilters, labelFilters, vehicleTypeFilters, emptyText
    } = this.state;

    return (
      <Fragment>
        <div className="layout horizontal center sm-wrap mb-30">
          <div className="layout horizontal center flex">
            <div className="page-title mr-40 xs-order-1">Bookings</div>
            { this.shouldPollBookings() &&
              <Tooltip title="Uncheck the box to filter rides" placement="left">
                <div className="xs-order-2">
                  <Checkbox checked={ followUpdates } onChange={ this.onFollowUpdatesChange }>Follow updates</Checkbox>
                  { !followUpdates &&
                    <div className="text-10 mr-15">
                      { hasUpdates
                        ? <div>
                            The list has been updated.
                            <div>
                              Click<span className="blue-text pointer" onClick={ this.reloadBookingsList }> Refresh </span>
                              too see updates
                            </div>
                          </div>
                        : 'No updates'
                      }
                    </div>
                  }
                </div>
              </Tooltip>
            }
          </div>

          <div className="mr-10 xs-mr-0 xs-full-width xs-order-3 xs-mt-10 w-430 sm-w-300">
            <Search
              placeholder={ this.getSearchPlaceholder() }
              value={ search }
              onChange={ this.onSearch }
            />
          </div>
          { can && can.exportBookings && <Route path="/reports/bookings" render={ this.renderExportBtn } /> }

          { !this.isAdminPage && can && can.exportReceipts &&
            <Route exact path="/reports/bookings" component={ ExportReceipts } />
          }

          { !this.isAdminPage &&
            <Route path="/bookings" render={ this.renderNewBookingBtn } />
          }
        </div>

        { this.renderFilterBtns() }

        <Spin spinning={ loading }>
          <BookingTable
            ref={ this.setTableRef }
            className="table-expandable sm-table-fixed"
            rowKey="id"
            dataSource={ items }
            items={ items }
            can={ can }
            isAdminPage={ this.isAdminPage }
            isReportsPage={ !this.isAdminPage && isReportsPage }
            expandedId={ expandedId }
            pagination={ pagination }
            onChange={ this.onTableChange }
            updatedBookings={ updatedBookings }
            paymentMethodFilters={ paymentMethodFilters }
            paymentMethods={ paymentMethods }
            statusFilters={ statusFilters }
            labelFilters={ labelFilters }
            vehicleTypeFilters={ vehicleTypeFilters }
            onFilterDropdownVisibleChange={ this.onFilterDropdownVisibleChange }
            getStatusFilterOptions={ this.getStatusFilterOptions }
            locale={ { emptyText } }
            onRow={ booking => ({ onClick: () => this.expandRow(booking) }) }
            onDatesFilterChange={ this.onDatesFilterChange }
            companies={ companies || [] }
            onCompanySelect={ this.onCompanySelect }
            onSupplierSelect={ this.onSupplierSelect }
            selectedCompany={ companyId }
            vendorsList={ vendorsList }
            vendorName={ vendorName }
            bookingDetails={
              {
                onGetBooking: getBooking,
                onCancel: cancelBooking,
                onRate: this.rateBooking,
                onFeedback: this.saveFeedback,
                onClearAlert: clearAlert,
                onShowPricing: getPricing,
                onSavePricing: savePricing,
                onShowComments: getComments,
                onAddComment: addComment,
                onResendOrder: resendOrder,
                onToggleCriticalFlag: toggleCriticalFlag
              }
            }
          />
        </Spin>
      </Fragment>
    );
  }
}
