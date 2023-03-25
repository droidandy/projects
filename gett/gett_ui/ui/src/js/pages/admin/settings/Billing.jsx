import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Dropdown, Spin } from 'antd';
import { ActionMenu, Icon, ResponsiveTable, notification, confirm } from 'components';
import { bindState, bindModalState } from 'components/form';
import { InvoiceSearchForm, MarkAsPaidForm, PaymentDetailsPopup } from './components';
import {
  invoiceTypeLabels,
  paymentMethodLabels,
  paymentMethodIcons,
  renderInvoiceAmountField
} from 'pages/shared/settings/billing';
import ExportInvoices from 'pages/shared/settings/components/ExportInvoices';
import { urlFor } from 'utils';
import { isEmpty, pickBy } from 'lodash';
import CN from 'classnames';
import moment from 'moment';
import dispatchers from 'js/redux/admin/settings.dispatchers';

import css from './components/billing.css';

const { Item } = ActionMenu;

const historyPlaceholder = [{ name: 'There are no transactions yet', total: 0, collected: 0 }];

function mapStateToProps(state) {
  return {
    ...state.settings.invoices,
    can: state.app.session.can
  };
}

class Billing extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    outstandingDebt: PropTypes.number,
    history: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.object,
    getInvoices: PropTypes.func,
    deleteInvoice: PropTypes.func,
    markAsPaid: PropTypes.func,
    disableCompany: PropTypes.func,
    applyCreditNote: PropTypes.func,
    updateInvoice: PropTypes.func,
    can: PropTypes.object
  };

  state = {
    searchForm: {},
    lastQuery: {},
    loading: false,
    paymentDetailsPopup: {
      visible: false
    }
  };

  componentDidMount() {
    this.props.getInvoices();
  }

  search = (query) => {
    this.setState({ lastQuery: query });
    this.props.getInvoices(query);
  };

  resetSearch = () => {
    this.setState({ searchForm: {}, lastQuery: {} });
    this.props.getInvoices();
  };

  onTableChange = (pagination) => {
    const { lastQuery } = this.state;
    this.props.getInvoices({ page: pagination.current, ...lastQuery });
  };

  tooltipAction(promise, successMessage, failureMessage) {
    promise
      .then(() => notification.success(successMessage))
      .then(() => this.props.getInvoices(this.state.lastQuery))
      .catch(() => notification.error(failureMessage));
  }

  deleteInvoice = (invoice) => {
    this.tooltipAction(
      this.props.deleteInvoice(invoice.id),
      'Credit note deleted',
      'Failed to delete credit note'
    );
  };

  showPaymentDetails(invoice) {
    this.setState({
      paymentDetailsPopup: {
        payment: invoice.paymentDetails,
        visible: true,
        title: `Payment Details for Invoice ${invoice.id}`
      }
    });
  }

  closePaymentDetails = () => {
    this.setState({ paymentDetailsPopup: { visible: false } });
  };

  disableCompany = (companyId) => {
    confirm({
      title: 'Deactivate company',
      content: 'Are you sure you would like to Deactivate this company?',
      onOk: () => {
        this.tooltipAction(
          this.props.disableCompany(companyId),
          'Company disabled',
          'Failed to disable company'
        );
      }
    });
  };

  applyCreditNote = (invoice) => {
    this.tooltipAction(
      this.props.applyCreditNote(invoice.id),
      'Credit note applied',
      'Failed to apply credit note'
    );
  };

  showMarkAsPaidForm(invoice) {
    this.setState({ markAsPaidFormVisible: true, markAsPaidForm: invoice });
  }

  closeMarkAsPaidForm = () => {
    this.setState({ markAsPaidFormVisible: false });
  };

  saveMarkAsPaidForm = ({ id, partialPayAmount }) => {
    this.props.markAsPaid(id, partialPayAmount)
      .then(this.closeMarkAsPaidForm)
      .then(() => notification.success('Invoice partially paid'))
      .then(() => this.props.getInvoices(this.state.lastQuery))
      .catch(() => notification.error('Partial invoice payment failed'));
  };

  markAsUnderReview = ({ id }) => {
    this.updateInvoice(
      { id, underReview: true },
      'Under Review status set',
      'Under Review status not set'
    );
  };

  markAsUnpaid = ({ id }) => {
    this.updateInvoice(
      { id, underReview: false },
      'Under Review status recalled',
      'Under Review status not recalled'
    );
  };

  updateInvoice = (data, successMessage, errorMessage) => {
    this.props.updateInvoice(data)
      .then(() => notification.success(successMessage))
      .then(() => this.props.getInvoices())
      .catch(() => notification.error(errorMessage));
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
      <div className={ CN('white-bg mt-20', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ css.title }>Collected vs total</div>
        </div>
        <div className="white-bg p-30">
          <ResponsiveContainer height={ 300 }>
            <ComposedChart data={ history }>
              <XAxis dataKey="name" tickLine={ false } />
              <YAxis tick={ this.renderCustomizedLabel } tickLine={ false } axisLine={ false } />
              <CartesianGrid stroke="#d0d0d0" vertical={ false } />
              <Tooltip />
              <Bar dataKey="collected" fill="#1875f0" />
              <Line dataKey="total" stroke="red" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  renderMenu(record) {
    const { can } = this.props;

    return (
      <ActionMenu>
        <Item key="pdf">
          <a onClick={ urlFor.download.statics('/admin' + record.pdfDocumentPath) }>
            Export PDF
          </a>
        </Item>
        { !record.isCreditNote &&
          <Item key="csv">
            <a onClick={ urlFor.download(`/api/admin/invoices/${record.id}/export`) }>
              Export CSV
            </a>
          </Item>
        }
        { !record.isCreditNote && can.manageInvoices &&
          <Item key="paid" onClick={ () => this.showMarkAsPaidForm(record) } disabled={ record.status === 'paid' }>
            Mark as Paid
          </Item>
        }
        { record.underReview && can.manageInvoices &&
          <Item onClick={ () => this.markAsUnpaid(record) }>
            Mark as Unpaid
          </Item>
        }
        { !record.isCreditNote && can.toggleCompanyStatus &&
          <Item key="dis" onClick={ () => this.disableCompany(record.companyId) }>
            Disable Company
          </Item>
        }
        { !record.isCreditNote &&
          <Item key="cn">
            <Link to={ `/settings/billing/${record.id}/credit-note` }>
              Credit Note
            </Link>
          </Item>
        }
        { record.isCreditNote && record.status === 'issued' &&
          [
            <Item key="apply" onClick={ () => this.applyCreditNote(record) }>
              Apply Credit Note
            </Item>,
            <Item key="del" onClick={ () => this.deleteInvoice(record) }>
              Delete
            </Item>
          ]
        }
        { !record.isCreditNote &&
          <Item onClick={ () => this.showPaymentDetails(record) } disabled={ !record.paymentDetails }>
            Payment Details
          </Item>
        }
        { record.isReviewable && can.manageInvoices &&
          <Item onClick={ () => this.markAsUnderReview(record) }>
            Under Review
          </Item>
        }
      </ActionMenu>
    );
  }

  renderOutstandingDebt() {
    const { outstandingDebt } = this.props;

    return (
      <div className={ CN('white-bg', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ CN('flex', css.title) }>Outstanding debt</div>
        </div>
        <div className="white-bg layout horizontal center pl-20 pr-20 pb-10 pt-20" data-name="outstandingDebt">
          <div className={ CN('mr-20 yellow-text', css.icon) }>
            £
          </div>
          <div className={ CN('flex', css.balance) }>
            { (outstandingDebt / 100).toLocaleString('en-UK') }
          </div>
        </div>
      </div>
    );
  }

  renderCreatedByLink(record) {
    if (record.createdById) {
      return <Link to={ `/users/admins/${record.createdById}/edit` }>{ record.createdByName }</Link>;
    }

    return record.type === 'credit_note' ? 'Unknown' : 'N/A';
  }

  renderTransactionDetails() {
    const { items, pagination } = this.props;

    return (
      <div className={ CN('white-bg full-width', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ CN('flex', css.title) }>Invoicing details</div>
          <ExportInvoices admin />
        </div>
        <div className="p-20">
          <div className="scroll-box">
            <ResponsiveTable
              rowKey="id"
              dataSource={ items }
              pagination={ pagination }
              onChange={ this.onTableChange }
              columns={ [
                { title: 'Company',
                  key: 'company',
                  render: record => (
                    <div className="layout horizontal center">
                      { record.companyPaymentMethod && <Icon className="text-20 mr-10" icon={ paymentMethodIcons[record.companyPaymentMethod] } /> }
                      { record.companyName }
                    </div>
                  )
                },
                { title: 'User', dataIndex: 'userName' },
                { title: 'Invoice Date',
                  key: 'invoiceDate',
                  render: record => moment(record.createdAt).format('DD/MM/YYYY')
                },
                { title: 'Invoice No.', dataIndex: 'id' },
                { title: 'Amount', key: 'amount', render: renderInvoiceAmountField },
                { title: 'Status', dataIndex: 'statusLabel' },
                { title: 'Type', key: 'type', render: record => invoiceTypeLabels[record.type] },
                { title: 'Payment Type', key: 'paymentType', render: record => paymentMethodLabels[record.paymentType] },
                { title: 'Transaction ID', key: 'transactionId', render: record => record.transactionId || 'N/A' },
                { title: 'Created By', key: 'createdBy', render: this.renderCreatedByLink },
                { title: 'Paid At',
                  key: 'paidAt',
                  render: record => (record.paidAt ? moment(record.paidAt).format('DD/MM/YYYY') : '-')
                },
                { title: 'Due Date',
                  key: 'dueDate',
                  render: record => (record.overdueAt ? moment(record.overdueAt).format('DD/MM/YYYY') : '-')
                },
                { title: 'Overdue By', key: 'overdueBy', render: record => (record.overdueBy || '-') },
                { title: 'Actions',
                  key: 'actions',
                  render: record => (
                    <Dropdown overlay={ this.renderMenu(record) } trigger={ ['click'] }>
                      <Icon icon="MdMoreVert" className="text-22 pointer" />
                    </Dropdown>
                  )
                }
              ] }
              mobileColumns={ [
                { title: 'Description',
                  key: 'description',
                  render: record => (
                    <div>
                      <div>
                        <span className="bold-text">Company</span> - { record.companyName }
                      </div>
                      <div>
                        <span className="bold-text">Invoice Date</span> - { moment(record.createdAt).format('DD/MM/YYYY') }
                      </div>
                      <div>
                        <span className="bold-text">Invoice No.</span> - { record.id }
                      </div>
                      <div>
                        <span className="bold-text">Status</span> - { record.statusLabel }
                      </div>
                      { record.overdueBy &&
                        <div>
                          <span className="bold-text">Overdue By</span> - { record.overdueBy }
                        </div>
                      }
                      <div>
                        <span className="bold-text">Due Date</span> - { moment(record.dueAt).format('DD/MM/YYYY') }
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
        <MarkAsPaidForm
          { ...bindModalState(this, 'markAsPaidForm') }
          title="Mark As Paid"
          width={ 400 }
          onRequestSave={ this.saveMarkAsPaidForm }
          onRequestClose={ this.closeMarkAsPaidForm }
        />
      </div>
    );
  }

  renderInvoiceSearchForm() {
    return (
      <InvoiceSearchForm
        { ...bindState(this, 'searchForm') }
        onChange={ attrs => this.setState({ searchForm: pickBy(attrs, val => val) }) }
        onRequestSave={ this.search }
        resetDisabled={ isEmpty(this.state.lastQuery) }
        onReset={ this.resetSearch }
      />
    );
  }

  render() {
    return (
      <Fragment>
        <div className="page-title mb-30">Billing</div>
        <Spin spinning={ this.state.loading } size="large">
          <div>
            <div className="layout sm-wrap horizontal mb-20">
              <div className="half-width sm-full-width mr-20 sm-mr-0">
                { this.renderOutstandingDebt() }
                { this.renderChart() }
              </div>
              <div className=" half-width sm-full-width sm-mt-20">
                { this.renderInvoiceSearchForm() }
              </div>
            </div>
            <div>
              { this.renderTransactionDetails() }
            </div>
          </div>
          <PaymentDetailsPopup { ...this.state.paymentDetailsPopup } onClose={ this.closePaymentDetails } />
        </Spin>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Billing);
