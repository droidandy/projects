import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, InputNumber, Table, Spin } from 'antd';
import { Search, ButtonLink, Button, confirm } from 'components';
import { debounce } from 'lodash';
import update from 'update-js/fp';
import { get, post, centsToPounds } from 'utils';
import css from './style.css';

const searchDebounce = 300;

// TODO: get it from back-end
const vatRate = 0.2;

export default class CreditNote extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    })
  };

  state = {
    search: '',
    loading: false,
    dataSource: [],
    ordersChanges: []
  };

  componentDidMount() {
    this.getBookings();

    this.searchBookings = debounce(() => {
      const { search } = this.state;
      this.getBookings({ search });
    }, searchDebounce);
  }

  getBookings(params) {
    this.setState({ loading: true });

    get(`/admin/invoices/${this.id}/bookings`, { page: 1, perPage: 10, ...params })
      .then(({ data: { items, pagination } }) => {
        this.setState({ dataSource: items, pagination, loading: false });
      });
  }

  get id() {
    const { match: { params: { id } } } = this.props;
    return id;
  }

  onTableChange = (pagination) => {
    const { search } = this.state;
    this.getBookings({ page: pagination.current, search });
  };

  changeField(id, field, value) {
    const changedOrderExists = this.state.ordersChanges.find(item => item.bookingId === id);
    if (changedOrderExists) {
      if (value === '') {
        this.setState(update.remove(`ordersChanges.{bookingId:${id}}`));
      } else {
        this.setState(update(`ordersChanges.{bookingId:${id}}.${field}`, value));
      }
    } else {
      this.setState(update.push('ordersChanges', { bookingId: id, [field]: value }));
    }
  }

  onSearch = (value) => {
    this.setState({ search: value }, this.searchBookings);
  };

  getValue(id, field) {
    const item = this.state.ordersChanges.find(item => item.bookingId === id);

    return item && item[field];
  }

  inputNumberFormat = (value) => {
    return (value < 0 || value === '-') ? '' : value;
  };

  modalContent() {
    const totalAmount = this.state.ordersChanges.reduce((sum, order) => {
      return sum + order.amount * (1 + (order.vatable ? vatRate : 0));
    }, 0);

    return (
      <div className="bold-text">
        You are creating credit note for
        <div className="red-text mb-20">£ { totalAmount }</div>
        Do you wish to proceed
      </div>
    );
  }

  applyCredit = () => {
    post(`/admin/invoices/${this.id}/credit_note`, { creditNote: { creditNoteLines: this.state.ordersChanges} })
      .then(() => this.context.router.history.push('/settings/billing'));
  };

  confirm = () => {
    confirm({
      title: 'Credit Note Confirmation',
      content: this.modalContent(),
      onOk:  this.applyCredit,
      cancelButtonProps: {
        type: 'secondary'
      }
    });
  };

  renderCents = (value) => {
    const amount = value ? centsToPounds(value) : 0;
    return `£ ${amount}`;
  };

  render() {
    const { pagination, dataSource, search, ordersChanges, loading } = this.state;
    return (
      <Fragment>
        <div className="page-title mb-30">Credit Note</div>

        <Spin spinning={ loading } >
          <div className="p-20 sm-p-0">
            <div className={ `mr-20 sm-mr-0 mb-20 ${css.w425}` }>
              <Search
                placeholder="Search users by name, email, or company name..."
                value={ search }
                onChange={ this.onSearch }
              />
            </div>
            <Table
              className={ css.creditNote }
              rowKey="id"
              pagination={ pagination }
              dataSource={ dataSource }
              scroll={ { x: 1450 } }
              onChange={ this.onTableChange }
              columns={ [
                { title: 'Order ID', width: 30, dataIndex: 'serviceId', fixed: 'left' },
                { title: 'Passenger Name', width: 100, dataIndex: 'passenger', fixed: 'left' },
                { title: 'Base Price', dataIndex: 'charges.fareCost', render: this.renderCents },
                { title: 'Booking Fee', dataIndex: 'charges.bookingFee', render: this.renderCents },
                { title: 'Phone Booking fee', dataIndex: 'charges.phoneBookingFee', render: this.renderCents },
                { title: 'Handling Fee', dataIndex: 'charges.handlingFee', render: this.renderCents },
                { title: 'Run In', dataIndex: 'charges.runInFee', render: this.renderCents },
                { title: 'Tips', dataIndex: 'charges.tips', render: this.renderCents },
                { title: 'Cancellation Fee', dataIndex: 'charges.cancellationFee', render: this.renderCents },
                { title: 'Waiting time fee', dataIndex: 'charges.paidWaitingTimeFee', render: this.renderCents },
                { title: 'Stops', dataIndex: 'charges.stopsFee', render: this.renderCents },
                { title: 'Additional Fee', dataIndex: 'charges.additionalFee', render: this.renderCents },
                { title: 'extra 1', dataIndex: 'charges.extra1', render: this.renderCents },
                { title: 'extra 2', dataIndex: 'charges.extra2', render: this.renderCents },
                { title: 'extra 3', dataIndex: 'charges.extra3', render: this.renderCents },
                { title: 'Sales Tax', dataIndex: 'charges.vat', render: this.renderCents },
                { title: 'Black Car Tax', key: 'blackCar'},
                { title: 'Vatable?', width: 50, dataIndex: 'vatable', fixed: 'right',
                  render: (vatable, record) => {
                    return (
                      <Checkbox
                        checked={ this.getValue(record.id, 'vatable') }
                        disabled={ !this.getValue(record.id, 'amount') }
                        onChange={ e => this.changeField(record.id, 'vatable', e.target.checked) } />
                    );
                  }
                },
                { title: 'Credit Note Amount', width: 100, key:'amount', fixed: 'right',
                  render: (record) => {
                    return (
                      <InputNumber
                        value={ this.getValue(record.id, 'amount') }
                        onChange={ value => this.changeField(record.id, 'amount', value) }
                        formatter={ this.inputNumberFormat }
                        min={ 0 }
                      />
                    );
                  }
                }
              ] }
              />
              <div className="layout horizontal border-top pt-20 mb-20">
                <ButtonLink type="secondary" className="mr-10 justified-right" to={ '/settings/billing' }>
                  Cancel
                </ButtonLink>
                <Button type="primary" disabled={ ordersChanges.length === 0 } onClick={ this.confirm }>
                  Apply Credit
                </Button>
              </div>
          </div>
        </Spin>
      </Fragment>
    );
  }
}
