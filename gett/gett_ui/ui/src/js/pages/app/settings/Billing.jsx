import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Dropdown, Alert } from 'antd';
import { Button, ActionMenu, Icon, ResponsiveTable, notification } from 'components';
import { bindState, bindModalState } from 'components/form';
import { PaymentForm, BillingForm } from './components';
import { renderCustomizedLabel } from './components/stubs';
import {
  invoiceTypeLabels,
  paymentMethodLabels,
  directDebitStatusLabels,
  renderInvoiceAmountField
} from 'pages/shared/settings/billing';
import ExportInvoices from 'pages/shared/settings/components/ExportInvoices';
import PropTypes from 'prop-types';
import moment from 'moment';
import { capitalize, includes, isEmpty, isEqual, trimStart } from 'lodash';
import { urlFor } from 'utils';
import qs from 'qs';
import CN from 'classnames';
import dispatchers from 'js/redux/app/settings.dispatchers';
import css from './Billing.css';

const { Item } = ActionMenu;

function mapStateToProps(state) {
  return {
    ...state.settings.invoices,
    paymentCard: state.settings.companyPaymentCard,
    directDebitMandate: state.settings.directDebitMandate
  };
}

class Billing extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    outstandingBalance: PropTypes.number,
    transactionHistory: PropTypes.arrayOf(PropTypes.object),
    companyPaymentTypes: PropTypes.arrayOf(PropTypes.string),
    getInvoices: PropTypes.func,
    createPayment: PropTypes.func,
    getCompanyPaymentCard: PropTypes.func,
    getCompanyPaymentMethods: PropTypes.func,
    updateCompanyPaymentCard: PropTypes.func,
    paymentCard: PropTypes.object,
    retryPayment: PropTypes.func,
    createDirectDebitMandate: PropTypes.func,
    completeDirectDebitMandate: PropTypes.func,
    getDirectDebitMandate: PropTypes.func,
    directDebitMandate: PropTypes.object
  };

  state = {
    selectedRowKeys: [],
    showError: false,
    billingForm: this.props.paymentCard || {},
    loading: false
  };

  componentDidMount() {
    this.props.getInvoices();
    this.props.getCompanyPaymentCard();
    this.props.getDirectDebitMandate();
    this.checkDirectDebitCompletion();

    this.setState({ billingForm: this.props.paymentCard });
  }

  componentDidUpdate(prevProps) {
    const { paymentCard } = this.props;
    if (!isEqual(prevProps.paymentCard, paymentCard)) {
      this.setState({ billingForm: paymentCard });
    }
  }

  isAccount() {
    return includes(this.props.companyPaymentTypes, 'account');
  }

  isCompanyCard() {
    return includes(this.props.companyPaymentTypes, 'company_payment_card');
  }

  isPeriodicCard() {
    return includes(this.props.companyPaymentTypes, 'passenger_payment_card_periodic');
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys, showError: false });
  };

  checkDirectDebitCompletion() {
    const query = qs.parse(trimStart(window.location.search, '?'));

    if (query['redirect_flow_id']) {
      this.props.completeDirectDebitMandate(query['redirect_flow_id']);
    }
  }

  payWithCard = () => {
    const { selectedRowKeys } = this.state;
    const { items } = this.props;
    const isSelected = selectedRowKeys.length > 0;
    const selectedItems = items.filter(item => includes(selectedRowKeys, item.id));

    this.setState({ showError: !isSelected });
    if (isSelected) { this.showPaymentForm(selectedItems); }
  };

  showPaymentForm(invoices) {
    this.setState({ paymentFormVisible: true, paymentForm: { invoices, paymentCard: {} } });
  }

  closePaymentForm = () => {
    this.setState({ paymentFormVisible: false, paymentForm: { paymentCard: {} } });
  };

  savePaymentForm = (payment) => {
    const { createPayment } = this.props;
    const { invoices, paymentCard } = payment;
    const invoiceIds = invoices.map(invoice => invoice.id);

    this.setState({ loading: true });

    createPayment({ invoiceIds, paymentCard })
      .then(this.closePaymentForm)
      .then(() => {
        notification.success('Payment has been created');
        this.setState({ loading: false });
      })
      .catch((e) => {
        notification.error(e.response.data.errors);
        this.setState({ loading: false });
      });
  };

  saveBillingForm = (paymentCard, form) => {
    const { updateCompanyPaymentCard } = this.props;

    updateCompanyPaymentCard(paymentCard)
      .then(() => notification.success('Payment card updated successfully'))
      .catch((e) => {
        form.setErrors(e.response.data.errors);
        notification.error('Failed to update payment card');
      });
  };

  renderChart() {
    var { transactionHistory } = this.props;
    if (isEmpty(transactionHistory)) {
      transactionHistory = [{name: 'There are no transactions yet', value: 0}];
    }

    return (
      <div className={ CN('white-bg', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ css.title }>Transaction history</div>
        </div>
        <div className="white-bg p-30">
          <ResponsiveContainer height={ 360 }>
            <BarChart data={ transactionHistory }>
              <XAxis dataKey="name" tickLine={ false } />
              <YAxis tick={ renderCustomizedLabel } tickLine={ false } axisLine={ false } />
              <CartesianGrid stroke="#d0d0d0" vertical={ false } />
              <Tooltip />
              <Bar dataKey="value" fill="#1875f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  renderMenu(record) {
    return (
      <ActionMenu>
        <Item>
          <a onClick={ urlFor.download.statics(record.pdfDocumentPath) }>
            Export PDF
          </a>
        </Item>
        { !record.isCreditNote &&
          <Item>
            <a onClick={ urlFor.download(`/api/invoices/${record.id}/export`) }>Export CSV</a>
          </Item>
        }
        { !record.isCreditNote && !this.isPeriodicCard() &&
          <Item
            onClick={ () => this.showPaymentForm([record]) }
            disabled={ record.status === 'paid' || record.status === 'processing' }
          >
            Pay
          </Item>
        }
      </ActionMenu>
    );
  }

  renderBacsPaymentDetails() {
    const { directDebitMandate } = this.props;
    const status = directDebitMandate && directDebitMandate.status;

    return (
      <div className={ CN('white-bg', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ CN('flex', css.title) }>Payment details</div>
          <div>{ directDebitStatusLabels[status] }</div>
          { status !== 'active' && status !== 'pending' &&
            <Button size="small" className="w-130" type="secondary" onClick={ this.props.createDirectDebitMandate }>
              Direct Debit Setup
            </Button>
          }
        </div>
        <div className="p-20 pb-10 pl-30 white-bg bold-text mb-10 mt-20">
          <div className="layout horizontal wrap mb-20  xs-mb-10">
            <div className={ `xs-full-width none bold-text text-12 xs-mb-5 medium-grey-text ${css.label}` }>
              Account Name:
            </div>
            <div className="flex text-12">
              One Transport Limited
            </div>
          </div>
          <div className="layout horizontal wrap mb-20  xs-mb-10">
            <div className={ `xs-full-width none bold-text text-12 xs-mb-5 medium-grey-text ${css.label}` }>
              Bank Name:
            </div>
            <div className="flex text-12">
              JPMorgan Bank N.A
            </div>
          </div>
          <div className="layout horizontal wrap mb-20  xs-mb-10">
            <div className={ `xs-full-width none bold-text text-12 xs-mb-5 medium-grey-text ${css.label}` }>
              Sort Code:
            </div>
            <div className="flex text-12">
              609242
            </div>
          </div>
          <div className="layout horizontal wrap mb-20  xs-mb-10">
            <div className={ `xs-full-width none bold-text text-12 xs-mb-5 medium-grey-text ${css.label}` }>
              Account Number:
            </div>
            <div className="flex text-12">
              41401781
            </div>
          </div>
          <div className="layout horizontal wrap mb-10  xs-mb-10">
            <div className={ `xs-full-width none bold-text text-12 xs-mb-5 medium-grey-text ${css.label}` }>
              Bank Address:
            </div>
            <div className="flex text-12">
              Chaseside, Bournemouth, UK, BH77DA
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderOutstandingBalance() {
    const isAccount = this.isAccount();
    const { outstandingBalance } = this.props;

    return (
      <div className={ CN('white-bg', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ CN('flex', css.title) }>Outstanding balance</div>
          { this.state.showError &&
            <Alert showIcon message="Please select invoice(s)" type="error" className="mr-10" />
          }
          { isAccount && <Button size="small" className="w-130" type="secondary" onClick={ this.payWithCard }>
              Pay with card
            </Button>
          }
        </div>
        <div className="white-bg layout horizontal center pl-20 pr-20 pb-10 pt-20" data-name="outstandingBalance">
          <div className={ CN('mr-20', css.icon) }>
            £
          </div>
          <div className={ CN('flex dark-grey-text', css.balance) }>
            { (outstandingBalance / 100).toLocaleString('en-UK') }
          </div>
        </div>
      </div>
    );
  }

  renderTransactionDetails() {
    const { items } = this.props;
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.status === 'paid' || record.status === 'processing' || record.isCreditNote
      })
    };

    const columns = [
      { title: 'Date',
        key: 'date',
        render: record => moment(record.createdAt).format('DD MMM YYYY')
      },
      { title: 'ID', dataIndex: 'displayId' },
      { title: 'Amount', key: 'amount', render: record => <b>{ renderInvoiceAmountField(record) }</b> },
      { title: 'Description', dataIndex: 'description' },
      { title: 'Status', dataIndex: 'statusLabel' },
      { title: 'Type', key: 'type', render: record => invoiceTypeLabels[record.type] },
      { title: 'Payment Type', key: 'paymentType', render: record => paymentMethodLabels[record.paymentType] },
      { title: 'Actions',
        key: 'actions',
        render: record => (
          <Dropdown overlay={ this.renderMenu(record) } trigger={ ['click'] }>
            <Icon icon="Dots" className="text-20 pointer dark-grey-text" />
          </Dropdown>
        )
      }
    ];

    if (this.isPeriodicCard()) {
      columns.unshift({ title: 'User', dataIndex: 'userName' });
    }

    return (
      <div className={ CN('white-bg full-width mt-20', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ CN('flex', css.title) }>Transaction details</div>
          <ExportInvoices />
        </div>
        <div className="p-20">
          <ResponsiveTable
            rowSelection={ this.isAccount() ? rowSelection : null }
            rowKey="id"
            dataSource={ items }
            columns={ columns }
            tabletColumns={ columns }
            mobileColumns={ [
              { title: 'Description',
                key: 'description',
                render: record => (
                  <div>
                    <div className="layout vertical mb-5 mt-5">
                      <span className={ CN('full-width bold-text text-12 medium-grey-text') }>Date:</span>
                      <span>{ moment(record.createdAt).format('DD MMM YYYY') }</span>
                    </div>
                    <div className="layout vertical mb-5">
                      <span className={ CN('full-width bold-text text-12 medium-grey-text') }>Invoice number:</span>
                      <span>{ record.id }</span>
                    </div>
                    <div>
                    <div className="layout vertical mb-5">
                      <span className={ CN('full-width bold-text text-12 medium-grey-text') }>Description:</span>
                      <span>{ `${moment(record.billingPeriodStart).format('DD/MM/YYYY')} - ${moment(record.billingPeriodEnd).format('DD/MM/YYYY')}` }</span>
                    </div>
                    </div>
                    <div className="layout vertical mb-5">
                      <span className={ CN('full-width bold-text text-12 medium-grey-text') }>Status:</span>
                      <span>{ capitalize(record.status) }</span>
                    </div>
                  </div>
                )
              },
              { title: 'Actions',
                key: 'actions',
                width: '20%',
                render: record => (
                  <Dropdown overlay={ this.renderMenu(record) } trigger={ ['click'] }>
                    <Icon icon="Dots" className="text-20 pointer dark-grey-text" />
                  </Dropdown>
                )
              }
            ] }
          />
        </div>
      </div>
    );
  }

  renderBillingForm() {
    return (
      <div className="mb-20">
        <BillingForm
          { ...bindState(this, 'billingForm') }
          onRequestSave={ this.saveBillingForm }
          onRetryPayment={ this.props.retryPayment }
        />
      </div>
    );
  }

  render() {
    const isAccount = this.isAccount();
    const isCompanyCard = this.isCompanyCard();

    return (
      <Fragment>
        <div className="page-title mb-30">Billing</div>
        <div className="layout horizontal xs-wrap xs-mb-20">
          <div className="layout half-width xs-full-width vertical mr-20 xs-mb-20 xs-mr-0">
            <div className="xs-full-width mb-20">
              { this.renderOutstandingBalance() }
            </div>
            <div>
              { isAccount && this.renderBacsPaymentDetails() }
              { isCompanyCard && this.renderBillingForm() }
            </div>
          </div>
          <div className="half-width xs-order-1 xs-full-width">
            { this.renderChart() }
          </div>
        </div>

        <div className="layout horizontal xs-wrap">
          { this.renderTransactionDetails() }
        </div>

        <PaymentForm
          { ...bindModalState(this, 'paymentForm') }
          width={ 720 }
          title="New Payment"
          okText="Pay"
          loading={ this.state.loading }
          onRequestSave={ this.savePaymentForm }
          onRequestClose={ this.closePaymentForm }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Billing);
