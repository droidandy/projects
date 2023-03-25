import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, DatePicker, Rate, Button } from 'antd';
import { Avatar, VehicleType, Desktop, ResponsiveTable } from 'components';
import { connect } from 'react-redux';
import dispatchers from 'js/redux/app/orders.dispatchers';
import TimeLine from 'js/pages/shared/orders/TimeLine';

import GoogleMap from 'components/GoogleMap';
import driverStatuses from 'utils/driverStatuses';
import { strFilter } from 'utils';
import { sortBy, upperFirst, isEmpty } from 'lodash';
import css from './Orders.css';
import moment from 'moment';

const ORDER_STATUSES = ['Pending', 'Routing', 'Accepted | Order Received', 'Cancelled', 'Accepted | Car Arrived', 'Accepted | In Progress', 'Completed', 'CareReq', 'Rejected'];
const ACTIVE_STATUSES = [2, 3, 5, 6, 8];

const INTERVAL = 10000; //10 sec
const filters = ['active', 'future', 'completed', 'all'];
const TYPE = 'active';

function mapStateToProps(state) {
  return {
    orders: state.orders,
    loadingOrders: state.orders.loadingOrders,
    pathPoints: state.orders.pathPoints,
    driversFilter: state.orders.driversFilter,
    drivers: state.orders.drivers
  };
}

class Orders extends PureComponent {
  static propTypes = {
    orders: PropTypes.object,
    loadingOrders: PropTypes.bool,
    pathPoints: PropTypes.object,
    drivers: PropTypes.array,
    driversFilter: PropTypes.number,
    getDrivers: PropTypes.func,
    getOrders: PropTypes.func,
    changeDriversFilter: PropTypes.func,
    getOrderPathPoints: PropTypes.func
  };

  state = {
    selectedOrderId: undefined,
    nextCenter: null,
    searchValue: '',
    sortBy: 'orderId',
    sortOrder: 'descend',
    filterDates: [moment().subtract(7, 'd'), moment()],
    currentTab: TYPE
  };

  componentDidMount() {
    this.getData(true);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getData = (showSpinner = false) => {
    this.props.getDrivers();
    const params = { type: this.state.currentTab, spinner: showSpinner };
    if (this.isFilterByDateTab) {
      const [from, to] = this.state.filterDates;
      params.from = from.format('YYYY-MM-DD');
      params.to = to.format('YYYY-MM-DD');
    }
    this.props.getOrders(params).then(() => {
      this.timeout = setTimeout(this.getData, INTERVAL);
    });
  };

  selectOrder = (record) => {
    this.setState((state) => {
      return state.selectedOrderId === record.orderId
        ? { selectedOrderId : undefined, nextCenter: 'default' }
        : { selectedOrderId: record.orderId, nextCenter: 'auto' };
    }, () => this.getOrderPathPoints(record));
  };

  getOrderPathPoints = (order) => {
    if (order.orderStatus === 7) {
      this.props.getOrderPathPoints(order.orderId);
    }
  };

  get selectedOrder() {
    return this.filteredOrders.find(o => o.orderId === this.state.selectedOrderId) || {};
  }

  isFilterChecked = (value) => {
    return (this.props.driversFilter & value) > 0;
  };

  changeDriversFilter = (value) => {
    this.props.changeDriversFilter(value);
  };

  get drivers() {
    return this.props.drivers.filter(d => Boolean(this.props.driversFilter & driverStatuses[d.statusId].binValue));
  }

  convertLocation(location) {
    const [ lat, lng ] = typeof location === 'string' ? location.split(',') : location;
    return { lat, lng };
  }

  handleSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  handleDateFilter = (dates) => {
    this.setState({ filterDates: dates }, () => this.getData(true));
  };

  get filteredOrders() {
    const { currentTab } = this.state;
    const { orders } = this.props;

    if(isEmpty(orders[currentTab])) return [];

    const searchValue = this.state.searchValue;
    const filteredOrders = orders[currentTab].filter(r => strFilter(r.orderId, searchValue) || strFilter(r.driverName, searchValue) || strFilter(r.driverPhone, searchValue));
    const sortedOrders = sortBy(filteredOrders, this.state.sortBy);

    return this.state.sortOrder === 'descend' ? sortedOrders.reverse() : sortedOrders;
  }

  renderOrderStatus = (id) => {
    return ORDER_STATUSES[id - 1];
  };

  getOrderPath() {
    const path = {};
    const { pickupLocation, destinationLocation } = this.selectedOrder;
    if(pickupLocation) {
      path.start = this.convertLocation(pickupLocation);
    }
    if(destinationLocation) {
      path.finish = this.convertLocation(destinationLocation);
    }
    if(this.selectedOrdersPathPoints) {
      path.points = JSON.parse(this.selectedOrdersPathPoints).map(this.convertLocation);
    }

    return path;
  }

  onTableChange = (pagination, filter, sorter) => {
    this.setState({ sortBy: sorter.field, sortOrder: sorter.order });
  };

  displayDataValue(value) {
    return value ? moment(value).format('DD/MM/YYYY HH:mm:ss') : 'N/A';
  }

  get selectedOrdersDriver() {
    const { driverId, orderStatus } = this.selectedOrder;
    if (!ACTIVE_STATUSES.includes(orderStatus)) { return []; } // just for active orders
    return [this.drivers.find(d => d.driverId === driverId)];
  }

  get selectedOrdersPathPoints() {
    return this.props.pathPoints[this.selectedOrder.orderId];
  }

  carModelToVehicleType = (carModel) => {
    if (/vito/.test(carModel)) {
      return 'BlackTaxiXL';
    } else if (/(TX1|TX2|TX4|Fairway|Metro)/.test(carModel)) {
      return 'BlackTaxi';
    } else {
      return 'Standard';
    }
  }

  renderPassenger(order, cl = '') {
    const { passengerName } = order;
    return (
      <div className={ cl }>
        <div className="mb-20">
          <div className="navy-text bold-text">Passenger</div>
          <div>{ passengerName }</div>
        </div>
      </div>
    );
  }

  renderDriverDetails(order, cl = '') {
    const { driverName, driverPhone, driverDeviceType, driverCarModel, driverTaxiReg, driverRating, driverPhoto } = order;

    return (
      <div className={ `flex layout horizontal wrap ${cl}` } >
        <div className="mr-10 mb-20 sm-mb-0">
          <div className="navy-text bold-text">Driver details</div>
          <div className="layout horizontal mt-10">
            <div>
              <div>Name</div>
              <div>Phone</div>
              <div>Car Type</div>
              <div>Car Model</div>
              <div>Car Reg.</div>
              <div>Rate Driver</div>
            </div>
            <div className="ml-40">
              <div>{ driverName || 'N/A' }</div>
              <div>{ driverPhone || 'N/A' }</div>
              <div>{ driverDeviceType }</div>
              <div>{ driverCarModel || 'N/A' }</div>
              <div>{ driverTaxiReg || 'N/A' }</div>
              <Rate value={ driverRating } disabled />
            </div>
          </div>
        </div>
        <Avatar className="flex none mb-20 sm-mb-0" size={ 130 } src={ driverPhoto } />
      </div>
    );
  }

  renderTimeLine(order) {
    return (<TimeLine order={ order } />);
  }

  renderExpandedContent = (order) => {
    const paths = this.getOrderPath() || [];

    return (
      <Desktop>
        <div className="layout horizontal wrap flex">
          <div className="mr-20 sm-mr-0 mb-10 sm-center-block" >
            <GoogleMap
              width = { 350 }
              height = { 350 }
              markers={ this.selectedOrdersDriver }
              paths={ [paths] }
            />
          </div>
          <div className="flex auto layout vertical mb-20 pr-10">
            <div className="flex auto layout justified horizontal wrap" >
              <div className="mb-20 pr-10">
                { this.renderPassenger(order, 'flex mr-10') }
              </div>
              <div className="mb-20 pr-10">
                { this.renderDriverDetails(order, 'pr-10') }
              </div>
            </div>
            <div className="mb-20 pr-10">
              { this.renderTimeLine(order) }
            </div>
          </div>
        </div>
      </Desktop>
    );
  }

  isFilterActive(value) {
    return this.state.currentTab === value;
  }

  get isFilterByDateTab() {
    return this.state.currentTab === 'completed' || this.state.currentTab === 'all';
  }

  handleFilterChange(filter) {
    this.setState({ currentTab: filter },
      () => this.getData(true)
    );
  }

  renderFilterBtns() {
    return (
      <Desktop>
        <Button.Group className={ `layout horizontal ${css.filterBtns}` }>
          { filters.map(f => (
            <Button
              key={ f }
              type={ this.isFilterActive(f) ? 'primary' : '' }
              onClick={ () => this.handleFilterChange(f) }
            >
              { upperFirst(f) }
              {/* @todo implement in future issues */}
              {/*{ this.getFilterCount(f) }*/}
            </Button>
            ))
          }
        </Button.Group>
      </Desktop>
    );
  }

  render() {
    const { selectedOrderId, filterDates } = this.state;
    const { loadingOrders } = this.props;

    return (
      <div className="p-20 full-height">
        <div className="layout horizontal full-height">
          <div className="flex three">
            <div className="layout horizontal center h-40 mb-10">
              <div className={ `mr-10 sm-mr-0 mb-20 ${css.w225}` }>
                <label className="ml-10 mr-10 mt-5">Search by</label>
                <Input.Search style={ { width: 220 } } placeholder="Order id or driver name or driver phone" value={ this.state.searchValue } onChange={ this.handleSearch } />
              </div>
              { this.renderFilterBtns() }
              { this.isFilterByDateTab &&
                <div className="ml-10 sm-mr-0 mb-20 mt-5">
                  <label key="label" className="ml-10 mr-10">Filter by date</label>
                  <DatePicker.RangePicker key="rangePicker" className="ml-10" disabled={ loadingOrders } allowClear={ false } value={ filterDates } onChange={ this.handleDateFilter } />
                </div>
              }
            </div>
            <ResponsiveTable
              className="fixed"
              rowKey="orderId"
              rowClassName={ rec => rec.orderId === selectedOrderId ? 'light-grey-bg pointer' : 'pointer' }
              onRowClick={ this.selectOrder }
              dataSource={ this.filteredOrders }
              loading={ loadingOrders }
              onChange={ this.onTableChange }
              expandedRowKeys={ selectedOrderId ? [selectedOrderId] : [] }
              expandedRowRender={ this.renderExpandedContent }
              columns={ [
                {
                  title: 'Date & Time',
                  dataIndex: 'scheduledAt',
                  sorter: true,
                  width: '200px',
                  render: scheduledAt => moment(scheduledAt).format('DD/MM/YYYY -- HH:mm')
                },
                {
                  title: 'Order ID',
                  dataIndex: 'orderId',
                  sorter: true,
                  width: '90px'
                },
                {
                  title: 'Journey',
                  render: record => (
                    <div className={ `lh-1 ${css.journey}` }>
                      <div className={ css.start }>{ record.pickupAddress }</div>
                      { record.destinationAddress &&
                        <div className={ `text-12 mt-10 grey-text ${css.end}` }>{ record.destinationAddress }</div>
                      }
                    </div>
                  ),
                  width: '100%'
                },
                {
                  title: 'Passenger',
                  dataIndex: 'passengerName',
                  width: '40%'
                },
                {
                  title: 'Vehicle Type',
                  dataIndex: 'driverCarModel',
                  render: record => <VehicleType type={ this.carModelToVehicleType(record) } />,
                  width: '100px'
                },
                {
                  title: 'Order Status',
                  dataIndex: 'orderStatus',
                  sorter: true,
                  width: '200px',
                  render: this.renderOrderStatus
                }
              ] }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Orders);
