/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, VehicleType, Icon, Status } from 'components';
import { stopPropagation, centsToPounds } from 'utils';
import { statusLabels, paymentTypeLabels } from 'pages/shared/bookings/data';
import { formatScheduledAtWithId, getAlertStatus } from './utils';
import CN from 'classnames';

// function is bound to instance in BookingTable component constructor
export default function getTabletColumns() {
  const {
    onFilterDropdownVisibleChange, paymentMethodFilters, updatedBookings, isAdminPage, statusFilters, getStatusFilterOptions
  } = this.props;

  return [
    { title: this.renderDateColumnTitle,
      sorter: true,
      dataIndex: 'scheduledAt',
      className: 'date-time',
      render: formatScheduledAtWithId
    }, {
      title: 'Passenger',
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
    }, {
      title: 'Vehicle and Price',
      dataIndex: 'vehicleType',
      className: 'vehicle-type',
      width: '15%',
      render: (vehicleType, { totalCost, serviceType, via }) => (
        <div className="layout">
          <VehicleType type={ vehicleType } serviceType={ serviceType } via={ via } />
          <div className="mt-5 ml-5 bold-text"> { isFinite(totalCost) ? `£ ${centsToPounds(totalCost)}` : 'N/A' }</div>
        </div>
      )
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
      title: 'Status',
      dataIndex: 'status',
      className: 'status',
      width: '12%',
      filteredValue: this.isBookingList && statusFilters,
      filters: this.isBookingList && getStatusFilterOptions(),
      onFilterDropdownVisibleChange,
      filterIcon: this.renderFilterIcon,
      render: (status, item) => (
        <div className="layout horizontal center">
          <div className="bold-text ml-20">
            <Status value={ statusLabels[item.indicatedStatus] } indicator={ this.isBookingList && updatedBookings.includes(item.id) && !item.final } small />
          </div>
          { isAdminPage && item.alertLevel && <Icon icon="Alert" className={ CN(getAlertStatus(item.alertLevel), 'text-20 ml-10') } /> }
        </div>
      )
    }
  ];
}
