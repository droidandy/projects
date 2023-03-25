/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React from 'react';
import { VehicleType, Icon, Status } from 'components';
import { centsToPounds } from 'utils';
import { statusLabels } from 'pages/shared/bookings/data';
import { formatScheduledAtWithId, getAlertStatus } from './utils';
import CN from 'classnames';

// function is bound to instance in BookingTable component constructor
export default function getMobileColumns() {
  const { updatedBookings, isAdminPage, getStatusFilterOptions, statusFilters, onFilterDropdownVisibleChange } = this.props;

  return [
    { title: this.renderDateColumnTitle,
      sorter: true,
      dataIndex: 'scheduledAt',
      className: 'date-time',
      width: '47%',
      render: formatScheduledAtWithId
    }, {
      title: 'Vehicle and Price',
      sorter: true,
      dataIndex: 'vehicleType',
      className: 'vehicle-type',
      width: '41%',
      render: (vehicleType, { totalCost, serviceType, via }) => (
        <div className="layout">
          <VehicleType type={ vehicleType } serviceType={ serviceType }  via={ via } />
          <div className="mt-5 ml-5 bold-text"> { isFinite(totalCost) ? `£ ${centsToPounds(totalCost)}` : 'N/A' }</div>
        </div>
      )
    }, {
      title: 'Status',
      dataIndex: 'status',
      className: 'status',
      width: '24%',
      filteredValue: this.isBookingList && statusFilters,
      filters: this.isBookingList && getStatusFilterOptions(),
      onFilterDropdownVisibleChange,
      filterIcon: this.renderFilterIcon,
      render: (status, item) => (
        <div className="layout horizontal center">
          <div className="bold-text ml-15">
            <Status value={ statusLabels[item.indicatedStatus] } indicator={ this.isBookingList && updatedBookings.includes(item.id) && !item.final } small />
          </div>
          { isAdminPage && item.alertLevel && <Icon icon="Alert" className={ CN(getAlertStatus(item.alertLevel), 'text-20 ml-10') } /> }
        </div>
      )
    }
  ];
}
