import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PieChart, Desktop, Tablet, BarChart, Button, ButtonLink, notification, Icon, confirm } from 'components';
import { ModalForm, Input, bindModalState } from 'components/form';
import CompanyComments from './CompanyComments';
import ChartCard from './ChartCard';
import { auth, post, vehiclesChartItemSorter } from 'utils';
import HtmlToPdfDownloader from 'utils/HtmlToPdfDownloader';
import dispatchers from 'js/redux/admin/companies.dispatchers';
import { chunk } from 'lodash';
import CN from 'classnames';

import sharedCss from 'pages/shared/bookings/style.css';
import css from './style.css';

function mapStateToProps(state) {
  return {
    ...state.companies.currentStats,
    canManageBookingsWithoutAuthorization: state.app.session.can.manageBookingsWithoutAuthorization
  };
}

class CompanyDetails extends Component {
  static propTypes = {
    company: PropTypes.object,
    countByStatusMonthly: PropTypes.array,
    countByStatusDaily: PropTypes.array,
    countByVehicleNameMonthly: PropTypes.array,
    countByVehicleNameDaily: PropTypes.array,
    countByPaymentTypeMonthly: PropTypes.array,
    countByPaymentTypeDaily: PropTypes.array,
    spendMonthly: PropTypes.array,
    spendDaily: PropTypes.array,
    completedByOrderType: PropTypes.array,
    creditRateMonthly: PropTypes.array,
    creditRateDaily: PropTypes.array,
    outstandingBalance: PropTypes.number,
    getStats: PropTypes.func,
    activateAllMembers: PropTypes.func,
    onToggleStatus: PropTypes.func,
    onToggleNotifications: PropTypes.func,
    onDestroyCompany: PropTypes.func,
    editURL: PropTypes.string,
    can: PropTypes.object,
    canManageBookingsWithoutAuthorization: PropTypes.bool,
    isPdf: PropTypes.bool
  };

  state = {
    customerCareForm: {},
    commentsVisible: false
  };

  componentDidMount() {
    this.props.getStats(this.props.company.id);
  }

  tryToIncarnate = () => {
    const { canManageBookingsWithoutAuthorization, company } = this.props;

    if (company.customerCarePasswordRequired && !canManageBookingsWithoutAuthorization) {
      this.setState({ customerCareFormVisible: true });
    } else {
      this.incarnate();
    }
  };

  incarnate = () => {
    const { id: companyId } = this.props.company;
    const { password } = this.state.customerCareForm;

    post('/admin/session/reincarnate', { companyId, password })
      .then(({ data }) => auth.accept(data))
      .catch(res => notification.error(res.response.data.error));
  };

  closeForm = () => {
    this.setState({ customerCareFormVisible: false });
  };

  toggleComments = () => {
    this.setState(state => ({ commentsVisible: !state.commentsVisible }));
  };

  exportPdf = () => {
    const component = <CompanyDetails isPdf { ...this.props } />;
    const downloader = new HtmlToPdfDownloader(component);
    return downloader.download('/admin/documents/company_statistics.pdf');
  };

  activateAllMembers = () => {
    const { activateAllMembers, company: { id, name, inactiveMembersCount } } = this.props;

    confirm({
      title: `Activate All Users: ${name}`,
      content: `Are you sure you would like to activate all ${inactiveMembersCount} inactive users from ${name}?`,
      onOk: () => {
        activateAllMembers(id)
          .then(() => notification.success('Members have been activated.'));
      }
    });
  };

  getButtons() {
    const {
      editURL,
      company,
      company: { active, inactiveMembersCount, commentsCount },
      onToggleStatus,
      can,
      onDestroyCompany
    } = this.props;

    return [
      can.editCompany &&
        <ButtonLink
          key="edit"
          className="mb-10"
          buttonClassName={ CN(css.w210, css.editButtons) }
          type="primary"
          to={ editURL }
          data-name="edit"
        >
          Edit
        </ButtonLink>,

      can.activateAllMembers &&
        <Button
          key="activateAllMembers"
          className={ CN('mb-10', css.w210, css.editButtons) }
          type="primary"
          disabled={ inactiveMembersCount === 0 }
          onClick={ this.activateAllMembers }
          data-name="activateAllMembers"
        >
          Activate All Users
        </Button>,

      can.toggleNotifications &&
        <div className={ css.w210 } key="toggleNotifications">
          <Button
            className={ CN('mb-10 mr-10 w-100', css.editButtons) }
            type="primary"
            onClick={ () => this.props.onToggleNotifications('notify_with_email', true) }
            data-name="emailAll"
          >
            Enable Email
          </Button>

          <Button
            className={ CN('mb-10 w-100', css.editButtons) }
            type="secondary"
            onClick={ () => this.props.onToggleNotifications('notify_with_email', false) }
            data-name="disableEmailAll"
          >
            Disable Email
          </Button>

          <Button
            className={ CN('mb-10 mr-10 w-100', css.editButtons) }
            type="primary"
            onClick={ () => this.props.onToggleNotifications('notify_with_sms', true) }
            data-name="smsAll"
          >
            Enable SMS
          </Button>

          <Button
            className={ CN('mb-10 w-100', css.editButtons) }
            type="secondary"
            onClick={ () => this.props.onToggleNotifications('notify_with_sms', false) }
            data-name="disableSmsAll"
          >
            Disable SMS
          </Button>

          <Button
            className={ CN('mb-10 mr-10 w-100', css.editButtons) }
            type="primary"
            onClick={ () => this.props.onToggleNotifications('notify_with_push', true) }
            data-name="pushAll"
          >
            Enable Push
          </Button>

          <Button
            className={ CN('mb-10 w-100', css.editButtons) }
            type="secondary"
            onClick={ () => this.props.onToggleNotifications('notify_with_push', false) }
            data-name="disablePushAll"
          >
            Disable Push
          </Button>
        </div>,

      <Button
        key="manage"
        className={ CN('mb-10', css.w210, css.editButtons) }
        type="secondary"
        disabled={ !active }
        onClick={ this.tryToIncarnate }
        data-name="manage"
      >
        Manage Bookings
      </Button>,

      can.disableCompany &&
        <Button
          key="toggle"
          className={ CN('mb-10', css.w210, css.editButtons) }
          type="secondary"
          onClick={ onToggleStatus }
          data-name={ active ? 'deactivate' : 'activate' }
        >
          { active ? 'Deactivate' : 'Activate' }
        </Button>,

      company.canDestroy &&
        <Button
          key="destroy"
          className={ CN('mb-10', css.w210, css.editButtons) }
          type="secondary"
          onClick={ onDestroyCompany }
          data-name="destroy"
        >
          Delete
        </Button>,

      <Button
        key="comments"
        className={ CN('mb-10', css.w210, css.editButtons) }
        type="secondary"
        onClick={ this.toggleComments }
      >
        Comments
        { commentsCount > 0 &&
          <div className={ sharedCss.filterCount }>{ commentsCount }</div>
        }
      </Button>,

      <Button key="export" onClick={ this.exportPdf } type="secondary" className={ CN(css.w210, css.editButtons) }>
        Export
      </Button>
    ];
  }

  getCharts() {
    const {
      countByStatusMonthly,
      countByStatusDaily,
      countByVehicleNameMonthly,
      countByVehicleNameDaily,
      countByPaymentTypeMonthly,
      countByPaymentTypeDaily,
      spendMonthly,
      spendDaily,
      completedByOrderType,
      creditRateMonthly,
      creditRateDaily,
      isPdf
    } = this.props;

    const creditRateReferenceLineOptions = {
      y: 561,
      stroke: 'red',
      label: { position: 'top', value: 'Credit Rate Limit' },
      strokeDasharray: '3 3'
    };

    return [
      <ChartCard key="mo" title="Monthly Orders" className="mr-20 sm-mr-0" isPdf={ isPdf }>
        <BarChart
          yAxisLabel="Orders"
          generalData={ countByStatusMonthly }
          extendedData={ countByStatusDaily }
          isPdf={ isPdf }
          pdfHeight={ 290 }
          name="monthly_orders_chart"
        />
      </ChartCard>,
      <ChartCard key="ct" title="Completed Orders by Car Type" className="mr-20 sm-mr-0" isPdf={ isPdf }>
        <BarChart
          yAxisLabel="Orders"
          generalData={ countByVehicleNameMonthly }
          extendedData={ countByVehicleNameDaily }
          isPdf={ isPdf }
          height={ 500 }
          pdfHeight={ 290 }
          tooltipOptions={ { itemSorter: vehiclesChartItemSorter } }
          name="completed_by_car_type_chart"
        />
      </ChartCard>,
      <ChartCard key="ms" title="Monthly Spend" className="mr-20 sm-mr-0" isPdf={ isPdf }>
        <BarChart
          yAxisLabel="Pounds"
          generalData={ spendMonthly }
          extendedData={ spendDaily }
          unit=" £"
          isPdf={ isPdf }
          pdfHeight={ 290 }
          name="monthly_spend_chart"
        />
      </ChartCard>,
      <ChartCard key="pt" title="Completed Orders by Payment Type" className="mr-20 sm-mr-0" isPdf={ isPdf }>
        <BarChart
          yAxisLabel="Orders"
          generalData={ countByPaymentTypeMonthly }
          extendedData={ countByPaymentTypeDaily }
          isPdf={ isPdf }
          pdfHeight={ 290 }
          name="completed_by_payment_type_chart"
        />
      </ChartCard>,
      <ChartCard key="ot" title="Order Types" isPdf={ isPdf }>
        <Desktop>
          { matches => (
            <PieChart
              matches={ matches }
              data={ completedByOrderType }
              unit="valueAndPercentage"
              isPdf={ isPdf }
              name="order_types_chart"
            />
          ) }
        </Desktop>
      </ChartCard>,
      <ChartCard key="crh" title="Credit Rating History" className={ sharedCss.lastChartItem } isPdf={ isPdf }>
        <BarChart
          yAxisLabel="Rating"
          generalData={ creditRateMonthly }
          extendedData={ creditRateDaily }
          referenceLineOptions={ creditRateReferenceLineOptions }
          isPdf={ false }
          name="credit_rating_chart"
          noDataMessage="There are no history yet"
        />
      </ChartCard>
    ];
  }

  wrapInPage(components) {
    return (
      <div className="page-break-avoid p-20">
        { this.renderPdfHeader() }
        { components }
      </div>
    );
  }

  renderOutstandingBalance() {
    const { outstandingBalance } = this.props;

    return (
      <div className="full-width mt-10">
        <div className="bold-text text-uppercase mb-10">Outstanding Balance</div>
        <div className="h-290 sm-h-150 border-block white-bg layout horizontal center-center text-50" data-name="outstanding_balance">
          £{ (outstandingBalance / 100).toLocaleString('en-UK') }
        </div>
      </div>
    );
  }

  renderSpecialPanel() {
    return (
      <div className="flex layout vertical center sm-full-width mb-20">
        { this.getButtons() }
        { this.renderOutstandingBalance() }
      </div>
    );
  }

  renderPdfHeader() {
    return (
      <div className="pdf-header mb-10">
        <Icon icon="LogoOT" width={ 130 } height={ 50 } className="mb-10" />
      </div>
    );
  }

  renderPdf() {
    const pageCapacity = 2;
    const pdfComponents = [...this.getCharts(), this.renderOutstandingBalance()];
    const pages = chunk(pdfComponents, pageCapacity);

    return (
      <div className="text-center bold-text">
        { pages.map((page, i) => <div key={ i }>{ this.wrapInPage(page) }</div>) }
      </div>
    );
  }

  render() {
    const { company, isPdf } = this.props;
    const { commentsVisible } = this.state;

    if (isPdf) return this.renderPdf();

    const charts = this.getCharts();

    const firstRowCharts = charts.slice(0, 2);
    const secondRowCharts = charts.slice(2, 5);
    const thirdRowCharts = charts.slice(5, 6);

    return (
      <div className="p-20 sm-p-0" data-name="companyDetails">
        <div className="layout horizontal sm-wrap">
          <Tablet>{ this.renderSpecialPanel() }</Tablet>
          { firstRowCharts }
          <Desktop>{ this.renderSpecialPanel() }</Desktop>
        </div>
        <div className="layout horizontal sm-wrap">
          { secondRowCharts }
        </div>
        { thirdRowCharts }
        <ModalForm
          { ...bindModalState(this, 'customerCareForm') }
          width={ 400 }
          title="Customer Care Password"
          onRequestSave={ this.incarnate }
          onRequestClose={ this.closeForm }
          okText="Submit"
          validations={ { password: 'presence' } }
        >
          { $ => (
            <div>
              <Input
                { ...$('password') }
                type="password"
                className="mb-20"
                label="Password"
                labelClassName="required mb-5"
                allowShowPassword
              />
              <p>
                Company Policy: Customer is protected by password, to make bookings on behalf of client
                please ask password from calling user, if password is not correct or user does not know
                password then Phone Bookings are not allowed and user should be informed to book online
                or contact their Booker/Account Manager
              </p>
            </div>
          ) }
        </ModalForm>
        <CompanyComments companyId={ company.id } visible={ commentsVisible } onClose={ this.toggleComments } />
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(CompanyDetails);
