import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, VehicleType } from 'components';
import { Table } from 'antd';
import moment from 'moment';
import dispatchers from 'js/redux/app/bookings.dispatchers';
import { statusLabels } from 'pages/shared/bookings/data';

import css from 'pages/shared/bookings/style.css';

function mapStateToProps(state) {
  return state.bookings.list;
}

class Reports extends PureComponent {
  static propTypes = {
    getBookings: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object
  };

  componentDidMount() {
    this.props.getBookings({ final: true, reverse: true, page: 1 }, true);
  }

  onTableChange = (pagination, filters, sorter) => {
    const { getBookings } = this.props;
    const query = { final: true, page: pagination.current };

    if (sorter.field) { query.order = sorter.field; }
    if (sorter.order === 'descend') { query.reverse = true; }
    if (!query.order) { query.reverse = true; }

    getBookings(query, true);
  };

  render() {
    return (
      <Fragment>
        <div className="page-title mb-30">Reports</div>
        <Table
          rowKey="id"
          dataSource={ this.props.items }
          pagination={ this.props.pagination }
          onChange={ this.onTableChange }
          columns={ [
            { title: 'Date',
              sorter: true,
              dataIndex: 'scheduledAt',
              render: scheduledAt => (
                <div>{ moment(scheduledAt).format('DD/MM/YYYY') }</div>
              )
            }, {
              title: 'Order ID',
              sorter: true,
              dataIndex: 'orderId',
              render: orderId => (
                <div className="grey-text">{ orderId }</div>
              )
            }, {
              title: 'Journey',
              render: record => (
                <div className={ `lh-1 ${css.journey}` }>
                  <div className={ css.start }>{ record.pickupAddress.line }</div>
                  <div className={ `text-12 mt-10 grey-text ${css.end}` }>
                    { record.destinationAddress
                      ? record.destinationAddress.line
                      : 'N/A'
                    }
                  </div>
                </div>
              )
            }, {
              title: 'Passenger',
              sorter: true,
              dataIndex: 'passenger',
              render: (passenger, record) => (
                <div className="layout horizontal center">
                  <Avatar name={ passenger } size={ 26 } className="mr-5" src={ record.passengerAvatarUrl } />
                  <div className="flex">{ passenger }</div>
                </div>
              )
            }, {
              title: 'Vehicle Type',
              sorter: true,
              dataIndex: 'vehicleType',
              render: vehicleType => (
                <VehicleType type={ vehicleType } />
              )
            }, {
              title: 'Status',
              dataIndex: 'status',
              width: '140px',
              render: status => (
                <div className="text-uppercase bold-text text-10">{ statusLabels[status] }</div>
              )
            }
          ] }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Reports);
