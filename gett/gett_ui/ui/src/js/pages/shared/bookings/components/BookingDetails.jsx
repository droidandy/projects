import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip, Rate, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { Avatar, Button, ButtonLink, Icon, Tablet, Indicator, PhoneNumber, notification } from 'components';
import MediQuery from 'react-responsive';
import GoogleMap, { Marker, Polyline } from 'components/GoogleMap';
import { bindModalState } from 'components/form';
import BookingChangeLogPopup from 'pages/admin/bookings/components/BookingChangeLog/BookingChangeLogPopup';
import PaymentDetailsPopup from 'pages/admin/settings/components/PaymentDetailsPopup';
import BookingComments from './BookingComments';
import TimeLine from './TimeLine';
import FeedbackForm from './FeedbackForm';
import SendMessagePopup from './SendMessagePopup';
import PricingPopup from './PricingPopup';
import StopPointsPopup from './StopPointsPopup';
import CancelForm from './CancelForm';
import CriticalFlagPopup from './CriticalFlagPopup';
import { showDetailsStatuses, statusLabels, journeyTypeLabels } from '../data';
import { urlFor, isBbcCompanyType, gettAnalytics } from 'utils';
import { isEmpty, get, noop, map, includes } from 'lodash';
import moment from 'moment';
import CN from 'classnames';
import sharedCss from 'pages/shared/bookings/style.css';
import css from './styles.css';

const { info } = Modal;
const smallPhoneBreakpoint = 480;

const beforeTravelStatuses = ['creating', 'order_received', 'processing', 'locating'];

function mapStateToProps(state) {
  return { booking: state.bookings.summary, companyName: state.session && state.session.layout.companyName  };
}

class BookingDetails extends PureComponent {
  static propTypes = {
    bookingId: PropTypes.number,
    booking: PropTypes.shape({
      id: PropTypes.number,
      asap: PropTypes.bool,
      pickupAddress: PropTypes.object,
      stopAddresses: PropTypes.arrayOf(PropTypes.object),
      destinationAddress: PropTypes.object,
      passenger: PropTypes.string,
      phone: PropTypes.string,
      booker: PropTypes.string,
      bookerPhone: PropTypes.string,
      flight: PropTypes.string,
      messageToDriver: PropTypes.string,
      messageFromSupplier: PropTypes.string,
      otpCode: PropTypes.string,
      references: PropTypes.arrayOf(PropTypes.object),
      events: PropTypes.arrayOf(PropTypes.object),
      driverDetails: PropTypes.shape({
        location: PropTypes.object,
        eta: PropTypes.string,
        distance: PropTypes.object
      }),
      path: PropTypes.array,
      can: PropTypes.object,
      vehicleType: PropTypes.string,
      serviceType: PropTypes.string,
      status: PropTypes.string,
      statusBeforeCancellation: PropTypes.string,
      final: PropTypes.bool,
      travelReason: PropTypes.string,
      journeyType: PropTypes.string,
      tripRating: PropTypes.number,
      alerts: PropTypes.arrayOf(PropTypes.object),
      alertLevel: PropTypes.string,
      bookerId: PropTypes.number,
      passengerId: PropTypes.number,
      recurringNext: PropTypes.bool,
      companyType: PropTypes.string,
      backOfficeBooker: PropTypes.bool,
      vendorName: PropTypes.string,
      vendorPhone: PropTypes.string
    }).isRequired,
    onGetBooking: PropTypes.func,
    onCancel: PropTypes.func,
    onRate: PropTypes.func,
    onFeedback: PropTypes.func,
    onClearAlert: PropTypes.func,
    onShowPricing: PropTypes.func,
    onSavePricing: PropTypes.func,
    onShowComments: PropTypes.func,
    onAddComment: PropTypes.func,
    onResendOrder: PropTypes.func,
    isAdminPage: PropTypes.bool,
    onToggleCriticalFlag: PropTypes.func,
    companyName: PropTypes.string
  };

  static defaultProps = {
    onGetBooking: noop
  };

  state = {
    loading: false,
    commentsVisible: false,
    paymentDetailsPopupVisible: false
  };

  componentDidMount() {
    this.props.onGetBooking(this.props.bookingId);
  }

  setMessagePopupRef = popup => this.messagePopup = popup;

  setOrderHistoryPopupRef = popup => this.orderHistoryPopup = popup;

  setStopPointsPopupRef = popup => this.stopPointsPopup = popup;

  setCriticalFlagPopupRef = popup => this.criticalFlagPopup = popup;

  get isBbcCompanyType() {
    const { companyType } = this.props.booking;

    return isBbcCompanyType(companyType);
  }

  isTimeLineHidden() {
    return this.props.booking.status === 'processing';
  }

  cancelOrder = () => {
    if (!this.props.onCancel) return;

    this.setState({ cancelFormVisible: true, cancelForm: { cancellationFee: null } });
  };

  closeCancelForm = () => {
    this.setState({ cancelFormVisible: false });
  };

  submitCancelForm = (formData) => {
    const { booking, onCancel } = this.props;

    this.setState({ loading: true, cancelFormVisible: false });

    onCancel(booking.id, formData)
      .then(() => {
        this.setState({ loading: false });
        notification.success('Order is cancelled', 5);
      })
      .catch((error) => {
        this.setState({ loading: false });
        notification.error(`Order isn't cancelled. ${error}`, 5);
      });
  };

  exportTimeline = () => {
    const { booking: { id } } = this.props;

    urlFor.download(`/api/admin/bookings/${id}/timeline`)();
  };

  exportReceipt = () => {
    const { isAdminPage, booking: { id } } = this.props;

    urlFor.download.statics((isAdminPage ? '/admin' : '') + `/documents/receipt.pdf?booking_id=${id}`)();
  };

  rateDriver = (value) => {
    this.props.onRate(this.props.booking, value);
  };

  resendOrder = () => {
    const { onResendOrder, booking: { id } } = this.props;
    const message = `Booking ${id} creation request`;

    onResendOrder(id)
      .then(() => notification.success(`${message} is sent`))
      .catch(() => notification.error(`${message} failed`));
  };

  clearAlert(alert, force) {
    if (alert.type === 'has_no_driver' && !force) {
      this.onAddComment = this.clearAlert.bind(this, alert, true);
      this.toggleComments();
    } else {
      this.props.onClearAlert(alert.id, this.props.booking.id);
    }
  }

  openStopPointsPopup = () => {
    this.stopPointsPopup.open();
  };

  openMessagePopup = () => {
    this.messagePopup.open();
  };

  openOrderHistoryPopup = () => {
    this.orderHistoryPopup.open();
  };

  toggleComments = () => {
    // when closing comments popup related to clearing alert, remove alert-specific handler
    if (this.onAddComment && this.state.commentsVisible) {
      this.onAddComment = null;
    }
    this.setState(state => ({ commentsVisible: !state.commentsVisible }));
  };

  addComment(bookingId, comment) {
    return this.props.onAddComment(bookingId, comment)
      .then(() => {
        if (this.onAddComment) {
          this.onAddComment();
          this.toggleComments();
        }
      });
  }

  showErrorLog = () => {
    const { booking: { customerCareMessage, customerCareAt } } = this.props;

    info({
      title: customerCareAt && `Error timestamp: ${moment(customerCareAt).format('DD/MM/YYYY - HH:mm')}`,
      content: customerCareMessage,
      className: 'wrap-break-word',
      width: 500
    });
  };

  shouldShowErrorLogButton() {
    const { booking: { status, statusBeforeCancellation, customerCareMessage } } = this.props;
    return !!customerCareMessage &&
      (includes(['customer_care', 'rejected'], status) ||
      (status === 'cancelled' && statusBeforeCancellation === 'customer_care')
      );
  }

  showFeedbackForm = () => {
    this.setState({ feedbackFormVisible: true, feedbackForm: { message: '' } });
  };

  closeFeedbackForm = () => {
    this.setState({ feedbackFormVisible: false });
  };

  saveFeedback = (feedback, form) => {
    this.props.onFeedback(this.props.booking, feedback)
      .then(this.closeFeedbackForm)
      .then(() => notification.success('Feedback has been saved'))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  showPaymentDetails = () => {
    this.setState({ paymentDetailsPopupVisible: true });
  };

  closePaymentDetails = () => {
    this.setState({ paymentDetailsPopupVisible: false });
  };

  showCriticalFlagPopup = () => {
    this.criticalFlagPopup.open();
  };

  onRepeatButtonClick = () => {
    const { isAdminPage, booking: { id, bookerId }, companyName } = this.props;

    if (!isAdminPage) {
      gettAnalytics('company_web|reports_bookings|repeat_booking_clicked', { orderId: id, bookerId, companyName });
    }
  };

  renderMap(cl = '') {
    const {
      id,
      pickupAddress,
      stopAddresses,
      destinationAddress,
      driverDetails,
      path,
      final,
    } = this.props.booking;

    if (!id) return null;

    const { isAdminPage } = this.props;
    const driverLocation = driverDetails.location;

    return (
      <div className={ CN('mr-20 sm-mr-0 mb-10', css.mapContainer, cl) }>
        <GoogleMap
          width="100%"
          height={ 240 }
          fitBounds
          wrapperClassName="layout horizontal center-justified"
          followPoint={ !final && driverLocation }
          directionsServiceParams={ {
            apply: destinationAddress && (!path || path.length <= 2),
            origin: pickupAddress,
            destination: destinationAddress && destinationAddress.line,
            waypoints: map(stopAddresses, address => address.line)
          } }
        >
          { map(stopAddresses, (address, i) => (
            <Marker key={ i } position={ address } icon="stop-point" stopPointNumber={ i + 1 } title={ address.line } />
          ))
          }
          <Marker key="pickup" position={ pickupAddress } icon="start" title={ pickupAddress.line } />
          { destinationAddress && <Marker key="destination" position={ destinationAddress } icon="finish" title={ destinationAddress.line } /> }
          { !final && driverLocation && <Marker key="driver" position={ driverLocation } icon="driver" title="Driver" /> }
          { path && path.length > 2 && <Polyline key="path" path={ path } /> }
        </GoogleMap>
        { isAdminPage && this.renderAlerts() }
      </div>
    );
  }

  renderPassenger(cl = '') {
    const {
      isAdminPage,
      booking: {
        passenger,
        passengerAvatarUrl,
        passengerId,
        phone
      }
    } = this.props;

    return (
      <div className={ CN('mb-20', cl) }>
        <div className="text-16 dark-grey-text light-text mb-10">Passenger</div>
        <div className="flex layout horizontal">
          <Avatar size={ 30 } name={ passenger } src={ passengerAvatarUrl } />
          <div className="ml-15">
            { isAdminPage && passengerId
              ? <Link to={ `/users/members/${passengerId}/edit` } data-name="passengerName" >{ passenger }</Link>
              : <div data-name="passengerName">{ passenger }</div>
            }
            <div className={ CN('layout horizontal grey-text mt-3',css.lineHeight20) }>
              <PhoneNumber phone={ phone } data-name="passengerPhone" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderBooker(cl = '') {
    const {
      isAdminPage,
      booking: {
        booker,
        bookerAvatarUrl,
        bookerPhone,
        bookerId,
        backOfficeBooker
      }
    } = this.props;

    return (
      <div className={ CN('mb-20', cl) }>
        <div>
          <div className="text-16 dark-grey-text light-text mb-10">Booker</div>
          <div className="flex layout horizontal">
            <Avatar size={ 30 } name={ booker } src={ bookerAvatarUrl } />
            <div className="ml-15">
              { isAdminPage
                ? <Link to={ backOfficeBooker ? `/users/admins/${bookerId}/edit` : `/users/members/${bookerId}/edit` } data-name="bookerName">{ booker }</Link>
                : <div data-name="bookerName">{ booker }</div>
              }
              { bookerPhone &&
                <div className={ CN('layout horizontal grey-text mt-3', css.lineHeight20) }>
                  <PhoneNumber phone={ bookerPhone } data-name="bookerPhone" />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderVendor(cl = '') {
    const {
      booking: {
        vendorName,
        vendorPhone
      }
    } = this.props;

    return (
      <div className={ CN('mb-20', cl) }>
        <div>
          <div className="text-16 dark-grey-text light-text mb-10">Vendor</div>
          <div data-name="vendorName">{ vendorName }</div>
          { vendorPhone &&
            <div className={ CN('layout horizontal grey-text mt-3', css.lineHeight20) }>
              <PhoneNumber phone={ vendorPhone } data-name="vendorPhone" />
            </div>
          }
        </div>
      </div>
    );
  }

  renderJourney(cl = '') {
    const {
      pickupAddress,
      stopAddresses,
      destinationAddress,
      status,
      driverDetails
    } = this.props.booking;

    return (
      <Fragment>
        { status === 'on_the_way' &&
          <div className={ CN('layout horizontal full-width sm-mt-10 mb-20', css.eta) }>
            <div className={ CN('flex layout horizontal center pl-5 br-5 mr-10', css.etaItem) }>
              <Icon icon="Eta" className="text-20 icon mr-10 grey-text" />
              <div>
                <div className="text-uppercase bold-text grey-text text-10">ETA</div>
                <div>
                  <span className="bold-text">{ driverDetails.eta || 'N/A' }</span>
                  <span className="bold-text pl-5">min</span>
                </div>
              </div>
            </div>
            <div className={ CN('flex layout horizontal center pl-5 br-5', css.etaItem) }>
              <Icon icon="Distance" className="text-20 icon mr-10 grey-text" />
              <div>
                <div className="text-uppercase bold-text grey-text text-10">Distance</div>
                <div className="br-5">
                  <span className="bold-text">{ get(driverDetails, 'distance.value', '0.00') }</span>
                  <span className="bold-text pl-5">{ get(driverDetails, 'distance.unit', 'mi') }</span>
                </div>
              </div>
            </div>
          </div>
        }
        <div className={ CN(cl, css.journeyPath) }>
          <div className={ CN('flex layout horizontal mb-35', css.journeyPoint) }>
            <Icon icon="UserIcon" className={ CN('text-30 icon vertical-middle white-bg green-text', css.journeyIcon) } />
            <div className="ml-20 layout horizontal center-center">
              { pickupAddress.line }
            </div>
          </div>
          { stopAddresses &&
            map(stopAddresses, (address, i) => (
              <div key={ i } className={ CN('flex layout horizontal mb-35', css.journeyStopPoint) }>
                <Icon icon="StopPoint" className={ CN('icon vertical-middle white-bg', css.journeyIcon) } />
                <div className="ml-20 layout horizontal center-center">{ address.line }</div>
              </div>
            ))
          }
          { destinationAddress &&
            <div className={ CN('flex layout horizontal', css.journeyPoint) }>
              <Icon icon="Destination" className={ CN('text-30 icon vertical-middle white-bg red-text', css.journeyEndIcon) } />
              <div className="ml-20 layout horizontal center-center">
                { destinationAddress.line }
              </div>
            </div>
          }
        </div>
      </Fragment>
    );
  }

  renderMessage(cl = '') {
    return (
      <div className={ CN(css.driverMessage, cl, 'layout horizontal mb-10') }>
        <div className={ CN('medium-grey-text bold-text text-12', css.lineHeight20, css.w120) }>Message To Driver:</div>
        <div data-name="messageToDriver">{ this.props.booking.messageToDriver || 'N/A' }</div>
      </div>
    );
  }

  renderMessageFromSupplier(cl = '') {
    return (
      <div className={ CN(css.driverMessage, cl, 'layout horizontal mb-10') }>
        <div className={ CN('medium-grey-text bold-text text-12', css.lineHeight20, css.w120) }>Message from Supplier:</div>
        <div data-name="messageFromSupplier">{ this.props.booking.messageFromSupplier || 'N/A' }</div>
      </div>
    );
  }

  renderTravelReason(cl = '') {
    const { travelReason } = this.props.booking;

    return (
      <div className={ CN(cl, 'layout horizontal mb-10') }>
        <div className={ CN('medium-grey-text bold-text text-12', css.lineHeight20, css.w120) }>Reason For Travel:</div>
        <div data-name="travelReason">{ travelReason }</div>
      </div>
    );
  }

  renderJourneyType(cl = '') {
    const { journeyType } = this.props.booking;

    return (
      <div className={ CN(cl, 'layout horizontal mb-10') }>
        <div className={ CN('medium-grey-text bold-text text-12', css.lineHeight20, css.w120) }>Journey Type:</div>
        <div data-name="journeyType">{ journeyTypeLabels[journeyType] }</div>
      </div>
    );
  }

  renderReferencesAndFlight(cl = '') {
    const { references, flight } = this.props.booking;
    return (
      <div className={ `mr-10 ${cl}` }>
        <div className="layout horizontal mb-10" data-name="references">
          <div className={ CN('medium-grey-text bold-text text-12', css.lineHeight20, css.w120) }>References:</div>
          <div className="layout vertical">
            { isEmpty(references)
              ? 'No references submitted'
              : map(references, ref => <div key={ ref.bookingReferenceName } >{ `${ref.bookingReferenceName}: ${ref.value}` }</div>)
            }
          </div>
        </div>
        <div className="layout horizontal mb-10">
          <div className={ CN('medium-grey-text bold-text text-12', css.lineHeight20, css.w120) }>Flight Number:</div>
          <div data-name="flightNumber">{ flight || 'N/A' }</div>
        </div>
      </div>
    );
  }

  renderOtpCode(cl = '') {
    return (
      <div className={ CN(cl, 'layout horizontal mb-10') }>
        <div className={ CN('medium-grey-text text-12', css.lineHeight20, css.w120) }>OTP Number:</div>
        <div data-name="otpCode">{ this.props.booking.otpCode || 'N/A' }</div>
      </div>
    );
  }

  renderDriverDetails(cl = '', isMobile) {
    const { driverDetails, status } = this.props.booking;

    if (includes(beforeTravelStatuses, status)) {
      return this.renderBeforeTravelStatuses(cl);
    } else if (includes(showDetailsStatuses, status) && driverDetails) {
      return this.renderExistingDetails(cl, isMobile);
    }
  }

  renderBeforeTravelStatuses(cl = '') {
    return (
      <Tablet>
        { matches => (
          <div className={ `flex layout center-center mb-20 ${cl} ${!matches && 'vertical'}` }>
            <Indicator size={ 30 } />
            <div className="text-uppercase bold-text mt-10 sm-mt-0 sm-ml-10">{ statusLabels[this.props.booking.status] }</div>
          </div>
        ) }
      </Tablet>
    );
  }

  renderExistingDetails(cl, isMobile) {
    const {
      onRate,
      booking: {
        rateable,
        driverDetails: { tripRating, info: { name, imageUrl, phoneNumber, vehicle, rating, phvLicense } },
        vehicleType,
        serviceType
      }
    } = this.props;
    const rate = <Rate value={ tripRating } className={ css.lineHeight20 } disabled={ !onRate || !rateable } onChange={ this.rateDriver } />;

    return (
      <div className={ cl }>
        <div className="text-16 light-text dark-grey-text">Driver Information</div>
        <div className="layout horizontal mr-10 mt-10 mb-20 sm-mb-0">
          { !isMobile && <Avatar size={ 70 } name={ name } src={ imageUrl } serviceType={ serviceType } /> }
          <div className={ CN('layout horizontal', { 'ml-20': !isMobile }) }>
            <div>
              <div className="layout horizontal mb-10">
                <div className={ CN('medium-grey-text bold-text text-12', css.w90, css.lineHeight20) }>Name:</div>
                <div>{ name || 'N/A' }</div>
              </div>
              <div className="layout horizontal mb-10">
                <div className={ CN('medium-grey-text bold-text text-12', css.w90, css.lineHeight20) }>Phone:</div>
                <div>{ phoneNumber || 'N/A' }</div>
              </div>
              <div className="layout horizontal mb-10">
                <div className={ CN('medium-grey-text bold-text text-12', css.w90, css.lineHeight20) }>Taxi Type:</div>
                <div>{ vehicleType }</div>
              </div>
              <div className="layout horizontal mb-10">
                <div className={ CN('medium-grey-text bold-text text-12', css.w90, css.lineHeight20) }>Taxi Model:</div>
                <div>{ vehicle.model || 'N/A' }</div>
              </div>
              <div className="layout horizontal mb-10">
                <div className={ CN('medium-grey-text bold-text text-12', css.w90, css.lineHeight20) }>Taxi Reg.:</div>
                <div>{ vehicle.licensePlate || 'N/A' }</div>
              </div>
              { serviceType === 'gett' &&
                <Fragment>
                  <div className="layout horizontal mb-10">
                    <div className={ CN('medium-grey-text bold-text text-12', css.w90, css.lineHeight20) }>Driver Rating:</div>
                    <div>{ rating || 'N/A' }</div>
                  </div>
                  <div className="layout horizontal mb-10">
                    <div className={ CN('medium-grey-text bold-text text-12', css.w90, css.lineHeight20) }>Rate Driver:</div>
                    { !rateable
                      ? <Tooltip title="Already Rated"><span>{ rate }</span></Tooltip>
                      : rate
                    }
                  </div>
                </Fragment>
              }
              { phvLicense &&
                <Fragment>
                  <div className="layout horizontal mb-10">
                    <div className={ CN('medium-grey-text bold-text text-12', css.w90, css.lineHeight20) }>PHV License:</div>
                    <div>{ phvLicense }</div>
                  </div>
                </Fragment>
              }
            </div>
          </div>
          { isMobile && <Avatar size={ 70 } name={ name } src={ imageUrl } serviceType={ serviceType } /> }
        </div>
      </div>
    );
  }

  renderAdditionalInformation(cl) {
    const { isAdminPage } = this.props;

    return (
      <div className={ cl }>
        <div className="mr-10 mb-20 sm-mb-0 sm-mt-20">
          <div className="text-16 light-text dark-grey-text">Additional Information</div>
          <div className="layout horizontal mt-10">
            <div>
              { this.isBbcCompanyType
                ? this.renderJourneyType()
                : this.renderTravelReason()
              }
              { this.renderMessage() }
              { isAdminPage && this.renderMessageFromSupplier() }
              { this.renderReferencesAndFlight('flex mb-10') }
              { isAdminPage && this.renderOtpCode() }
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderButtons(cl = '') {
    const {
      isAdminPage,
      booking: {
        id,
        passengerId,
        passenger,
        phone,
        bookerId,
        booker,
        bookerPhone,
        stopAddresses,
        driverDetails: {
          info: { name: driverName, phoneNumber: driverPhone } = {}
        },
        paymentDetails,
        can = {},
        paymentMethod,
        indicatedStatus,
        commentsCount,
        criticalFlag,
        criticalFlagEnabledAt,
        criticalFlagEnabledBy
      },
      onCancel,
      onShowPricing,
      onSavePricing,
      onShowComments,
      onToggleCriticalFlag
    } = this.props;
    const { loading } = this.state;

    return (
      <div className={ cl }>
        { !isAdminPage &&
          <Button
            onClick={ this.showFeedbackForm }
            type="secondary"
            className="mb-10 w-100"
            size="small"
          >
            Feedback
          </Button>
        }
        { can.edit &&
          <ButtonLink
            to={ `/bookings/${id}/edit` }
            type="secondary"
            className="mb-10"
            buttonClassName="w-100"
            size="small"
          >
            Edit
          </ButtonLink>
        }
        { can.repeat &&
          <ButtonLink
            type="secondary"
            onClick={ this.onRepeatButtonClick }
            to={ `/bookings/${id}/repeat` }
            className="mb-10"
            buttonClassName="w-100"
            size="small"
          >
            Repeat
          </ButtonLink>
        }
        { onCancel &&
          <Button
            onClick={ this.cancelOrder }
            disabled={ !can.cancel }
            loading={ loading }
            type="danger"
            className="mb-10 w-100"
            size="small"
          >
            Cancel
          </Button>
        }
        { isAdminPage && indicatedStatus === 'customer_care' &&
          <Button
            onClick={ this.resendOrder }
            loading={ loading }
            type="secondary"
            className="mb-10 w-100"
            size="small"
          >
            Resend
          </Button>
        }
        { can.createMessage &&
          [
            <ButtonLink
              type="secondary"
              onClick={ this.openMessagePopup }
              key="sendMessageButton"
              className="mb-10"
              buttonClassName="w-100"
              size="small"
            >
              Message
            </ButtonLink>,
            <SendMessagePopup
              bookingId={ id }
              ref={ this.setMessagePopupRef }
              passenger={ { id: passengerId, name: passenger, phone } }
              booker={ bookerPhone ? { id: bookerId, name: booker, phone: bookerPhone } : null }
              driver={ driverPhone ? { name: driverName, phone: driverPhone } : null }
              key="sendMessagePopup"
            />
          ]
        }
        { can.seeLogs &&
          [
            <ButtonLink
              type="secondary"
              onClick={ this.openOrderHistoryPopup }
              key="sendOrderHistoryButton"
              className="mb-10"
              buttonClassName="w-100"
              size="small"
            >
              Order history
            </ButtonLink>,
            <BookingChangeLogPopup
              bookingId={ id }
              ref={ this.setOrderHistoryPopupRef }
              key="sendOrderHistoryPopup"
              className="mb-10"
            />
          ]
        }
        { isAdminPage && !this.isTimeLineHidden() &&
          <Button
            onClick={ this.exportTimeline }
            loading={ loading }
            type="secondary"
            className="mb-10 w-100"
            size="small"
          >
            Export Timeline
          </Button>
        }
        { can.seePricing &&
          <PricingPopup
            bookingId={ id }
            onShow={ onShowPricing }
            onSave={ onSavePricing }
            key="pricingPopup"
            className="mb-10"
            size="small"
          />
        }
        { ['personal_payment_card', 'business_payment_card'].includes(paymentMethod) && indicatedStatus === 'billed' &&
          <Button
            onClick={ this.exportReceipt }
            loading={ loading }
            type="secondary"
            className="mb-10 w-100"
            size="small"
          >
            Download Receipt
          </Button>
        }
        { isAdminPage &&
          <div className="layout horizontal">
            <ButtonLink
              type="secondary"
              onClick={ this.toggleComments }
              key="sendMessageButton"
              className="mb-10"
              buttonClassName="w-100"
              size="small"
            >
              Comments
              { commentsCount > 0 &&
                <div className={ sharedCss.filterCount }>{ commentsCount }</div>
              }
            </ButtonLink>
            <BookingComments
              bookingId={ id }
              warning={ this.onAddComment ? 'To Dismiss Alert please add Comment' : null }
              visible={ this.state.commentsVisible }
              onClose={ this.toggleComments }
              onShow={ onShowComments.bind(null, id) }
              onAdd={ this.addComment.bind(this, id) }
            />
          </div>
        }
        { this.shouldShowErrorLogButton() &&
          <Button
            type="secondary"
            onClick={ this.showErrorLog }
            className="mb-10 w-100"
            size="small"
          >
            Error log
          </Button>
        }
        { !isEmpty(stopAddresses) &&
          [
            <Button
              type="secondary"
              onClick={ this.openStopPointsPopup }
              key="stopPointsButton"
              className="mb-10 w-100"
              size="small"
            >
              Stop points
            </Button>,
            <StopPointsPopup
              points={ stopAddresses }
              ref={ this.setStopPointsPopupRef }
              key="stopPointsPopup"
            />
          ]
        }
        { isAdminPage &&
          [
            <Button
              onClick={ this.showPaymentDetails }
              type="secondary"
              disabled={ !paymentDetails }
              key="paymentDetailsButton"
              className="mb-10 w-100"
              size="small"
            >
              Payment details
            </Button>,
            <PaymentDetailsPopup
              payment={ paymentDetails }
              onClose={ this.closePaymentDetails }
              title={ `Payment Details for Booking ${id}` }
              visible={ this.state.paymentDetailsPopupVisible }
              key="paymentDetailsPopup"
            />
          ]
        }
        { isAdminPage &&
          <div>
            <Button
              onClick={ this.showCriticalFlagPopup }
              type="secondary"
              key="criticalFlagButton"
              className="mb-10 w-100"
              size="small"
            >
              Critical Flag
            </Button>
            <CriticalFlagPopup
              key="criticalFLagPopup"
              ref={ this.setCriticalFlagPopupRef }
              id={ id }
              criticalFlag={ criticalFlag }
              criticalFlagEnabledBy={ criticalFlagEnabledBy }
              criticalFlagEnabledAt={ criticalFlagEnabledAt }
              onToggleCriticalFlag={ onToggleCriticalFlag }
            />
          </div>
        }
      </div>
    );
  }

  renderAlertItem = (alert, i) => {
    const isCritical = alert.level === 'critical';
    const { isAdminPage } = this.props;

    return (
      <div key={ i } className={ CN('relative layout horizontal p-10 mb-10 text-12 full-width mt-5', css.alertItems, isCritical ? css.critical : css.warning ) }>
        { isAdminPage &&
          <Icon
            onClick={ () => this.clearAlert(alert) }
            icon="Clear"
            className={ CN('white-text text-10 pointer', css.clearAlert) }
          />
        }
        <Icon icon="Alert" className="icon mr-10 text-30" />
        <div className={ css.lineHeight16 }>
          <div className="bold-text">Alert • { isCritical ? 'Critical' : 'Medium' }</div>
          { alert.text }
        </div>
      </div>
    );
  }

  renderAlerts() {
    const { alerts } = this.props.booking;

    if (!alerts.length){ return null; }

    return (
      <div className="layout vertical center">
        { map(alerts, this.renderAlertItem) }
      </div>
    );
  }

  renderTimeLine() {
    return !this.isTimeLineHidden() && <TimeLine booking={ this.props.booking } />;
  }

  render() {
    const {
      id,
      recurringNext,
      vendorName
    } = this.props.booking;

    if (!id) return null;

    const { isAdminPage } = this.props;

    return (
      <div data-name="bookingDetails" className="layout horizontal p-10">
        <MediQuery maxWidth={ smallPhoneBreakpoint }>
          { smallPhone => (
            <Fragment>
              <Tablet>
                { match => (
                  <div className="layout vertical full-width">
                    <div className={ CN('layout horizontal wrap', { 'vertical': match }) }>
                      { this.renderMap('flex four') }
                      <div className="flex four">
                        { this.renderJourney('sm-mt-10') }
                      </div>
                    </div>
                    <div className={ CN('mt-10 layout', css.container, { 'border-top border-bottom horizontal': !match, 'vertical': match }) }>
                      { this.renderPassenger(CN('flex four', { 'border-right mt-20': !match })) }
                      { this.renderBooker(CN('flex four layout vertical', { 'border-right': !match && vendorName, 'mt-20 ml-20': !match })) }
                      { vendorName && this.renderVendor(CN('flex four layout vertical', { 'mt-20 ml-20': !match })) }
                    </div>
                    <div className={ CN('layout wrap', css.container, match ? 'vertical' : 'horizontal border-bottom mt-20') }>
                      { this.renderDriverDetails(CN('layout vertical', { 'flex': !match }), match) }
                      { this.renderAdditionalInformation(CN('layout horizontal', { 'flex': !match })) }
                    </div>
                    <FeedbackForm
                      { ...bindModalState(this, 'feedbackForm') }
                      title="Service Feedback"
                      width={ 600 }
                      onRequestSave={ this.saveFeedback }
                      onRequestClose={ this.closeFeedbackForm }
                    />
                    <CancelForm
                      { ...bindModalState(this, 'cancelForm') }
                      width={ 600 }
                      handleFee={ isAdminPage }
                      recurring={ recurringNext }
                      onRequestSave={ this.submitCancelForm }
                      onRequestClose={ this.closeCancelForm }
                    />
                    <div className="mt-20">
                      { this.renderTimeLine() }
                    </div>
                    { smallPhone && this.renderButtons('layout vertical center mt-20') }
                  </div>
                ) }
              </Tablet>
              { !smallPhone && this.renderButtons('layout vertical justified-right ml-20') }
            </Fragment>
          ) }
        </MediQuery>
      </div>
    );
  }
}

export default connect(mapStateToProps)(BookingDetails);
