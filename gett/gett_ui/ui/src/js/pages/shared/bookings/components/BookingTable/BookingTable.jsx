import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import BookingDetails from '../BookingDetails';
import { DatePicker } from 'antd';
import { ResponsiveTable, Icon } from 'components';
import { backOfficeBaseVehicles, emptyVendorName } from 'pages/shared/bookings/data';
import { filter, map } from 'lodash';
import MediaQuery from 'react-responsive';
import CN from 'classnames';
import { paymentMethodOptions } from './utils';
import * as getColumns from './getColumns';

import css from '../styles.css';

const { RangePicker } = DatePicker;

// Extra breakpoint for doing some styles changes
const largeDesktopBreakpoint = 1440;
const extraLargeDesktopBreakpoint = 1920;

export default class BookingTable extends PureComponent {
  static propTypes = {
    items: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    can: PropTypes.object,
    className: PropTypes.string,
    paymentMethods: PropTypes.array,
    paymentMethodFilters: PropTypes.array,
    statusFilters: PropTypes.array,
    labelFilters: PropTypes.array,
    vehicleTypeFilters: PropTypes.array,
    bookingDetails: PropTypes.object,
    updatedBookings: PropTypes.array,
    pagination: PropTypes.object,
    onFilterDropdownVisibleChange: PropTypes.func,
    expandedId: PropTypes.number,
    isAdminPage: PropTypes.bool,
    isReportsPage: PropTypes.bool,
    getStatusFilterOptions: PropTypes.func,
    onDatesFilterChange: PropTypes.func,
    companies: PropTypes.array,
    onCompanySelect: PropTypes.func,
    onSupplierSelect: PropTypes.func,
    selectedCompany: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    vendorsList: PropTypes.arrayOf(PropTypes.string),
    vendorName: PropTypes.string
  };

  state = {
    datesFilterOpen: false,
    datesFilterActive: false,
    companyFilterActive: false,
    supplierFilterActive: false
  };

  getLargeDesktopColumns = getColumns.largeDesktop.bind(this);
  getDesktopColumns = getColumns.desktop.bind(this);
  getTabletColumns = getColumns.tablet.bind(this);
  getMobileColumns = getColumns.mobile.bind(this);

  setTableRef = table => this.table = table;

  get isBookingList() {
    return Array.isArray(this.props.items);
  }

  getPaymentMethodOptions() {
    const { isAdminPage, paymentMethods } = this.props;

    if (isAdminPage) {
      return filter(paymentMethodOptions, ({ value }) => value !== 'passenger_payment_card');
    } else {
      return filter(paymentMethodOptions, ({ value }) => paymentMethods.includes(value));
    }
  }

  getCarsFilterOptions() {
    return backOfficeBaseVehicles.map(vehicle => ({ value: vehicle.name, text: vehicle.label }));
  }

  openDatesFilter = () => {
    this.setState({ datesFilterOpen: true });
  };

  // NOTE: majority of methods in this components are shared by "getColumns" methods extracted
  // to separated files to reduce complexity of this component
  handleDatesFilterOpenChange = (datesFilterOpen) => {
    this.setState({ datesFilterOpen });
  };

  handleSupplierFilterOpenChange = (supplierFilterOpen) => {
    if (supplierFilterOpen) return this.setState({ supplierFilterOpen }, () => this.vendorSelect.getInput().click());
     // setTimeout is used to force selector's options dropdown disappear before search input
    // otherwise search input disappears first and after some time so do options dropdown
    setTimeout(() => this.setState({ supplierFilterOpen }), 200);
  };

  handleCompanyFilterOpenChange = (companyFilterOpen) => {
    if (companyFilterOpen) return this.setState({ companyFilterOpen }, () => this.companySelect.getInput().click());

    // setTimeout is used to force selector's options dropdown disappear before search input
    // otherwise search input disappears first and after some time so do options dropdown
    setTimeout(() => this.setState({ companyFilterOpen }), 200);
  };

  onCompanyChange = (search) => {
    if (search == '') {
      this.onCompanySelect();
    }
  };

  onCompanySelect = (value) => {
    const { selectedCompany } = this.props;

    this.setState({
      companyFilterActive: selectedCompany === value ? false : !!value,
      companyFilterOpen: false
    });
    this.props.onCompanySelect(value);
  }

  onSupplierChange = (search) => {
    if (search === '') {
      this.onSupplierSelect();
    }
  };

  onSupplierSelect = (value) => {
    const { vendorName } = this.props;

    this.setState({
      supplierFilterActive: vendorName === value ? false : !!value,
      supplierFilterOpen: false
    });
    this.props.onSupplierSelect(value);
  }

  onDatesFilterChange = (dates, [from, to]) => {
    this.setState({ datesFilterActive: !!dates });
    this.props.onDatesFilterChange(dates, [from, to]);
  };

  companySelectRef = select => this.companySelect = select;
  vendorSelectRef = select => this.vendorSelect = select;

  getSuppliersList() {
    return map(this.props.vendorsList, name => name || emptyVendorName);
  }

  insertColumnAfter(columns, target, insertColumn) {
    let targetIndex = columns.findIndex(column => column && column.title === target );
    targetIndex = targetIndex === -1 ? 0 : targetIndex;
    columns.splice(targetIndex + 1, 0, insertColumn);
  }

  dropSort() {
    this.table.dropSort();
  }

  prepareTable(columns) {
    const { className, items, expandedId, bookingDetails, pagination, isAdminPage, ...rest } = this.props;

    return (
      <ResponsiveTable
        ref={ this.setTableRef }
        className={ CN(className, { [css.adminTable]: isAdminPage }) }
        rowKey="id"
        dataSource={ this.isBookingList ? items : [items] }
        pagination={ this.isBookingList && pagination }
        rowClassName={ record => expandedId === record.id ? 'expanded-parent-highlight' : '' }
        expandedRowKeys={ expandedId ? [expandedId] : [] }
        { ...rest }
        expandedRowRender={ booking => (
          // it is *important* to render `null` here when `expandedId` changes to force
          // `BookingDetails` component to unmount, otherwise expanded row content will
          // be hidden / shown with data of the latest booking details loaded
          expandedId === booking.id
          ? <BookingDetails
              bookingId={ booking.id }
              isAdminPage={ isAdminPage }
              { ...bookingDetails }
            />
          : null
        ) }
        columns={ columns }
        tabletColumns={ this.getTabletColumns() }
        mobileColumns={ this.getMobileColumns() }
      />
    );
  }

  renderFilterIcon() {
    return <Icon icon="Filter" />;
  }

  renderDateColumnTitle = () => {
    const { datesFilterOpen, datesFilterActive } = this.state;

    return (
      <span>
        Date & Time
        <Icon icon="Calendar" className={ CN('text-20 icon pointer ml-10', { [css.activeIcon]: datesFilterActive }) } onClick={ this.openDatesFilter } />
        <RangePicker
          open={ datesFilterOpen }
          onOpenChange={ this.handleDatesFilterOpenChange }
          className="collapse"
          onChange={ this.onDatesFilterChange }
        />
      </span>
    );
  };

  render() {
    return (
      <Fragment>
        <MediaQuery minWidth={ extraLargeDesktopBreakpoint }>
          { this.prepareTable(this.getLargeDesktopColumns(true)) }
        </MediaQuery>
        <MediaQuery minWidth={ largeDesktopBreakpoint - 1 } maxWidth={ extraLargeDesktopBreakpoint - 1 }>
          { this.prepareTable(this.getLargeDesktopColumns()) }
        </MediaQuery>
        <MediaQuery maxWidth={ largeDesktopBreakpoint - 2 }>
          { this.prepareTable(this.getDesktopColumns()) }
        </MediaQuery>
      </Fragment>
    );
  }
}
