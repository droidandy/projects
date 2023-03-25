/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, VehicleType, Icon, Status, OrderId } from 'components';
import { stopPropagation, centsToPounds } from 'utils';
import { statusLabels, paymentTypeLabels } from 'pages/shared/bookings/data';
import { formatScheduledAtWithId, getAlertStatus, renderEta } from './utils';
import CN from 'classnames';

import css from '../styles.css';

// function is bound to instance in BookingTable component constructor
export default function getDesktopColumns() {
  const {
    onFilterDropdownVisibleChange, paymentMethodFilters,
    updatedBookings, isAdminPage
  } = this.props;

  return [
    { title: this.renderDateColumnTitle,
      sorter: true,
      dataIndex: 'scheduledAt',
      className: 'date-time',
      render: formatScheduledAtWithId
    }, {
      title: 'Journey',
      width: '20%',
      className: 'journey',
      render: record => (
        <Fragment>
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
          { isAdminPage &&
            <Fragment>
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
            </Fragment>
          }
        </Fragment>
      )
    }, {
      title: 'Passenger',
      sorter: this.isBookingList,
      className: 'passenger',
      dataIndex: 'passenger',
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
      className: 'taxi-price',
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
      onFilterDropdownVisibleChange,
      filterIcon: this.renderFilterIcon,
      render: paymentMethod => <div className="grey-text">{ paymentTypeLabels[paymentMethod] || 'N/A' }</div>
    }, {
      title: 'Status',
      dataIndex: 'status',
      className: 'status',
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
}
