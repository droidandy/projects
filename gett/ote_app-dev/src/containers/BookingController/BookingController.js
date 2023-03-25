import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment-timezone';
import { isEmpty, find, isNull, isEqual, isUndefined, keyBy } from 'lodash';

import {
  PointList,
  AddressModal,
  StopPointsModal,
  Icon,
  Divider,
  InformView,
  Button
} from 'components';

import {
  paymentTypeLabels,
  areUniqueAddresses,
  sortVehicles,
  preBookCars
} from 'containers/shared/bookings/data';

import { strings } from 'locales';

import {
  throttledAction,
  isEnoughOrderData,
  momentDate,
  prepareVehicleProperties,
  minutesForward,
  getMinimalFutureOrderDelay,
  showInfoAlert,
  isGBAddress,
  deviceWidth,
  prepareStopPoint,
  prepareVehicleAttrs
} from 'utils';

import { utils, containers } from 'testIDs';

import { PickUpTime, PickUpLabel, AvailableCars, ModalWithContent, CardsPopup } from './components';

import { prepareDefaultValues } from './utils';
import styles from './styles';

const CAR_BLOCK_WIDTH = 120;

const { Orders } = containers;

const IDs = utils.options;

export default class BookingController extends Component {
  static propTypes = {
    asyncChangeFields: PropTypes.func,
    booking: PropTypes.object,
    canSeeBookers: PropTypes.bool,
    changeAddress: PropTypes.func,
    changeFields: PropTypes.func,
    changeMessageToDriver: PropTypes.func,
    createBooking: PropTypes.func,
    getFormDetails: PropTypes.func,
    getPassengerData: PropTypes.func,
    navigation: PropTypes.object,
    passenger: PropTypes.object,
    postEvent: PropTypes.func,
    saveAvailableCarsScroll: PropTypes.func,
    saveFlight: PropTypes.func,
    theme: PropTypes.object,
    validateReferences: PropTypes.func
  };

  state = {
    skipFlight: false,
    loadBookingRequested: false,
    isStopPointsModalVisible: false,
    isFocused: this.props.navigation ? this.props.navigation.isFocused() : false,
    previousVehicleName: null
  };

  setAvailableCarsRef = (el) => { this.availableCars = el; };

  setCardsPopupRef = (el) => { this.cardsPopup = el; };

  setAddressModalRef = (el) => { this.addressModal = el; };

  setPickUpTimeModalRef = (el) => { this.pickUpTimeModal = el; };

  componentDidMount() {
    const { navigation } = this.props;

    this.subscriptions = [
      navigation.addListener('didFocus', () => this.setState({ isFocused: true })),
      navigation.addListener('willBlur', () => this.setState({ isFocused: false }))
    ];
    this.updateAvailableCarsScroll();
  }

  componentDidUpdate({ booking: { bookingForm: { availableCarsScroll, destinationAddress } } }) {
    if (!this.state.isFocused && availableCarsScroll !== this.props.booking.bookingForm.availableCarsScroll) {
      this.updateAvailableCarsScroll();
    }

    if (!destinationAddress && this.props.booking.bookingForm.destinationAddress && !this.areAddressesUnique()) {
      this.handleDuplicatedAddresses();
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.remove());
  }

  getOrder() {
    return this.props.booking.bookingForm;
  }

  updateAvailableCarsScroll(value, animated = false) {
    if (!this.availableCars) return;

    setTimeout(() => {
      if (value && this.getAvailableCarsWidth() < value + (CAR_BLOCK_WIDTH * 3)) {
        this.availableCars.scrollToEnd({ animated });
      } else {
        this.availableCars.scrollTo({
          x: isUndefined(value) ? this.props.booking.bookingForm.availableCarsScroll : value,
          animated
        });
      }
    }, 0);
  }

  updateScrollToCar = (name) => {
    if (name) {
      this.updateAvailableCarsScroll(this.getAvailableCarsScrollShift(name), true);
    }
  };

  getAvailableCarsScrollShift(vehicle) {
    return this.getAvailableCarsWidth() > deviceWidth
      ? this.getAvailableVehicles().findIndex(v => v.name === vehicle) * CAR_BLOCK_WIDTH
      : 0;
  }

  getAvailableCarsWidth = () => this.getAvailableVehicles().length * CAR_BLOCK_WIDTH;

  filtrateVehicles = vehicle => vehicle.available || vehicle.prebook;

  getAvailableVehicles = () => {
    const { booking: { vehiclesData: { vehicles } } } = this.props;

    const availableCars = vehicles.filter(this.filtrateVehicles);
    const { asap, scheduledType, pickupAddress } = this.getOrder();
    return (asap || scheduledType === 'now') && isGBAddress(pickupAddress)
      ? sortVehicles(availableCars, 'now')
      : sortVehicles(availableCars, 'preBook');
  };

  shouldRequestVehicles = () => {
    const { booking: { bookingForm } } = this.props;

    return isEnoughOrderData(bookingForm);
  };

  requestFormDetailsOnOrderChange = (bookingFormProps, additionalParams = {}) => {
    const { booking: { vehiclesData, bookingForm } } = this.props;
    const { isStopPointsModalVisible } = this.state;
    const isUserChanged = !isEqual(bookingForm.passengerId, bookingFormProps.passengerId);
    const isDriveChanged =
      (!vehiclesData.loaded && !vehiclesData.loading) ||
      isUserChanged ||
      !isEqual(bookingForm.pickupAddress, bookingFormProps.pickupAddress) ||
      !isEqual(bookingForm.destinationAddress, bookingFormProps.destinationAddress) ||
      !isEqual(bookingForm.stops, bookingFormProps.stops) ||
      (bookingFormProps.paymentMethod && !isEqual(bookingForm.paymentMethod, bookingFormProps.paymentMethod));

    if (!isStopPointsModalVisible && isDriveChanged) {
      this.requestFormDetails({
        requestVehicles: true,
        requestPaymentTypes: isUserChanged || !vehiclesData.loaded,
        preservePaymentType: !isUserChanged && additionalParams.preservePaymentType
      });
    }
  };

  requestFormDetails = (params = {}) => {
    if (!this.shouldRequestVehicles()) return;

    this.props.getPassengerData(); // TODO should be moved to form_details request

    this.props.getFormDetails(this.props.booking.bookingForm, params)
      .then(res => this.updateScrollToCar(res.attrs?.vehicle?.name));
  };

  requestVehicles = () => this.requestFormDetails({ requestVehicles: true });

  getPassenger = () => {
    const {
      booking: { formData: { passenger, passengers }, bookingForm: { passengerId } },
      passenger: { data: { passenger: passengerData, favoriteAddresses } }
    } = this.props;

    return (!isEmpty(passengerData) && { ...passengerData, favoriteAddresses }) ||
      passenger ||
      find(passengers, { id: +passengerId });
  };

  isPathContainAirport = () => {
    const { booking: { bookingForm: { pickupAddress, destinationAddress, stops, flight } } } = this.props;

    const airports = [
      pickupAddress.airport,
      ...(stops || []).filter(stop => stop.airport),
      destinationAddress.airport
    ];
    return airports.some(Boolean) && !flight;
  };

  isValidPreBookTime = () => {
    const { booking: {
      bookingForm: { isPreBookVehicle, scheduledType, scheduledAt, vehicleName },
      vehiclesData: { vehicles }
    } } = this.props;

    if (!isPreBookVehicle) return true;

    const minDate = minutesForward(getMinimalFutureOrderDelay(vehicleName, vehicles));

    return scheduledType !== 'now' && minDate.isBefore(scheduledAt);
  };

  openPickUpTimeModal = () => {
    this.pickUpTimeModal.openPickerModal();
  };

  handleBookingCreation = throttledAction(() => {
    const { postEvent } = this.props;
    if (!this.isValidPreBookTime()) {
      return this.openPickUpTimeModal();
    }
    if (this.isPathContainAirport()) {
      return this.onOpenModal({ modalContent: 'flightSettings', skipFlight: true });
    }
    postEvent('order_details_screen|order_ride|button_clicked');
    return this.createBooking();
  });

  areAddressesUnique = (editedStops) => {
    const { booking: { bookingForm: { pickupAddress, stops, destinationAddress } } } = this.props;
    const addresses = [pickupAddress, ...(editedStops || stops || []), destinationAddress];

    return areUniqueAddresses(addresses);
  };

  displayErrorAlert = () => {
    const { booking: { bookingForm } } = this.props;
    if (bookingForm.bookerReferencesErrors) {
      showInfoAlert({ message: strings('alert.message.referenceErrors') });
    }
    if (!bookingForm.paymentMethod) {
      this.cardsPopup.open();
    }
  };

  showErrorFor = (type) => {
    const { booking: { orderErrors } } = this.props;
    const error = orderErrors?.[type];

    if (error) {
      const message = type === 'flight' ? error[0] : strings(`alert.message.${type}`);
      showInfoAlert({ message });
    }
  };

  showAlert = () => {
    const { booking: { orderErrors } } = this.props;

    const errorFields = ['scheduledAt', 'paymentMethod', 'referenceErrors', 'flight'];

    errorFields.forEach(this.showErrorFor);

    if (orderErrors) {
      this.closeModal('Custom');
    }
  };

  handleDuplicatedAddresses = () => {
    showInfoAlert({ message: strings('alert.message.pathDuplication') });
  };

  shouldOrderRide = () => {
    const { booking: { bookingForm } } = this.props;

    return this.shouldRequestVehicles() && bookingForm.vehicleName && !isNull(bookingForm.vehiclePrice);
  };

  createBooking = async () => {
    const { booking: { bookingForm }, createBooking, validateReferences, navigation } = this.props;

    if (this.areAddressesUnique()) {
      const order = {
        ...bookingForm,
        scheduledAt: bookingForm.scheduledType !== 'now' ? momentDate(bookingForm.scheduledAt).format() : null
      };

      this.closeModal('Custom');
      this.setState({ skipFlight: false });

      if (isEmpty(await validateReferences()) && bookingForm.paymentMethod) {
        createBooking(order)
          .then(() => navigation.goBack(null))
          .catch(this.showAlert);
      } else {
        this.displayErrorAlert();
      }
    } else {
      this.handleDuplicatedAddresses();
    }
  };

  openAddressModal = (address, meta) => {
    this.addressModal.open(address, meta);
  };

  handleEditPoint = (address, meta) => {
    this.setState({ isStopPointsModalVisible: false }, () => {
      setTimeout(() => this.openAddressModal(address, meta), 500);
    });
  };

  handleAddStop = () => {
    this.handleEditPoint(null, { type: 'stops' });
  };

  showStopPointsModal = () => {
    this.setState({ isStopPointsModalVisible: true });
  };

  hideStopPointsModal = () => {
    this.setState({ isStopPointsModalVisible: false });
  };

  prepareStopsData = () => {
    const { booking: { bookingForm: { stops } } } = this.props;

    return keyBy((stops || []).map((s, index) => ({ ...s.address, index })), s => `stop${s.index}`);
  };

  onChangeAddress = (address, meta) => {
    const { booking, changeAddress, changeFields } = this.props;

    if (meta.type === 'pickupAddress' && !isGBAddress(address) && booking.bookingForm.stops) {
      changeFields({ stops: [] });
    }

    changeAddress(address, meta);
  };

  getEarliestAvailableTime = (vehicleName) => {
    const { booking: { vehiclesData: { vehicles } } } = this.props;

    return minutesForward(getMinimalFutureOrderDelay(vehicleName, vehicles));
  };

  selectVehicle = (vehicleName) => {
    const {
      booking: {
        vehiclesData: { vehicles },
        bookingForm: { scheduledType, scheduledAt, vehicleName: previousVehicleName }
      },
      asyncChangeFields,
      postEvent
    } = this.props;

    const vehicle = vehicles.find(v => ((v.available || preBookCars.includes(v.name)) && v.name === vehicleName));

    if (!vehicle) return;

    if (vehicle.prebook) {
      this.setState({ previousVehicleName });
    }

    const attrs = prepareVehicleAttrs(vehicle, { touched: true });

    postEvent('ordering_screen|class_clicked', prepareVehicleProperties(vehicle));

    if (scheduledType !== 'now') {
      const selected = moment(scheduledAt);
      const available = this.getEarliestAvailableTime(vehicleName);

      if (selected.isBefore(available)) {
        attrs.scheduledAt = available;
      }
    }
    asyncChangeFields(attrs)
      .then(() => {
        if (!this.isValidPreBookTime() && vehicleName) {
          this.openPickUpTimeModal();
        }
      });
  };

  handleAvailableCarsScroll = (e) => {
    const { saveAvailableCarsScroll, postEvent } = this.props;
    if (this.state.isFocused) {
      postEvent('ordering_screen|class_scroll');
      saveAvailableCarsScroll(e.nativeEvent.contentOffset.x);
    }
  };

  getReasonsName = (id) => {
    const { booking: { formData: { travelReasons } } } = this.props;
    return ((travelReasons && travelReasons.find(r => r.id === +id)) || { name: strings('booking.label.other') }).name;
  };

  renderNoVehiclesMessage = ({ style } = {}) => (
    <InformView style={[styles.footerOrderInfo, style, { backgroundColor: this.props.theme.color.bgPrimary }]}>
      <Text style={[styles.informText, { color: this.props.theme.color.primaryText }]}>
        {strings('information.noVehicles')}
      </Text>
    </InformView>
  );

  renderDetailItem = ({
    title, value, numberOfLines = 1, icon, onPress = () => {}, chevron = true, error, testID
  }, i, arr) => (
    <View key={title}>
      <TouchableWithoutFeedback onPress={onPress} testID={testID}>
        <View style={[styles.row, styles.listOption]}>
          {icon && <Icon name={icon} color={this.props.theme.color.primaryText} />}
          {!value && error && <View style={styles.errorDot} />}

          <View style={[styles.titleContainer, icon ? styles.iconGap : {}]}>
            <Text style={[styles.title, value ? {} : styles.emptyValueTitle]}>{title}</Text>
            {!!value &&
              <Text
                style={[
                  styles.value,
                  { color: this.props.theme.color.primaryText },
                  error ? styles.valueWithError : {}
                ]}
                numberOfLines={numberOfLines}
                testID={`${testID}/value`}
              >
                {value}
              </Text>
            }
          </View>

          {chevron && <Icon name="chevron" color={this.props.theme.color.arrowRight} width={10} />}
        </View>
      </TouchableWithoutFeedback>
      {arr && i + 1 < arr.length && <Divider style={styles.divider} />}
    </View>
  );

  openModal = (name) => {
    this.setState({ [`is${name}ModalVisible`]: true });
  };

  closeModal = (name) => {
    this.setState({ [`is${name}ModalVisible`]: false });
  };

  getReferenceError(i) {
    const { booking: { bookingForm: { bookerReferencesErrors = {} } } } = this.props;

    return bookerReferencesErrors && bookerReferencesErrors[`bookerReferences.${i}.value`];
  }

  onPressReferenceItem = (referenceIndex) => {
    this.setState({ referenceIndex });
    this.onOpenModal({ modalContent: 'references' });
  };

  getReferencesItems = () => {
    const { booking: { bookingForm: { bookerReferences = [] } }, navigation: { state: { params = {} } } } = this.props;

    return bookerReferences.map((item, i) => ({
      title: item.name,
      value: item.value || '',
      error: this.getReferenceError(i),
      chevron: !params.futureOrderEditing,
      onPress: () => !params.futureOrderEditing && this.onPressReferenceItem(i)
    }));
  };

  getAdditionalDetailsItems({ isOrderEditing = false } = {}) {
    const {
      booking: { currentOrder, orderErrors },
      canSeeBookers,
      navigation: { state: { params = {} } }
    } = this.props;

    const order = this.getOrder();
    let options = [
      {
        title: 'Order for',
        value: order.passenger || order.passengerName,
        icon: 'avatar',
        chevron: !isOrderEditing && canSeeBookers,
        onPress: () => !isOrderEditing && canSeeBookers && this.onOpenModal({ modalContent: 'passengersList' }),
        testID: IDs.orderFor
      },
      { title: 'Message for driver',
        value: order.message,
        icon: 'message',
        numberOfLines: 2,
        onPress: () => this.onOpenModal({ modalContent: 'messageToDriver' }),
        testID: IDs.messageForDriver
      },
      { title: 'Trip reason',
        value: this.getReasonsName(order.travelReasonId),
        icon: 'rides',
        onPress: () => this.onOpenModal({ modalContent: 'reasonForTravel' }),
        testID: IDs.tripReason
      },
      { title: 'Payment method',
        value: paymentTypeLabels[order.paymentMethod],
        icon: 'paymentMethod',
        onPress: () => this.onOpenModal({ modalContent: 'paymentsOptions' }),
        testID: IDs.paymentMethod
      },
      {
        title: 'Flight number',
        value: order.flight,
        error: !order.flight && orderErrors?.flight?.[0],
        icon: 'flight',
        onPress: () => this.onOpenModal({ modalContent: 'flightSettings', skipFlight: false }),
        testID: IDs.flightNumber
      }
    ];

    if (currentOrder.id && !currentOrder.asap && !params.additionalOrder) options.splice(2, 1);

    if (order.supportsDriverMessage === false) {
      options = options.filter(o => o.title !== 'Message for driver');
    }

    if (order.supportsFlightNumber === false) {
      options = options.filter(o => o.title !== 'Flight number');
    }

    return options;
  }

  renderAdditionalDetails({ labelStyle, style, items, label }) {
    return (
      <Fragment>
        {label && <Text style={[styles.detailsLabel, labelStyle]}>{label}</Text>}
        <View style={style}>
          {items.map(this.renderDetailItem)}
        </View>
      </Fragment>
    );
  }

  onCarSelect = (vehicleName) => {
    this.selectVehicle(vehicleName);
  };

  renderAvailableCars() {
    const { booking: { vehiclesData } } = this.props;
    return (
      <AvailableCars
        booking={this.getOrder()}
        availableVehicles={this.getAvailableVehicles()}
        onCarSelect={this.onCarSelect}
        onScroll={this.handleAvailableCarsScroll}
        scrollRef={this.setAvailableCarsRef}
        loading={vehiclesData.loading}
      />
    );
  }

  renderCars = ({ style } = {}) => {
    const { booking: { vehiclesData } } = this.props;
    const availableVehicles = this.getAvailableVehicles();
    const shouldRequestVehicles = this.shouldRequestVehicles();
    const displayCarsCondition = vehiclesData.loading || (!vehiclesData.loading && availableVehicles.length > 0);

    return shouldRequestVehicles && (
      <Fragment>
        <Divider left={0} style={styles.pointListDivider} />
        {displayCarsCondition && this.renderAvailableCars()}
        {!vehiclesData.loading && vehiclesData.loaded && availableVehicles.length === 0 &&
          this.renderNoVehiclesMessage({ style })
        }
      </Fragment>
    );
  };

  renderPointList(params = {}) {
    const order = this.getOrder();
    return (
      <PointList
        onAddressPress={this.openAddressModal}
        onStopAdd={this.showStopPointsModal}
        data={params.data || order}
        pickUpTestID={`${params.prefix}/${Orders.pickupAddress}`}
        destinationTestID={`${params.prefix}/${Orders.destinationAddress}`}
        addStopTestID={`${params.prefix}/${Orders.addStopAddress}`}
        {...params}
      />
    );
  }

  onRevertVehicle = () => {
    if (!this.isValidPreBookTime()) {
      this.selectVehicle(this.state.previousVehicleName);
    }
  };

  renderPickUpTime({ editingDisable = false, style, futureOrderEditing }) {
    const order = this.getOrder();
    const Component = editingDisable ? PickUpLabel : PickUpTime;

    return (
      <Component
        innerRef={!editingDisable && this.setPickUpTimeModalRef}
        futureOrderEditing={futureOrderEditing}
        editingDisable={editingDisable}
        booking={order}
        wrapperStyle={style}
        requestVehicles={this.requestVehicles}
        revertVehicle={this.onRevertVehicle}
        theme={this.props.theme}
        areVehiclesAvailable={!!this.getAvailableVehicles().length}
      />
    );
  }

  renderBookingBtn = props => (<Button stretched {...props} />);

  onChangeStopPointAddress = async (stops) => {
    const { asyncChangeFields, booking: { bookingForm } } = this.props;

    const proceedStops = stops.map(s => prepareStopPoint(s, bookingForm));

    await asyncChangeFields({ stops: proceedStops });

    this.requestVehicles();
  };

  renderStopPointsModal = () => {
    const { isStopPointsModalVisible } = this.state;

    return (
      <StopPointsModal
        data={this.prepareStopsData()}
        isVisible={isStopPointsModalVisible}
        onAddPoint={this.handleAddStop}
        onEditAddress={this.handleEditPoint}
        onRowMoved={this.requestVehicles}
        onChangeAddress={this.onChangeStopPointAddress}
        onClose={this.hideStopPointsModal}
        areAddressesUnique={this.areAddressesUnique}
        postEvent={this.props.postEvent}
        addStopBtnTestID="addStopBtnTestID"
      />
    );
  };

  onOpenModal = ({ modalContent, skipFlight }) => {
    this.setState({ modalContent, skipFlight });
    this.openModal('Custom');
  };

  onCloseModal = () => {
    const { skipFlight, modalContent } = this.state;

    if (skipFlight) {
      this.createBooking();
    } else {
      this.closeModal('Custom');
    }

    if (modalContent === 'messageToDriver') {
      this.props.changeMessageToDriver('');
    }
  };

  renderModal = () => {
    const { booking: { tempMessageToDriver } } = this.props;
    const { isCustomModalVisible = false, modalContent, referenceIndex } = this.state;
    const order = this.getOrder();
    const isMessageToDriverContent = modalContent === 'messageToDriver' && tempMessageToDriver;
    const isPaymentsOptionsContent = modalContent === 'paymentsOptions';

    return (
      <ModalWithContent
        key={modalContent}
        gesturesEnabled={isPaymentsOptionsContent}
        title={isMessageToDriverContent && `${tempMessageToDriver.length}/225`}
        isVisible={isCustomModalVisible}
        modalContent={modalContent}
        referenceIndex={referenceIndex}
        onClose={this.onCloseModal}
        booking={order}
      />
    );
  };

  render(content) {
    return (
      <Fragment>
        {content.call(this)}

        <AddressModal
          innerRef={this.setAddressModalRef}
          defaultValues={prepareDefaultValues(this.getPassenger())}
          onChange={this.onChangeAddress}
          navigation={this.props.navigation}
        />
        {this.renderStopPointsModal()}

        {this.renderModal()}
        <CardsPopup innerRef={this.setCardsPopupRef} />
      </Fragment>
    );
  }
}
