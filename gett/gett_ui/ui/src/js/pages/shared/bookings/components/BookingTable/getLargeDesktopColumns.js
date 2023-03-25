/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, VehicleType, Icon, Status, OrderId } from 'components';
import { Select } from 'components/form';
import { stopPropagation, centsToPounds } from 'utils';
import { statusLabels, paymentTypeLabels, emptyVendorName } from 'pages/shared/bookings/data';
import { typeOptions, formatScheduledAt, renderEta, renderLabels, getAlertStatus } from './utils';
import CN from 'classnames';

import css from '../styles.css';

const { Option, caseInsensitiveFilter } = Select;

// function is bound to instance in BookingTable component constructor
export default function getLargeDesktopColumns(isWideScreen) {
  const {
    getStatusFilterOptions, onFilterDropdownVisibleChange, statusFilters,
    labelFilters, vehicleTypeFilters, paymentMethodFilters, updatedBookings,
    isAdminPage, isReportsPage, companies, selectedCompany, vendorName, can
  } = this.props;
  const { companyFilterOpen, supplierFilterOpen, supplierFilterActive, companyFilterActive } = this.state;

  const columns = [
    { title: this.renderDateColumnTitle,
      width: '17%',
      sorter: true,
      dataIndex: 'scheduledAt',
      className: 'date-time',
      render: formatScheduledAt
    }, {
      title: 'Order ID',
      width: '13%',
      dataIndex: 'orderId',
      className: 'order-id',
      render: (orderId, record) => (
        <OrderId serviceId={ orderId } isLink={ isAdminPage } vendorName={ record.vendorName } />
      )
    }, {
      title: 'Journey',
      width: '20%',
      className: 'journey',
      render: record => (
        <div>
          <div className={ `text-12 lh-1 mt-5 mb-5 ${css.journey}` }>
            <Icon icon="UserIcon" className={ CN('text-30 icon green-text', `${css.startIcon}`) } />
            <div className={ css.start } data-name="pickupAddressLine">{ record.pickupAddress.line }</div>
            { record.destinationAddress &&
              <Fragment>
                <Icon icon="Destination" className={ CN('text-30 icon red-text', `${css.endIcon}`) } />
                <div className="text-10 grey-text mt-20" data-name="destinationAddressLine">
                  { record.destinationAddress.line }
                </div>
              </Fragment>
            }
          </div>
          { isAdminPage && !isWideScreen &&
            <div>
              <div className="mt-5 ml-15">
                Order ID: <OrderId serviceId={ record.orderId } isLink={ isAdminPage } vendorName={ record.vendorName } />
              </div>
              <div className="mt-5 ml-15">
                Supplier ID: { record.supplierServiceId || 'N/A' }
              </div>
              <div className="mt-5 ml-15">
                ETA:&nbsp;
                { renderEta(record) }
              </div>
            </div>
          }
        </div>
      )
    }, isAdminPage && isWideScreen && {
      title: 'ETA',
      width: '6%',
      className: 'eta',
      render: renderEta
    }, isAdminPage && {
      title: 'Supplier',
      dataIndex: 'vendorName',
      render: vendorName => vendorName || 'N/A',
      filterIcon: <Icon icon="Filter" style={ { color: supplierFilterActive ? '#fdb924' : '#808080' } } />,
      filterDropdown: (
        <Select
          showSearch
          allowClear
          className="w-200"
          ref={ this.vendorSelectRef }
          filterOption={ caseInsensitiveFilter }
          onSelect={ this.onSupplierSelect }
          onChange={ this.onSupplierChange }
          value={ vendorName }
        >
          {
            this.getSuppliersList().map((item) => {
              return <Option key={ item === emptyVendorName ? ' ' : item }>{ item }</Option>;
            })
          }
        </Select>
      ),
      filterDropdownVisible: supplierFilterOpen,
      onFilterDropdownVisibleChange: this.handleSupplierFilterOpenChange
    }, {
      title: 'Passenger',
      width: '19%',
      sorter: this.isBookingList,
      dataIndex: 'passenger',
      className: 'passenger',
      render: (passenger, record) => (
        <div className="layout horizontal center">
          <Avatar size={ 40 } name={ passenger } className="mr-5 flex none" src={ record.passengerAvatarUrl } />
          { isAdminPage && record.passengerId
            ? <Link onClick={ stopPropagation } to={ `/users/members/${record.passengerId}/edit` }>{ passenger }</Link>
            : <div className="flex">{ passenger }</div>
          }
        </div>
      )
    }, (isAdminPage || isReportsPage) && {
      title: 'Total Cost',
      className: 'total-cost',
      sorter: this.isBookingList,
      dataIndex: 'totalCost',
      render: totalCost => isFinite(totalCost) ? `£ ${ centsToPounds(totalCost) }` : 'N/A'
    }, (!isAdminPage && !isReportsPage) && {
      title: 'Quote Price',
      sorter: this.isBookingList,
      dataIndex: 'fareQuote',
      className: 'quote-price',
      render: fareQuote => <b>£{ centsToPounds(fareQuote) }</b>
    }, {
      title: 'Payment Type',
      dataIndex: 'paymentMethod',
      className: 'payment-type',
      filteredValue: this.isBookingList && paymentMethodFilters,
      filters: this.isBookingList && this.getPaymentMethodOptions(),
      filterIcon: this.renderFilterIcon,
      onFilterDropdownVisibleChange,
      render: paymentMethod => <div className="grey-text">{ paymentTypeLabels[paymentMethod] || 'N/A' }</div>
    }, {
      title: 'Vehicle Type',
      dataIndex: 'vehicleType',
      className: 'vehicle-type',
      filteredValue: this.isBookingList && vehicleTypeFilters,
      filters: this.isBookingList && this.getCarsFilterOptions(),
      filterIcon: this.renderFilterIcon,
      onFilterDropdownVisibleChange,
      render: (vehicleType, { serviceType, via }) => <VehicleType type={ vehicleType } serviceType={ serviceType }  via={ via } />
    }, {
      title: 'Status',
      width: '15%',
      dataIndex: 'status',
      className: 'status',
      filteredValue: this.isBookingList && statusFilters,
      filters: this.isBookingList && getStatusFilterOptions(),
      onFilterDropdownVisibleChange,
      filterIcon: this.renderFilterIcon,
      render: (status, item) => (
        <div className="layout horizontal center">
          <div className="bold-text">
            <Status value={ statusLabels[item.indicatedStatus] } indicator={ this.isBookingList && updatedBookings.includes(item.id) && !item.final } />
          </div>
          { isAdminPage && item.alertLevel && <Icon icon="Alert" className={ CN(getAlertStatus(item.alertLevel), 'text-20 ml-5') } /> }
        </div>
      )
    }
  ];
  if (isAdminPage) {
    this.insertColumnAfter(columns, 'Passenger', {
      title: 'Quote Cost',
      className: 'quote-cost',
      sorter: this.isBookingList,
      dataIndex: 'fareQuote',
      render: fareQuote => fareQuote > 0 ? `£ ${centsToPounds(fareQuote)}` : 'Meter'
    });
    columns.unshift(
      { title: 'Type',
        dataIndex: 'labels',
        className: 'type',
        render: labels => (
          <div className="layout vertical start">
            { renderLabels(labels) }
          </div>
        ),
        filterIcon: <Icon icon="Filter" />,
        filteredValues: labelFilters,
        filters: typeOptions
      },
      { title: 'Company Name',
        width: 130,
        className: 'company-name',
        dataIndex: 'companyName',
        render: (companyName, record) => {
          return can.editCompanies
            ? <Link onClick={ stopPropagation } to={ `/company/${record.companyId}/edit` }>{ companyName }</Link>
            : companyName;
        },
        filterDropdown: (
          <Select
            showSearch
            allowClear
            className="w-200"
            ref={ this.companySelectRef }
            filterOption={ caseInsensitiveFilter }
            onSelect={ this.onCompanySelect }
            onChange={ this.onCompanyChange }
            value={ selectedCompany }
          >
            { companies.map(({ id, name }) => <Option key={ id }>{ name }</Option>) }
          </Select>
        ),
        filterIcon: <Icon icon="Filter" style={ { color: companyFilterActive || selectedCompany ? '#fdb924' : '#808080' } } />,
        filterDropdownVisible: companyFilterOpen,
        onFilterDropdownVisibleChange: this.handleCompanyFilterOpenChange
      }
    );
  }

  return columns.filter(Boolean);
}
