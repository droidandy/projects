import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, BackHandler, Linking } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { Answers } from 'react-native-fabric';
import { omit, delay } from 'lodash';

import {
  cancelOrder,
  clearCurrentOrder,
  removeFields,
  resetBookingValues,
  changeFields,
  asyncChangeFields,
  changeAddress,
  setActiveBooking,
  getFormData,
  setAllowAutomationPickupChange
} from 'actions/booking';
import { postEvent } from 'actions/app/gett';
import { getCompanySettings } from 'actions/passenger';

import { sms, addresses, flightstats } from 'api';
import {
  FadeInView,
  GradientWrapper,
  OptionsModal,
  OrderHeader,
  CountdownTimer,
  SuccessPopup
} from 'components';

import { strings } from 'locales';
import {
  showConfirmationAlert,
  showInfoAlert,
  isIphoneX,
  bookingFieldsToReset,
  get,
  processLocation,
  geocode,
  getSeparatedDate,
  minutesForward,
  getCurrentOrder,
  setDefaultTimezone,
  getCurrentRoute,
  vibrate,
  isGBAddress
} from 'utils';

import { paymentTypeToAttrs } from 'containers/shared/bookings/data';

import { withTheme } from 'theme';

import {
  POINTER_DISPLAY_STATUSES,
  ORDER_RECEIVED_STATUS,
  ACTIVE_DRIVER_STATUSES,
  CANCEL_ALLOWED_STATUSES,
  CUSTOMER_CARE_STATUS,
  ACTIVE_STATUS,
  ARRIVED_STATUS,
  DRIVER_ON_WAY
} from 'utils/orderStatuses';
import {
  onMyWayOptions,
  actionsOptions,
  shouldCallDispatcher,
  cancelOptions,
  journeyType,
  journeyTypes
} from './utils';

import { FloatButton, Pointer, CancelReasonModal, OrderDetailsPanel, FutureOrderSuggestionPopup } from './components';

import styles from './styles';

class OrderScene extends PureComponent {
  static propTypes = {
    asyncChangeFields: PropTypes.func,
    bookingForm: PropTypes.object,
    busy: PropTypes.bool,
    cancelOrder: PropTypes.func.isRequired,
    changeAddress: PropTypes.func,
    changeFields: PropTypes.func,
    clearCurrentOrder: PropTypes.func,
    currentOrder: PropTypes.object,
    customerServicePhone: PropTypes.string,
    formData: PropTypes.object,
    fromNotifications: PropTypes.bool,
    fromOrderList: PropTypes.bool,
    futureOrderId: PropTypes.number,
    getCompanySettings: PropTypes.func,
    getCurrentPosition: PropTypes.func,
    getFormData: PropTypes.func,
    memberId: PropTypes.number,
    navigation: PropTypes.object,
    order: PropTypes.object,
    postEvent: PropTypes.func,
    removeFields: PropTypes.func,
    resetBookingValues: PropTypes.func,
    resizeMapToDriverAndTargetAddress: PropTypes.func,
    returnToNotifications: PropTypes.func,
    returnToOrdersList: PropTypes.func,
    setActiveBooking: PropTypes.func,
    setAllowAutomationPickupChange: PropTypes.func,
    status: PropTypes.string,
    theme: PropTypes.object
  };

  state = {
    futureOrderForm: null,
    isVisibleOptionsModal: false,
    isVisibleCancelOptionsModal: false,
    isVisibleCancelModal: false,
    isVisibleOnMyWayModal: false,
    isVisibleOrderDetailsPanel: false,
    isEditBusy: false,
    arriveIn: null
  };

  componentDidMount() {
    const { currentOrder, postEvent, getCompanySettings } = this.props;

    getCompanySettings();

    postEvent('order_history|screen_appears');

    if (currentOrder.flight && currentOrder.destinationAddress.airport && currentOrder.status === 'creating') {
      this.setFlightData(currentOrder.flight);
    }

    if (this.shouldShowPointer()) {
      postEvent('radar_screen|screen_appears');
    }

    this.registerBackListener();
    this.restoreTimer();

    setDefaultTimezone(currentOrder.timezone);
  }

  componentDidUpdate(prevProps) {
    const { futureOrderId: futureOrderIdProps, currentOrder: { timezone: timezoneOld, status: statusOld } } = prevProps;
    const { futureOrderId, currentOrder: { timezone }, postEvent } = this.props;

    if (this.gotExpectedStatus({ statusOld }, DRIVER_ON_WAY)) {
      postEvent('driver_on_the_way_screen|screen_appears');
    }

    if (this.gotExpectedStatus({ statusOld }, ARRIVED_STATUS)) {
      postEvent('driver_arrived_screen|screen_appears');
    }

    if (futureOrderId && futureOrderId !== futureOrderIdProps) {
      this.successPopup.open();
    }

    if (timezone !== timezoneOld) {
      setDefaultTimezone(timezone);
    }
  }

  componentWillUnmount() {
    this.backListener.remove();

    BackHandler.removeEventListener('hardwareBack');
  }

  gotExpectedStatus = ({ statusOld }, expectedStatus) => {
    const { currentOrder: { status } } = this.props;
    return status !== statusOld && status === expectedStatus;
  };

  restoreTimer = () => {
    const { order } = this.props;
    getCurrentOrder(order.id)
      .then((data) => {
        if (data) this.handleArriveIn(moment(data));
      });
  };

  registerBackListener = () => {
    this.backListener = BackHandler.addEventListener('hardwareBack', () => {
      const { navigation } = this.props;
      const route = getCurrentRoute(navigation);

      if (route.routeName === 'MapView') {
        this.handleBackBtnPress();
      }

      return true;
    });
  };

  setFlightData = (flight) => {
    const { bookingForm, postEvent } = this.props;
    const { year, month, day } = getSeparatedDate(bookingForm.scheduledAt);

    flightstats.getFlights({ flight, year, month, day })
      .then(({ data }) => {
        this.setState({ flightData: data[0], futureOrderForm: bookingForm }, () => {
          this.futureOrderPopup.open();
          postEvent('flight_suggestion|popup_appears');
        });
      });
  };

  resetBookingForm = () => {
    const { removeFields, resetBookingValues } = this.props;

    removeFields(bookingFieldsToReset);
    resetBookingValues();
  };

  goToInitialization = async () => {
    const { clearCurrentOrder, getCurrentPosition } = this.props;

    await clearCurrentOrder();

    getCurrentPosition({ shouldRequestPermission: false });
  };

  createNewOrder = () => {
    Answers.logCustom('user clicks create new order');

    this.props.setAllowAutomationPickupChange(true);

    this.goToInitialization();
  };

  handleBackBtnPress = () => {
    const {
      fromOrderList,
      fromNotifications,
      returnToOrdersList,
      returnToNotifications,
      setAllowAutomationPickupChange
    } = this.props;
    const { isVisibleOrderDetailsPanel } = this.state;

    setAllowAutomationPickupChange(true);

    if (isVisibleOrderDetailsPanel) {
      return this.handleClose('OrderDetailsPanel');
    }

    if (fromOrderList) {
      returnToOrdersList();
    } else if (fromNotifications) {
      returnToNotifications();
    }
    return delay(this.goToInitialization, 750);
  };

  get isDriverExist() {
    const { order: { driverDetails } } = this.props;
    return driverDetails && driverDetails.info && !!driverDetails.info.name;
  }

  handleMyLocation = () => {
    const { status, order, resizeMapToDriverAndTargetAddress } = this.props;
    const isTripActive = status === ACTIVE_STATUS;

    resizeMapToDriverAndTargetAddress(isTripActive ? 'destination' : 'pickup', order);
  };

  handleCancelOrder = () => {
    const { order, status, postEvent } = this.props;
    const isActiveDriverStatus = ACTIVE_DRIVER_STATUSES.includes(status);

    if (isActiveDriverStatus) {
      postEvent('driver_on_the_way_screen|cancel|button_clicked');
    }
    if (this.shouldShowPointer()) {
      postEvent('radar_screen|cancel|button_clicked');
    }
    if (order.recurringNext) {
      this.handleOpen('CancelOptionsModal');
    } else {
      this.confirmOrderCancelation();
    }
  };

  confirmOrderCancelation = (isRecurring) => {
    const { theme, cancelOrder } = this.props;

    vibrate({ pattern: 100, type: 'notificationWarning' });
    showConfirmationAlert({
      theme,
      title: strings('alert.title.doYouWantToCancelOrder'),
      message: strings('alert.message.cancelOrderDescription'),
      handler: () => cancelOrder({ cancelSchedule: isRecurring }).then(() => this.handleOpen('CancelModal'))
    });
  };

  confirmRecurringOrderCancelation = (isRecurring) => {
    setTimeout(() => this.confirmOrderCancelation(isRecurring), 500);
  };

  isFutureOrder = () => {
    const { order: { id, asap, indicatedStatus = 'connected' } } = this.props;
    const isOrderReceived = indicatedStatus === ORDER_RECEIVED_STATUS;

    return id && !asap && isOrderReceived;
  };

  restoreFutureOrder = () => {
    const { futureOrderForm } = this.state;
    const { changeFields } = this.props;
    changeFields({ ...futureOrderForm });
    this.setState({ futureOrderForm: null });
  };

  handleCreateOrder = () => {
    const { changeFields, changeAddress, theme, postEvent } = this.props;
    const { flightData: { arrival } } = this.state;

    postEvent('flight_suggestion|accept|button_clicked');
    this.futureOrderPopup.close();

    let queryString = arrival.name;
    if (arrival.terminal) queryString += ` Terminal ${arrival.terminal}`;

    addresses.getAddress({ string: queryString })
      .then((list) => {
        if (list[0]) {
          const { id, text, google, predefined } = list[0];
          const payload = {
            locationId: id,
            string: text,
            predefined,
            google
          };
          geocode(payload)
            .then(processLocation)
            .then((data) => {
              this.resetBookingForm();
              changeAddress(data, { type: 'pickupAddress' });

              changeFields({
                scheduledType: 'later',
                scheduledAt: setDefaultTimezone(data.timezone)(arrival.time).add(30, 'minutes')
              });
            })
            .then(() => this.props.navigation.navigate('EditOrderDetails', {
              futureFlightOrder: true,
              theme,
              restoreFutureOrder: this.restoreFutureOrder
            }));
        }
      });
  };

  handleCreateAdditionalBooking = async (type = journeyTypes.repeat) => {
    const { theme, currentOrder, asyncChangeFields, postEvent } = this.props;
    const isReverse = type === journeyTypes.reverse;
    const excludeFields = ['message', 'travelReasonId', 'flight', 'bookerReferences', 'bookingReferences'];

    postEvent(`orders_history|${journeyType(type)}_journey|button_clicked`, {
      existing_order_id: currentOrder.id,
      order_status: currentOrder.indicatedStatus
    });

    this.resetBookingForm();

    try {
      const { data } = await get(`bookings/${currentOrder.id}/${type}`);

      if (data) {
        const newBooking = {
          ...data.booking,
          ...paymentTypeToAttrs(data.booking.paymentType),
          bookerReferences: data.bookingReferences.map(r => ({ ...r, bookingReferenceId: r.id })),
          travelReasonId: data.booking?.travelReasonId?.toString(),
          UIAdditionalBooking: true
        };

        await asyncChangeFields(omit(newBooking, isReverse ? excludeFields : []));

        this.props.navigation.navigate('EditOrderDetails', { additionalOrder: true, theme });
      }
    } catch (e) {
      showInfoAlert({
        message: strings('alert.message.notRepeatRevertOrder', { type: journeyType(type) })
      });
    }
  };

  handleCallFleet = () => {
    Linking.openURL(`tel:${this.props.order.vendorPhone}`);
  };

  handleOpen = type => this.setState({ [`isVisible${type}`]: true });

  handleClose = type => this.setState({ [`isVisible${type}`]: false });

  showPanel = () => {
    Answers.logCustom('user opens order details');
    this.props.postEvent('order_details_screen|screen_appears');

    this.handleOpen('OrderDetailsPanel');
  };

  handleOnMyWay = () => {
    const { arriveIn } = this.state;

    if (!arriveIn) this.handleOpen('OnMyWayModal');
  };

  handleArriveIn = (arriveIn = null) => {
    this.setState({ arriveIn });
  };

  handleNotifyDriver = (arriveIn) => {
    const { order } = this.props;

    sms.notifyDriver(order.id, arriveIn)
      .then(() => this.handleArriveIn(minutesForward(arriveIn)));
  };

  restoreInitialFormData = () => {
    this.props.getFormData(true);
  }

  handleOpenEditor = () => {
    const { navigation, theme, getFormData } = this.props;

    this.setState({ isEditBusy: true });

    getFormData().then(() => {
      navigation.navigate('EditOrderDetails', {
        futureOrderEditing: true,
        theme,
        restoreFutureOrder: this.restoreInitialFormData
      });

      this.setState({ isEditBusy: false });
    });
  };

  renderHeader = () => (
    <OrderHeader
      status={this.props.status}
      handlePressBack={this.handleBackBtnPress}
      handlePressCreateNew={this.createNewOrder}
      backBtnTestID="orderBack"
    />
  );

  handleActivateFutureOrder = () => {
    const { futureOrderId, setActiveBooking } = this.props;

    this.successPopup.close();

    setActiveBooking(futureOrderId);
  }

  renderFloatButton = ({ iconName, label, handler = () => {}, busy, ...rest }) => (
    <FloatButton
      key={iconName}
      label={strings(`order.button.${label}`)}
      iconName={iconName}
      loading={busy}
      onPress={handler}
      style={styles.floatButton}
      labelStyle={this.props.theme.isNightMode ? styles.whiteText : {}}
      {...rest}
    />
  );

  renderInfoPanel = () => {
    const { order, status, busy, theme, memberId } = this.props;
    const { arriveIn, isEditBusy } = this.state;

    const nightMode = theme.isNightMode;

    const isCancelAllowedStatus = CANCEL_ALLOWED_STATUSES.includes(status);
    const isActiveDriverStatus = ACTIVE_DRIVER_STATUSES.includes(status);
    const isDriverOnWay = status === DRIVER_ON_WAY;
    const isCustomerCareStatus = status === CUSTOMER_CARE_STATUS;
    const isTripActive = status === ACTIVE_STATUS;
    const isDriverArrived = status === ARRIVED_STATUS;
    const isPersonalBooking = order.passengerId === memberId;

    const white = theme.formattedColor.white;
    const dark = theme.formattedColor.bgSecondary;

    const gradientColorsDark = [dark.opacity(0.8), dark.opacity(0.61), dark.opacity(0.45), dark.opacity(0)];
    const gradientColorsLight = [white.opacity(0.8), white.opacity(0.75), white.opacity(0.6), white.opacity(0)];
    const gradientStart = { x: 0, y: 1 };
    const gradientEnd = { x: 0, y: 0 };

    const withDriverGap = isIphoneX() ? 140 : 130;
    const withoutDriverGap = isIphoneX() ? 80 : 70;

    return (
      <FadeInView>
        <GradientWrapper
          style={styles.footer}
          colors={nightMode ? gradientColorsDark : gradientColorsLight}
          start={gradientStart}
          end={gradientEnd}
          pointerEvents="box-none"
        >
          <View
            style={[styles.actionContainer, { paddingBottom: this.isDriverExist ? withDriverGap : withoutDriverGap }]}
            pointerEvents="box-none"
          >
            <View style={styles.actionsRow}>
              {(isDriverOnWay || isTripActive) &&
                this.renderFloatButton({
                  iconName: 'myLocation',
                  label: 'myLocation',
                  handler: this.handleMyLocation
                })
              }
              {(isCancelAllowedStatus || isActiveDriverStatus || isCustomerCareStatus) &&
                this.renderFloatButton({
                  iconName: 'cancel',
                  label: 'cancelOrder',
                  handler: this.handleCancelOrder,
                  busy
                })
              }

              {this.isFutureOrder() && isGBAddress(order.pickupAddress) &&
                this.renderFloatButton({
                  iconName: 'edit',
                  label: 'editOrder',
                  handler: this.handleOpenEditor,
                  busy: busy || isEditBusy
                })
              }

              {shouldCallDispatcher(order) &&
                this.renderFloatButton({
                  iconName: 'dispatcher',
                  label: 'callDispatcher',
                  handler: this.handleCallFleet
                })
              }

              {isTripActive &&
                this.renderFloatButton({
                  iconName: 'dots',
                  label: 'dots',
                  handler: () => this.handleOpen('OptionsModal')
                })
              }

              {isDriverArrived && isPersonalBooking &&
                this.renderFloatButton({
                  content: arriveIn && (
                    <CountdownTimer
                      orderId={order.id}
                      onCountdownComplete={this.handleArriveIn}
                      endTime={arriveIn}
                    />
                  ),
                  iconName: 'walker',
                  label: 'walker',
                  handler: this.handleOnMyWay
                })
              }
            </View>

            <Text style={[styles.header, nightMode ? styles.whiteText : {}]}>
              {strings(`order.status.${status}`)}
            </Text>
          </View>
        </GradientWrapper>
      </FadeInView>
    );
  };

  renderModals = () => {
    const { order, customerServicePhone } = this.props;
    const {
      isVisibleCancelModal,
      isVisibleOnMyWayModal,
      isVisibleOptionsModal,
      isVisibleCancelOptionsModal
    } = this.state;

    return (
      <Fragment>
        <OptionsModal
          isVisible={isVisibleOnMyWayModal}
          options={onMyWayOptions({ notifyDriver: this.handleNotifyDriver })}
          onClose={() => this.handleClose('OnMyWayModal')}
          closeLabel={strings('modal.label.cancel')}
        />
        <CancelReasonModal
          isVisible={isVisibleCancelModal}
          onClose={() => this.handleClose('CancelModal')}
          reasons={order.cancellationReasons}
        />

        <OptionsModal
          isVisible={isVisibleOptionsModal}
          options={actionsOptions({ customerServicePhone })}
          onClose={() => this.handleClose('OptionsModal')}
        />

        <OptionsModal
          isVisible={isVisibleCancelOptionsModal}
          options={cancelOptions({ confirmOrderCancelation: this.confirmRecurringOrderCancelation })}
          onClose={() => this.handleClose('CancelOptionsModal')}
        />
      </Fragment>
    );
  };

  renderSuccessPopup = () => {
    const { bookingForm } = this.props;
    const additionalOrderBtns = [
      {
        title: strings('popup.orderCreating.button.сonfirm'),
        type: 'secondary'
      },
      {
        title: strings('popup.orderCreating.button.seeDetails'),
        onPress: this.handleActivateFutureOrder
      }
    ];

    const flightOrderBtns = [
      {
        title: strings('popup.orderCreating.button.seeDetails'),
        type: 'secondary',
        onPress: this.handleActivateFutureOrder
      },
      {
        title: strings('popup.orderCreating.button.сonfirm')
      }
    ];

    return (
      <SuccessPopup
        popupRef={(popup) => { this.successPopup = popup; }}
        title={strings('popup.orderCreating.success')}
        buttons={bookingForm.UIAdditionalBooking ? additionalOrderBtns : flightOrderBtns}
      />
    );
  };

  renderPopups = () => (
    <Fragment>
      {this.renderSuccessPopup()}
      <FutureOrderSuggestionPopup
        popupRef={(popup) => { this.futureOrderPopup = popup; }}
        flightData={this.state.flightData}
        onPress={this.handleCreateOrder}
      />
    </Fragment>
  );

  renderOrderDetailsPanel = () => (
    <OrderDetailsPanel
      navigation={this.props.navigation}
      onClose={() => this.handleClose('OrderDetailsPanel')}
      onActivate={this.showPanel}
      visible={this.state.isVisibleOrderDetailsPanel}
      onOpenEditor={this.isFutureOrder() && this.handleOpenEditor}
      handleCreateAdditionalBooking={this.handleCreateAdditionalBooking}
    />
  );

  shouldShowPointer = () => {
    const { status, order } = this.props;

    return POINTER_DISPLAY_STATUSES.includes(status) ||
      (order.status === ORDER_RECEIVED_STATUS && order.asap);
  };

  render() {
    return (
      <Fragment>
        {this.renderHeader()}

        <View style={styles.container} pointerEvents={this.shouldShowPointer() ? 'auto' : 'box-none'}>
          <View style={styles.separator} />

          {this.renderInfoPanel()}

          {this.shouldShowPointer() && <Pointer />}

          {this.renderModals()}
        </View>

        {this.renderOrderDetailsPanel()}

        {this.renderPopups()}
      </Fragment>
    );
  }
}

OrderScene.propTypes = {
  busy: PropTypes.bool,
  cancelOrder: PropTypes.func.isRequired
};

OrderScene.defaultProps = {};

const mapStateToProps = ({ booking, passenger, session }) => ({
  bookingForm: booking.bookingForm,
  busy: booking.currentOrder.busy,
  currentOrder: booking.currentOrder,
  customerServicePhone: passenger.companySettings.customerServicePhone,
  formData: booking.formData,
  futureOrderId: booking.futureOrderId,
  order: booking.currentOrder,
  memberId: session.user.memberId,
  status: booking.currentOrder.indicatedStatus || 'connected'
});

const mapDispatchToProps = {
  asyncChangeFields,
  cancelOrder,
  changeAddress,
  changeFields,
  clearCurrentOrder,
  getCompanySettings,
  getFormData,
  postEvent,
  removeFields,
  resetBookingValues,
  setActiveBooking,
  setAllowAutomationPickupChange
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(OrderScene));
