import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, notification } from 'components';
import { CompanySelector, ModalForm, Input, bindModalState } from 'components/form';
import BookingEditor from 'pages/admin/bookings/BookingEditor';
import { Spin, Modal } from 'antd';
import { find } from 'lodash';
import { post, faye } from 'utils';
import bookingsDispatchers from 'js/redux/admin/bookings.dispatchers';
import appDispatchers from 'js/redux/admin/app.dispatchers';

import css from './components/style.css';
import CN from 'classnames';

const { info } = Modal;

function mapStateToProps({ app: { companies, session: { can: { manageBookingsWithoutAuthorization } } } }) {
  return { companies, manageBookingsWithoutAuthorization };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bookingsDispatchers(dispatch, ['getBooking']),
    ...appDispatchers(dispatch, ['getCompaniesLookup'])
  };
}

class BookingCreator extends PureComponent {
  static propTypes = {
    getBooking: PropTypes.func,
    getCompaniesLookup: PropTypes.func,
    companies: PropTypes.arrayOf(PropTypes.object),
    match: PropTypes.object,
    manageBookingsWithoutAuthorization: PropTypes.bool
  };

  state = {
    step: 1,
    companyId: undefined,
    creating: false,
    showPopup: false,
    formVisible: false,
    form: {}
  };

  componentDidMount() {
    this.props.getCompaniesLookup();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  tryToAuthorize = () => {
    const { manageBookingsWithoutAuthorization } = this.props;

    if (this.selectedCompany().customerCarePasswordRequired && !manageBookingsWithoutAuthorization) {
      this.setState({ formVisible: true });
    } else {
      this.setState({ step: 2 });
    }
  };

  authorize = () => {
    const { companyId, form: { password } } = this.state;

    post('/admin/session/reincarnate', { companyId, password })
      .then(() => this.setState({ step: 2, formVisible: false }))
      .catch(res => notification.error(res.response.data.error));
  };

  onCancel = () => this.setState({ step: 1 });

  selectCompany = companyId => this.setState({ companyId });

  selectedCompany = () => find(this.props.companies, { id: +this.state.companyId }) || {};

  closeForm = () => {
    this.setState({ formVisible: false });
  };

  onSaveBookingSuccess = (data) => {
    const { channel, vehicleType, additionalBookings } = data;

    if (vehicleType === 'Special') {
      this.showCombinedNotification('special', data);
    } else {
      this.clearAdditionalBookings();
      this.additionalBookingsCount = additionalBookings.length;
      this.anyAdditionalBookings = additionalBookings.length > 0;
      this.setState({ creating: true });
      this.subscribe(channel);
      additionalBookings.forEach(b => this.subscribe(b.channel));
    }
  };

  clearAdditionalBookings() {
    this.subscriptions = [];
    this.additionalBookingsCount = 0;
    this.createdBookings = [];
  }

  subscribe(channel) {
    this.subscriptions.push(faye.on(channel, ({ data }) => {
      if (data.status == 'creating') { return; }

      if (!this.anyAdditionalBookings) {
        this.setState({ creating: false });
        this.showSingleNotification(data);
      } else if (this.additionalBookingsCount === 0 && !this.alreadyRespondedBooking(data)) {
        this.setState({ creating: false });
        this.createdBookings.push(data);
        this.showCombinedNotification('additionalBookings');
      } else if (!this.alreadyRespondedBooking(data)) {
        this.additionalBookingsCount = this.additionalBookingsCount - 1;
        this.createdBookings.push(data);
      }
    }));
  }

  alreadyRespondedBooking(data) {
    return this.createdBookings.find(cb => cb.serviceId === data.serviceId);
  }

  unsubscribe() {
    this.subscriptions && this.subscriptions.forEach(s => s.cancel());
  }

  showSingleNotification({ status, orderId }) {
    const success = status == 'order_received';

    info({
      title: (success ? 'Order created sucessfully' : 'Order not created'),
      content: (success ? `Order ID: ${orderId}` : 'Order creation issue. Please contact Gett support by phone'),
      onOk: this.goToStepOne
    });
  }

  showCombinedNotification(target, data) {
    if (target === 'additionalBookings') {
      this.showCombinedNotificationBasic(this.createdBookings);
      this.unsubscribe();
      this.clearAdditionalBookings();
    } else if (target === 'special') {
      const bookings = [data, ...data.additionalBookings].map((booking) => {
        return { status: 'order_received', orderId: booking.id.toString() };
      });
      if (bookings.length === 1) {
        this.showSingleNotification(bookings[0]);
      } else {
        this.showCombinedNotificationBasic(bookings);
      }
    }
  }

  showCombinedNotificationBasic(bookings) {
    const content = bookings.map((order) => {
      const { status, orderId } = order;

      if (status == 'order_received') {
        return `Order ID: ${orderId} created succesfully`;
      } else {
        return `Order ID: ${orderId} creation issue. Please contact Gett support by phone`;
      }
    }).join('.\n');

    info({
      title: 'Multiple orders creating finished',
      content: content,
      onOk: this.goToStepOne
    });
  }

  goToStepOne = () => {
    this.setState({ step: 1 });
    this.unsubscribe();
  };

  renderStepOne() {
    const { companyId } = this.state;

    return (
      <div className={ CN('p-20 text-center center-block', css.max500) }>
        <div className="bold-text mb-10">Company Name</div>
        <div className="mb-20">
          <CompanySelector
            onlyActive
            onlyEnterprise
            value={ companyId }
            onChange={ this.selectCompany }
            name="companySelect"
          />
        </div>
        <Button type="primary" disabled={ !companyId } onClick={ this.tryToAuthorize }>Next Step</Button>
      </div>
    );
  }

  renderStepTwo() {
    const { companyId } = this.state;
    const { match } = this.props;

    return (
      <BookingEditor
        match={ match }
        companyId={ companyId }
        onSaveBookingSuccess={ this.onSaveBookingSuccess }
        bookingsValidationEnabled={ this.selectedCompany().bookingsValidationEnabled }
        onCancel={ this.goToStepOne }
      />
    );
  }

  render() {
    const { step, creating } = this.state;

    return (
      <Spin spinning={ creating } tip="Creating..." size="large">
        <div className="p-20">
          { step == 1 ? this.renderStepOne() : this.renderStepTwo() }
        </div>
        <ModalForm
          { ...bindModalState(this) }
          width={ 400 }
          title="Customer Care Password"
          onRequestSave={ this.authorize }
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
                Company Policy: Customer is protected by password, to make bookings on behalf of a client
                please ask the calling user for their password, if the password is not correct or the user
                does not know it, then Phone Bookings are not allowed and the user should be advised
                to book online or contact their Booker/Account Manager instead.
              </p>
            </div>
          ) }
        </ModalForm>
      </Spin>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingCreator);
