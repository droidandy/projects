import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Linking,
  Platform,
  StatusBar,
  Clipboard,
  AppState
} from 'react-native';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { Answers } from 'react-native-fabric';

import { Icon, JourneyDetails, Divider, RatingLabel, Button, CarImage, Avatar, OptionsModal } from 'components';

import {
  ORDER_RECEIVED_STATUS,
  COMPLETED_STATUSES,
  FINAL_STATUSES,
  IN_PROGRESS_STATUS,
  DRIVER_ON_WAY,
  CUSTOMER_CARE_STATUS
} from 'utils/orderStatuses';
import {
  getFormatPrice, isIphoneX, didRestoreFromBackground, isGBAddress, deviceHeight, isAndroid, formatETA
} from 'utils';

import { postEvent } from 'actions/app/gett';
import {
  changeFields,
  changeAddress,
  asyncChangeFields,
  getVehicles,
  createBooking,
  saveFlight,
  validateReferences,
  saveAvailableCarsScroll,
  setAllowAutomationPickupChange
} from 'actions/booking';
import { getPassengerData } from 'actions/passenger';
import { color, withTheme } from 'theme';
import { strings } from 'locales';

import { vehiclesInfo, paymentTypeLabels, OTcars, receiptPaymentTypes } from 'containers/shared/bookings/data';
import { getReceiptUrl } from 'containers/Receipt/utils';

import BookingController from 'containers/BookingController';

import SlidingUpPanel from './SlidingUpPanel';

import { orderPanelStyles } from './styles';

import { shouldCallDispatcher, journeyLabel, journeyTypes } from '../utils';

const topIPhone = isIphoneX() ? 34 : 20;
const bottomIPhone = isIphoneX() ? 16 : 0;
const topSpacer = isAndroid ? 70 : topIPhone;

class OrderDetails extends BookingController {
  static propTypes = {
    ...BookingController.propTypes,
    handleCreateAdditionalBooking: PropTypes.func,
    onActivate: PropTypes.func,
    onClose: PropTypes.func,
    onOpenEditor: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    setAllowAutomationPickupChange: PropTypes.func,
    themedStyles: PropTypes.object,
    visible: PropTypes.bool
  };

  static defaultProps = {
    onActivate: () => {},
    onClose: () => {},
    visible: false
  };

  constructor(props) {
    super(props);
    this.state = { ...this.state, showCopyAlert: false, isActionsModalVisible: false };
  }

  appState = 'active';

  setPanelRef = (panel) => { this.panel = panel; };

  componentDidMount() {
    super.componentDidMount();

    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    const isBackFromBackground = didRestoreFromBackground(this.appState, nextAppState, true);

    if (isBackFromBackground) this.panel.requestClose();

    this.appState = nextAppState;
  };

  callDriver = () => {
    const { booking: { currentOrder } } = this.props;
    const { driverDetails: driver } = currentOrder;
    Answers.logCustom('user clicks on call driver button', { phoneNumber: driver.info.phoneNumber });
    Linking.openURL(`tel:${driver.info.phoneNumber}`);
  };

  callDispatcher = () => {
    const { booking: { currentOrder } } = this.props;
    Answers.logCustom('user clicks on call fleet button', { phoneNumber: currentOrder.vendorPhone });
    Linking.openURL(`tel:${currentOrder.vendorPhone}`);
  };

  goToRateDriver = () => this.props.navigation.navigate('RateDriver');

  getOrder() {
    return this.props.booking.currentOrder;
  }

  handleOpenEditor = () => {
    this.props.onClose();
    this.props.onOpenEditor();
  };

  handleToggleActionsModal = () => {
    this.setState({ isActionsModalVisible: !this.state.isActionsModalVisible });
  };

  shouldShowEditBtn = () => {
    const { booking: { currentOrder } } = this.props;
    return currentOrder.indicatedStatus === ORDER_RECEIVED_STATUS && !currentOrder.asap &&
      isGBAddress(currentOrder.pickupAddress);
  };

  shouldShowRepeatBtn = () => {
    const { booking: { currentOrder } } = this.props;
    return currentOrder.final;
  };

  shouldShowReturnBtn = () => {
    const { booking: { currentOrder } } = this.props;
    return currentOrder.destinationAddress && currentOrder.indicatedStatus !== CUSTOMER_CARE_STATUS;
  };

  shouldShowReceiptBtn = () => {
    const { booking: { currentOrder } } = this.props;
    return receiptPaymentTypes.includes(currentOrder.paymentMethod) && currentOrder.indicatedStatus === 'billed';
  };

  handleCreateRepeatBooking = () => this.props.handleCreateAdditionalBooking(journeyTypes.repeat);

  handleCreateReturnBooking = () => this.props.handleCreateAdditionalBooking(journeyTypes.reverse);

  getActions = () => {
    const actions = [];

    if (this.shouldShowEditBtn()) {
      actions.push({
        icon: 'edit',
        label: 'Edit Order',
        onPress: this.handleOpenEditor
      });
    }

    if (this.shouldShowRepeatBtn()) {
      actions.push({
        icon: journeyTypes.repeat,
        label: journeyLabel(journeyTypes.repeat),
        onPress: this.handleCreateRepeatBooking
      });
    }

    if (this.shouldShowReturnBtn()) {
      actions.push({
        icon: journeyTypes.reverse,
        label: journeyLabel(journeyTypes.reverse),
        onPress: this.handleCreateReturnBooking
      });
    }

    if (this.shouldShowReceiptBtn()) {
      actions.push({
        icon: 'receipt',
        label: strings('order.button.receipt'),
        onPress: this.openReceipt
      });
    }

    return actions;
  };

  renderReferences = () => {
    const { booking: { currentOrder }, themedStyles } = this.props;
    const { references } = currentOrder;

    return (
      <View style={themedStyles.activeContainer}>
        <View
          style={[
            themedStyles.listOption,
            themedStyles.listOptionReferenceHeader
          ]}
        >
          <Text style={themedStyles.referenceTitle}>{strings('order.text.bookingReferences')}</Text>
        </View>
        <View
          style={[
            themedStyles.listItem,
            themedStyles.listItemReference
          ]}
        >
          {references.map(({ bookingReferenceName, value }, i, arr) => (
            this.renderOption({ title: bookingReferenceName, value, chevron: false }, i, arr)
          ))}
        </View>
      </View>
    );
  };

  renderOption = (option, i, arr) => {
    const { title, value, icon, onPress, chevron = true, modalComponent } = option;
    const { themedStyles, theme } = this.props;
    return (
      <View key={title} style={themedStyles.listOption}>
        {modalComponent}
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={themedStyles.row}>
            {icon && <Icon name={icon} color={theme.color.primaryText} />}

            <View style={themedStyles.titleContainer}>
              <Text style={themedStyles.title}>{title}</Text>
              <Text style={themedStyles.name}>{value}</Text>
            </View>

            {chevron && <Icon name="chevron" color={theme.color.arrowRight} width={10} />}
          </View>
        </TouchableWithoutFeedback>
        {i + 1 < arr.length && <Divider style={themedStyles.divider} />}
      </View>
    );
  };

  getOptions = () => {
    const { booking: { currentOrder } } = this.props;
    const options = [{
      title: 'Order for',
      value: currentOrder.passenger,
      icon: 'avatar',
      chevron: false
    }];

    if (currentOrder.messageToDriver) {
      options.push({
        title: 'Message for driver',
        value: currentOrder.messageToDriver,
        icon: 'message',
        chevron: false
      });
    }

    if (currentOrder.travelReason) {
      options.push({
        title: 'Trip reason',
        value: currentOrder.travelReason,
        icon: 'rides',
        chevron: false
      });
    }

    if (currentOrder.paymentMethod) {
      options.push({
        title: 'Payment method',
        value: paymentTypeLabels[currentOrder.paymentMethod],
        icon: 'paymentMethod',
        chevron: false
      });
    }

    if (currentOrder.flight) {
      options.push({
        title: 'Flight number',
        value: currentOrder.flight,
        icon: 'flight',
        chevron: false
      });
    }

    return options;
  };

  renderOptions = () => {
    const { themedStyles } = this.props;
    return (
      <View key="details" style={themedStyles.activeContainer}>
        <View style={themedStyles.listItem}>
          {this.getOptions().map(this.renderOption)}
        </View>
      </View>
    );
  };

  renderCarItem = () => {
    const { booking: { currentOrder, vehiclesData }, themedStyles } = this.props;
    const vehicleType = currentOrder.vehicleType;
    const vehicleData = vehiclesInfo[vehicleType] || { label: 'Unknown' };

    const vehicle = vehiclesData.vehicles.find(item => item.name === vehicleType) || {};

    return (
      <View key="car" style={themedStyles.row}>
        <Text style={[themedStyles.title]}>{vehicleData.label}</Text>

        <CarImage
          size="small"
          type={vehicleData.name}
          style={themedStyles.carImage}
        />

        <Text style={[themedStyles.name, themedStyles.priceLabel]}>
          {getFormatPrice(currentOrder.fareQuote) || getFormatPrice(vehicle.price) || strings('app.label.byMeter')}
        </Text>
      </View>
    );
  };

  renderJourneyDetails = () => {
    const { booking: { currentOrder }, themedStyles } = this.props;
    const { driverDetails: driver } = currentOrder;

    return (
      <Fragment>
        <View key="journey" style={themedStyles.activeContainer}>
          <View style={themedStyles.listItem}>
            {this.renderPointList({
              allowEmptyDestination: false,
              editable: false,
              noItemMargin: false,
              orderDetails: true,
              stopAsList: true,
              style: themedStyles.pointList
            })}
            <Divider style={themedStyles.divider} />
            {[DRIVER_ON_WAY, IN_PROGRESS_STATUS].includes(currentOrder.indicatedStatus) &&
              <Fragment>
                <JourneyDetails
                  key="journeyDetails"
                  style={themedStyles.journeyDetails}
                  time={formatETA(driver?.eta)}
                  timeLabel="eta"
                  distance={`${driver.distance.value || '0.00'} ${driver.distance.unit || 'mi'}`}
                />
                <Divider key="divider" style={themedStyles.divider} />
              </Fragment>
            }
            {this.renderCarItem()}
          </View>
        </View>
      </Fragment>
    );
  };

  renderCallFleetBtn = () => {
    const { themedStyles, theme } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.callDispatcher}>
        <View style={themedStyles.activeContainer}>
          <View style={themedStyles.listItem}>
            <View style={[themedStyles.driverContainer, themedStyles.fleetContainer]}>
              <Icon
                name="dispatcher"
                color={theme.isNightMode ? theme.color.white : theme.color.success}
                size={30}
                strokeWidth="2.5"
              />
              <Text style={themedStyles.callDispatcherText}>{strings('order.button.callDispatcherFull')}</Text>
              <Icon name="chevron" color={theme.color.arrowRight} width={20} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderDriverRating = () => {
    const { booking: { currentOrder }, themedStyles } = this.props;
    const { driverDetails: driver } = currentOrder;

    return (
      <View style={themedStyles.activeContainer}>
        <View style={[themedStyles.listItem, themedStyles.row]}>
          <View style={themedStyles.flex}>
            <Text style={themedStyles.title}>Driver</Text>
            <Text style={themedStyles.name}>{driver.info.name}</Text>
          </View>

          {driver.info.rating && <RatingLabel label={driver.info.rating} />}
        </View>
      </View>
    );
  };

  renderBackdropComponent = () => {
    const { booking: { currentOrder }, themedStyles } = this.props;
    const { driverDetails: driver, references } = currentOrder;
    const isDriverExist = driver && driver.info && !!driver.info.name;

    return (
      <View style={{ paddingBottom: isDriverExist ? 150 : 155 }}>
        {isDriverExist && this.renderDriverRating()}
        {ORDER_RECEIVED_STATUS === currentOrder.indicatedStatus &&
          <View key="pickup" style={themedStyles.activeContainer}>
            {this.renderPickUpTime({ editingDisable: true, style: themedStyles.activeContainerBorder })}
          </View>
        }
        {shouldCallDispatcher(currentOrder) && this.renderCallFleetBtn()}
        {this.renderJourneyDetails()}
        {this.renderOptions()}
        {references && references.length > 0 && this.renderReferences()}
      </View>
    );
  };

  openReceipt = () => {
    const { navigation, booking: { currentOrder }, session: { token }, postEvent, theme } = this.props;

    postEvent('order_history|reciept|button_clicked');
    if (Platform.OS === 'android') {
      navigation.navigate('Receipt', { orderId: currentOrder.id, theme });
    } else {
      RNFetchBlob.config({
        indicator: true,
        path: `${RNFetchBlob.fs.dirs.CacheDir}/Receipt#${currentOrder.id}.pdf`
      })
        .fetch('POST', getReceiptUrl(currentOrder.id), {
          Authorization: `Bearer ${token}`
        })
        .then(res => RNFetchBlob.ios.openDocument(res.path()));
    }
  };

  copyServiceId = () => {
    Clipboard.setString(this.props.booking.currentOrder.serviceId);
    this.setState({ showCopyAlert: true }, () => setTimeout(() => this.setState({ showCopyAlert: false }), 1000));
  };

  renderSuccessCopyAlert() {
    const { showCopyAlert } = this.state;
    const { themedStyles, theme } = this.props;
    if (!showCopyAlert) return null;
    return (
      <View style={themedStyles.copyAlertWrapper}>
        <View style={themedStyles.copyAlert}>
          <Icon style={themedStyles.copyAlertIcon} name="done" size={45} color={theme.color.white} />
          <Text style={themedStyles.copyAlertText}>Copied</Text>
        </View>
      </View>
    );
  }

  renderActionsBtn() {
    const { theme, themedStyles } = this.props;

    if (!this.getActions().length) return null;

    return <Button raised={false} styleContent={themedStyles.actionsBtn} onPress={this.handleToggleActionsModal}>
      <Icon name="dots" color={theme.color.white} size={26} />
    </Button>;
  }

  renderHeader = () => {
    const { booking: { currentOrder }, themedStyles } = this.props;
    return (
      <View style={themedStyles.headerWrapper}>
        {shouldCallDispatcher(currentOrder)
          ? (
            <View style={themedStyles.headerNoInfoWrapper}>
              <Text style={themedStyles.headerNoInfoText}>{strings('order.text.noDriverInfo')}</Text>
            </View>
          )
          : (
            <View style={themedStyles.headerStatus}>
              <View style={themedStyles.flex}>
                <Text style={themedStyles.header}>{
                  strings(`order.status.${currentOrder.indicatedStatus || 'connected'}`)}
                </Text>
                <View style={themedStyles.subHeader}>
                  <Text style={themedStyles.subHeaderTitle}>{strings('order.label.serviceId')}</Text>
                  {currentOrder.serviceId &&
                    <Text style={themedStyles.serviceId} numberOfLines={3} onLongPress={this.copyServiceId}>
                      {currentOrder.serviceId}
                    </Text>
                  }
                </View>
              </View>

              {this.renderActionsBtn()}
            </View>
          )}
      </View>
    );
  };

  renderActionsModal() {
    const { isActionsModalVisible } = this.state;
    return (
      <OptionsModal
        isVisible={isActionsModalVisible}
        options={this.getActions()}
        onClose={this.handleToggleActionsModal}
      />
    );
  }

  renderRateBtn = () => {
    const { themedStyles } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.goToRateDriver}>
        <View style={[themedStyles.roundContainer, themedStyles.rateButton]}>
          <Icon name="starEmpty" color={color.white} size={20} strokeWidth="2.5" />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderCallBtn = () => {
    const { booking: { currentOrder }, themedStyles } = this.props;
    const { driverDetails: driver } = currentOrder;
    const isDriverPhoneExist = driver && driver.info && driver.info.phoneNumber;
    return (isDriverPhoneExist &&
      <TouchableWithoutFeedback onPress={this.callDriver}>
        <View style={[themedStyles.roundContainer, themedStyles.callButton]}>
          <Icon name="call" color={color.white} size={18} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderDriver = () => {
    const { booking: { currentOrder }, themedStyles } = this.props;
    const { driverDetails: driver, indicatedStatus } = currentOrder;

    return (
      <View style={themedStyles.driverContainer}>
        {driver.info.imageUrl
          ? <Avatar source={driver.info.imageUrl} size={44} />
          : <Icon name={OTcars.includes(currentOrder.vehicleType) ? 'OT' : 'Gett'} size={46} />
        }

        <View style={themedStyles.titleContainer}>
          <Text style={themedStyles.driverCarInfo} numberOfLines={2}>
            {driver.info.vehicle && driver.info.vehicle.color} {driver.info.vehicle && driver.info.vehicle.model}
          </Text>
          <Text style={themedStyles.driverLicense} numberOfLines={1}>
            {strings('order.label.carReg')}: {driver.info.vehicle && driver.info.vehicle.licensePlate}
          </Text>
        </View>

        {(COMPLETED_STATUSES.includes(indicatedStatus) || indicatedStatus === IN_PROGRESS_STATUS)
          ? this.renderRateBtn()
          : !FINAL_STATUSES.includes(indicatedStatus) && this.renderCallBtn()
        }
      </View>
    );
  };

  renderActiveItem = () => {
    const { visible, theme, booking: { currentOrder }, themedStyles } = this.props;
    const { driverDetails: driver } = currentOrder;
    const isDriverExist = driver && driver.info && !!driver.info.name;

    return (
      <View style={themedStyles.activeContainer}>
        <View style={[
          themedStyles.listItem,
          !visible && themedStyles.activeItem,
          { height: isDriverExist ? 108 : 'auto' }
        ]}>
          <Icon
            style={!visible ? { transform: [{ rotate: '180deg' }] } : {}}
            name="arrowDown"
            color={theme.color.arrowRight}
            width={34}
          />

          {isDriverExist && this.renderDriver()}
        </View>
      </View>
    );
  };

  renderContent() {
    const { booking: { currentOrder }, visible, onActivate, onClose, theme, isConnected } = this.props;
    const { driverDetails: driver } = currentOrder;
    const isDriverExist = driver && driver.info && !!driver.info.name;

    return (
      <Fragment>
        <StatusBar animated barStyle={visible || theme.isNightMode ? 'light-content' : 'default'} />
        <SlidingUpPanel
          innerRef={this.setPanelRef}
          visible
          showBackdrop={false}
          draggableRange={{
            top: deviceHeight - (isDriverExist ? 118 : 59) - topSpacer - (!isConnected && 60),
            bottom: 118 + bottomIPhone
          }}
          height={isDriverExist ? 118 : 48}
          backdropComponent={this.renderBackdropComponent()}
          header={this.renderHeader()}
          closeButton={<Icon name="arrow" />}
          onActivate={onActivate}
          onClose={onClose}
          opened={visible}
        >
          {this.renderActiveItem()}
        </SlidingUpPanel>
        {this.renderSuccessCopyAlert()}
        {this.renderActionsModal()}
      </Fragment>
    );
  }

  render() {
    return super.render(this.renderContent);
  }
}

const mapStateToProps = ({ network, session, booking, passenger }) => ({
  booking,
  canSeeBookers: session.user?.can?.seeBookers,
  passenger,
  session,
  isConnected: network.isConnected
});

const mapDispatchToProps = {
  asyncChangeFields,
  changeAddress,
  changeFields,
  createBooking,
  getPassengerData,
  getVehicles,
  postEvent,
  saveAvailableCarsScroll,
  saveFlight,
  setAllowAutomationPickupChange,
  validateReferences
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(OrderDetails, orderPanelStyles));
