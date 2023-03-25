import React, { PureComponent } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Dropdown, message, Row, Col } from 'antd';
import { ActionMenu, Icon, Desktop, Tablet, ResponsiveTable } from 'components';
import { connect } from 'react-redux';
import dispatchers from 'js/redux/app/billing.dispatchers';
import PropTypes from 'prop-types';
import moment from 'moment';
import { round, isEmpty } from 'lodash';
import { urlFor } from 'utils';

import css from './billing.css';

const { Item } = ActionMenu;
const historyPlaceholder = [{ name: 'There are not transactions yet', total: 0, collected: 0 }];

function mapStateToProps(state) {
  return state.billing.invoices;
}

class Billing extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    outstandingDebt: PropTypes.number,
    history: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object,
    getInvoices: PropTypes.func,
    markAsPaid: PropTypes.func,
    disableCompany: PropTypes.func
  };

  state = {
    searchForm: {},
    lastQuery: {}
  };

  componentDidMount() {
    this.props.getInvoices();
  }

  onTableChange = (pagination) => {
    const { lastQuery } = this.state;
    this.props.getInvoices({ page: pagination.current, ...lastQuery });
  };

  markAsPaid = (invoice) => {
    const { lastQuery } = this.state;
    this.props.markAsPaid(invoice.id, lastQuery)
      .then(() => message.success('Invoice marked as paid'))
      .catch(() => message.error('Failed to mark invoice as paid'));
  };

  disableCompany = (companyId) => {
    const { lastQuery } = this.state;
    this.props.disableCompany(companyId, lastQuery)
      .then(() => message.success('Company disabled'))
      .catch(() => message.error('Failed to disable company'));
  };

  renderCustomizedLabel(obj) {
    const { x, y, payload } = obj;
    return (
      <text x={ x } y={ y } textAnchor="end" fill="#666">{ `£ ${payload.value}` }</text>
    );
  }

  renderChart() {
    let { history } = this.props;
    if (isEmpty(history)) {
      history = historyPlaceholder;
    }
    return (
      <div className="mb-20">
        <div className="navy-text bold-text text-uppercase mb-10">Earnings History</div>
        <div className="border-block white-bg pt-20">
          <ResponsiveContainer height={ 300 }>
            <ComposedChart data={ history }>
              <XAxis dataKey="name" />
              <YAxis tick={ this.renderCustomizedLabel } />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Bar dataKey="collected" fill="#0076bb" />
              <Line dataKey="total" stroke="red" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  renderMenu(record) {
    return (
      <ActionMenu>
        <Item>
          <a
            href={ urlFor.statics(`/documents/invoice.pdf?invoice_id=${record.id}`, { tokenized: true }) }
            rel="noopener noreferrer"
            target="_blank"
          >
            Export PDF
          </a>
        </Item>
        <Item>
          <a href={ urlFor.tokenized(`/api/admin/invoices/${record.id}/export`) } { ...urlFor.downloadProps }>Export CSV</a>
        </Item>
        <Item onClick={ () => this.markAsPaid(record) } disabled={ record.status === 'paid' }>
          Mark as Paid
        </Item>
        <Item onClick={ () => this.disableCompany(record.companyId) }>
          Disable Company
        </Item>
      </ActionMenu>
    );
  }

  renderOutstandingDebt() {
    const { outstandingDebt } = this.props;

    return (
      <div className="mb-20">
        <div className="navy-text bold-text text-uppercase mb-10">Estimated earnings</div>
        <div className="h-320 sm-h-150 border-block white-bg layout horizontal center-center text-50">
          £{ (outstandingDebt / 100).toLocaleString('en-UK') }
        </div>
      </div>
    );
  }

  renderTransactionDetails() {
    const { items, pagination } = this.props;

    return (
      <div className="mb-20">
        <div className="navy-text bold-text text-uppercase mb-10">Financial Statements</div>
        <div className="border-block white-bg p-10">
          <div className="layout horizontal end-justified">
            <div className="w-300 mb-10">
              { /* <Input.Search placeholder="Search" /> */ }
            </div>
          </div>
          <ResponsiveTable
            rowKey="id"
            dataSource={ items }
            pagination={ pagination }
            onChange={ this.onTableChange }
            columns={ [
              { title: 'Date',
                render: record => moment(record.date).format('DD/MM/YYYY')
              },
              { title: 'Statement ID', dataIndex: 'statementId' },
              { title: 'Description', dataIndex: 'description' },
              { title: 'Amount', render: record => `£ ${round(record.amount / 100, 2)}` },
              { title: 'Actions',
                render: record => (
                  <Dropdown overlay={ this.renderMenu(record) } trigger={ ['click'] }>
                    <Icon icon="MdMoreVert" className="text-22 pointer" />
                  </Dropdown>
                )
              }
            ] }
            mobileColumns={ [
              { title: 'Description',
                render: record => (
                  <div>
                    <div>
                      <span className="bold-text">Date</span> - { moment(record.date).format('DD/MM/YYYY') }
                    </div>
                    <div>
                      <span className="bold-text">Statement ID</span> - { record.statementId }
                    </div>
                    <div>
                      <span className="bold-text">Description</span> - { record.description }
                    </div>
                    <div>
                      <span className="bold-text">Amount</span> - { record.amount }
                    </div>
                  </div>
                )
              },
              { title: 'Actions',
                render: record => (
                  <Dropdown overlay={ this.renderMenu(record) } trigger={ ['click'] }>
                    <Icon icon="MdMoreVert" className="text-22 pointer" />
                  </Dropdown>
                )
              }
            ] }
          />
        </div>
      </div>
    );
  }
  
  renderContactUs() {
    return (
      <div className="w-400">
        <div className="navy-text bold-text text-uppercase mb-10">
          Contact Us
        </div>
        <div className="p-20 border-block white-bg">
          <Row type="flex" gutter={ 32 }>
            <Col sm={ 4 } xs={ 24 }>
              <label className="mb-5">Email:</label>
            </Col>
            <Col sm={ 20 } xs={ 24 }>
              <span className="mb-5">finance@one-transport.co.uk</span>
            </Col>
          </Row>
          <Row type="flex" gutter={ 32 }>
            <Col sm={ 4 } xs={ 24 }>
              <label className="mb-5">Phone:</label>
            </Col>
            <Col sm={ 20 } xs={ 24 }>
              <span className="mb-5">02075615929</span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={ `p-20 sm-p-10 sand-bg ${css.wrapper}` }>
        <div className="layout horizontal border-bottom mb-20">
          <div className="w-400 sm-full-width mb-20 mr-20 sm-mr-0">
            { this.renderOutstandingDebt() }
            { this.renderContactUs() }
            <Tablet>{ this.renderTransactionDetails() }</Tablet>
            <Tablet>{ this.renderChart() }</Tablet>
          </div>
          <Desktop>
            <div className="flex mb-20">
              { this.renderChart() }
              { this.renderTransactionDetails() }
            </div>
          </Desktop>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Billing);
