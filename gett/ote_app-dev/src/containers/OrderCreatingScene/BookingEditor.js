import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ActivityIndicator, ScrollView, Linking } from 'react-native';
import moment from 'moment-timezone';
import { isEmpty, isNull, isEqual } from 'lodash';
import { color, withTheme } from 'theme';

import { changeRegionToAnimate } from 'actions/ui/map';
import { getCurrentWeather } from 'actions/ui/weather';
import {
  getFormData,
  changeFields,
  asyncChangeFields,
  changeAddress,
  setActiveBooking,
  getVehicles,
  saveAvailableCarsScroll,
  setDefaultMessageToDriver,
  setAllowAutomationPickupChange,
  getFormDetails
} from 'actions/booking';
import { PERMISSION_STATUS } from 'actions/app/statuses';
import { getPassengerData } from 'actions/passenger';
import { postEvent } from 'actions/app/gett';

import { Button, Icon, Badge } from 'components';

import { strings } from 'locales';
import { prepareCoordinates, getPassengerPayload, isIOS, Location } from 'utils';
import PN from 'utils/notifications';

import BookingController from 'containers/BookingController';

import { containers } from 'testIDs';

import { Weather, ServiceSuspendedPopup, LocationPopup } from './components';
import styles from './style';

const IDs = containers.Orders;

class BookingEditor extends BookingController {
  static propTypes = {
    ...BookingController.propTypes,
    activeBookingId: PropTypes.number,
    changeRegionToAnimate: PropTypes.func,
    closestFutureBookingId: PropTypes.number,
    devSettings: PropTypes.object,
    futureBookingsCount: PropTypes.number,
    getCurrentPosition: PropTypes.func,
    getCurrentWeather: PropTypes.func,
    getFormData: PropTypes.func.isRequired,
    memberId: PropTypes.number,
    permissions: PropTypes.object,
    setActiveBooking: PropTypes.func,
    setAllowAutomationPickupChange: PropTypes.func,
    setDefaultMessageToDriver: PropTypes.func,
    themedStyles: PropTypes.object
  };

  setLocationPopupRef = (el) => { this.locationPopup = el; };

  setServiceSuspendedPopupRef = (el) => { this.serviceSuspendedPopup = el; };

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    const { booking: { bookingForm: bookingFormProps }, memberId } = prevProps;
    const {
      booking: { bookingForm },
      devSettings,
      getCurrentWeather,
      getFormData,
      postEvent,
      setAllowAutomationPickupChange
    } = this.props;
    const { loadBookingRequested } = this.state;

    this.requestFormDetailsOnOrderChange(bookingFormProps);

    // TODO pls refactor next check to avoid indirect evidence
    if (memberId && !loadBookingRequested && isEmpty(this.getPassenger())) {
      this.loadBooking();

      this.setState({ loadBookingRequested: true });
    }

    if (bookingForm.destinationAddress && !bookingFormProps.destinationAddress) {
      getFormData();
      postEvent('main_screen|screen_appears', {
        car_animations: devSettings.showCarAnimations,
        locating_a_car_animation: devSettings.showLocatingCarAnimation
      });
    }

    if (bookingForm.pickupAddress && !isEqual(bookingForm.pickupAddress, bookingFormProps.pickupAddress)) {
      if (bookingFormProps.pickupAddress) { setAllowAutomationPickupChange(false); }
      getCurrentWeather(bookingForm.pickupAddress);
    }
  }

  showServiceSuspendedPopup = () => this.serviceSuspendedPopup.open();

  loadBooking = async () => {
    const { getFormData, memberId, changeFields, activeBookingId, setActiveBooking,
      setDefaultMessageToDriver, changeRegionToAnimate } = this.props;

    const data = await getFormData();

    const { booking: { bookingForm } } = this.props;

    const isGPSEnabled = await Location.isGPSEnabled();

    const isLocationUnavailable = this.props.permissions.location === PERMISSION_STATUS.denied || !isGPSEnabled;

    let attrs = {
      message: data.defaultDriverMessage && `Pick up: ${data.defaultDriverMessage}`
    };

    if (isLocationUnavailable && !bookingForm.pickupAddress) {
      attrs = { ...attrs, pickupAddress: data.defaultPickupAddress };

      setDefaultMessageToDriver(data.defaultPickupAddress, { type: 'pickupAddress' });

      changeRegionToAnimate({ ...prepareCoordinates(data.defaultPickupAddress), line: data.defaultPickupAddress.line });
    }

    if (!isEmpty(data.booking)) {
      const { scheduledAt, pickupAddress, destinationAddress } = data.booking;
      attrs = {
        ...attrs,
        ...data.booking,
        scheduledAt: moment(scheduledAt).tz(pickupAddress && pickupAddress.timezone),
        schedule: this.getScheduleParams(data.booking),
        asDirected: !destinationAddress
      };
    }

    attrs = { ...attrs, ...getPassengerPayload(data, memberId) };

    changeFields(attrs);

    this.props.getPassengerData();

    if (activeBookingId && !PN.launchAppByPush) {
      setActiveBooking(activeBookingId);
    }

    if (data.serviceSuspended) {
      this.showServiceSuspendedPopup();
    }
  };

  goToEditOrderDetails = () => {
    const { theme, booking: { formData: { serviceSuspended } }, postEvent } = this.props;

    postEvent('ordering_screen|next|button_clicked');
    if (serviceSuspended) {
      this.showServiceSuspendedPopup();
    } else if (!this.isValidPreBookTime()) {
      this.openPickUpTimeModal();
    } else {
      this.props.navigation.navigate('EditOrderDetails', { theme });
    }
  };

  goToClosestFutureBooking = () => {
    const { setActiveBooking, closestFutureBookingId, postEvent } = this.props;
    postEvent('main_screen|future_orders|button_clicked');
    setActiveBooking(closestFutureBookingId);
  };

  showLocationPopup = () => {
    this.locationPopup.open();
  };

  isAuthorizedPermission = permission => (
    this.props.permissions && this.props.permissions[permission] === PERMISSION_STATUS.authorized
  );

  isActiveLocation = () => this.isAuthorizedPermission('location') && !isNull(this.props.ui.map.currentPosition);

  openSettings = () => {
    this.locationPopup.close();
    Linking.openURL('App-Prefs:root');
  };

  renderAddressItem = (address, label, type, testID) => {
    const { changeAddress, booking: { bookingForm }, postEvent, themedStyles } = this.props;
    const handlerPress = () => {
      changeAddress({ ...address, label }, { type: 'destinationAddress' });
      postEvent('main_screen|smart_destination|button_clicked', { type, source: 'destination' });
    };

    return (
      <Button
        key={address.id || label}
        type="secondary"
        onPress={handlerPress}
        size="mid"
        style={themedStyles.padding}
        disabled={!bookingForm.pickupAddress}
        title={label}
        testID={testID}
      />
    );
  };

  handleBack = () => {
    this.props.navigation.goBack(null);
  };

  handleAddFavourites = () => {
    this.props.navigation.navigate('Settings', {
      theme: this.props.theme,
      openAddressList: true,
      onBack: this.handleBack
    });
  };

  renderAddFavourites = () => (
    <Button
      title={strings('emptyPageResults.button.noFavourites')}
      type="secondary"
      onPress={this.handleAddFavourites}
      style={this.props.themedStyles.addButton}
      stretched
      size="mid"
    />
  );

  renderFavouriteAddresses() {
    const { themedStyles } = this.props;
    const passenger = this.getPassenger();

    const hasHomeAddress = passenger?.homeAddress?.line;
    const hasWorkAddress = passenger?.workAddress?.line;

    const shouldRenderButton = !hasHomeAddress && !hasWorkAddress && isEmpty(passenger?.favoriteAddresses);

    return (
      <ScrollView
        horizontal
        contentContainerStyle={[themedStyles.destinationBtns, shouldRenderButton && themedStyles.flex]}
        showsHorizontalScrollIndicator={false}
        testID="favouriteAddresses"
      >
        {hasHomeAddress &&
          this.renderAddressItem(passenger.homeAddress, strings('app.label.home'), 'home', IDs.homeAddress)
        }
        {hasWorkAddress &&
          this.renderAddressItem(passenger.workAddress, strings('app.label.work'), 'work', IDs.workAddress)
        }
        {passenger && (passenger.favoriteAddresses || [])
          .map(address => this.renderAddressItem(address.address, address.name, 'my_places'))
        }
        {shouldRenderButton && this.renderAddFavourites()}
      </ScrollView>
    );
  }

  renderAddressesSelector() {
    const { themedStyles } = this.props;
    return (
      <View style={themedStyles.selectAddress}>
        {this.renderPointList({ withDivider: true, prefix: IDs.preOrder })}
        <View style={themedStyles.destinationBtnsContainer}>
          {this.props.booking.formData.busy
            ? <ActivityIndicator style={themedStyles.destinationBtnsSpinner} size="small" color={color.secondaryText} />
            : this.renderFavouriteAddresses()
          }
        </View>
      </View>
    );
  }

  renderBtn = (btnProps) => {
    const { iconName, style, iconSize = 22, onPress, testID } = btnProps;
    const { theme, themedStyles } = this.props;
    return (
      <Button
        style={[themedStyles.btnWrapper, style]}
        styleContent={themedStyles.btnView}
        type="secondary"
        onPress={onPress}
        testID={testID}
      >
        <Icon name={iconName} size={iconSize} color={theme.color.primaryText} />
      </Button>
    );
  };

  getCurrentPosition = () => {
    const { getCurrentPosition, postEvent } = this.props;

    if (isIOS && !this.isActiveLocation()) return this.showLocationPopup();

    getCurrentPosition({ checkGPSEnabling: true });
    return postEvent('main_screen|locate_me|button_clicked');
  };

  renderActionsBar = () => {
    const {
      closestFutureBookingId,
      futureBookingsCount,
      themedStyles
    } = this.props;

    const isActiveLocation = this.isActiveLocation();
    const isActiveFutureOrder = !isNull(closestFutureBookingId) && futureBookingsCount > 0;

    return (
      <View pointerEvents="box-none" style={themedStyles.actionsBar}>
        <View style={themedStyles.leftActionsBar}>
          {isActiveLocation && <Weather />}
          {this.renderBtn({
            iconName: isActiveLocation ? 'myLocation' : 'inactiveLocation',
            onPress: this.getCurrentPosition,
            testID: IDs.myLocationBtn
          })}
        </View>
        {isActiveFutureOrder && (
          <View>
            {this.renderBtn({
              iconName: 'futureOrder',
              iconSize: 26,
              onPress: this.goToClosestFutureBooking,
              style: themedStyles.futureOrderBtn
            })}
            <Badge style={themedStyles.badge} value={futureBookingsCount} />
          </View>
        )}
      </View>
    );
  };

  renderFooter = () => {
    const { booking: { vehiclesData }, themedStyles } = this.props;

    const availableVehicles = this.getAvailableVehicles();
    const shouldRequestVehicles = this.shouldRequestVehicles();
    const { vehicleName, vehicleType, scheduledType } = this.getOrder();
    const isDisabledButton = scheduledType === 'now' && !(vehicleName || vehicleType);
    const displayCarsCondition = vehiclesData.loading || (!vehiclesData.loading && availableVehicles.length > 0);
    return (
      <View style={themedStyles.footer} pointerEvents="box-none">
        {!shouldRequestVehicles && (
          <View pointerEvents="box-none">
            {this.renderActionsBar()}
            {this.renderAddressesSelector()}

            <LocationPopup
              popupRef={this.setLocationPopupRef}
              onPress={this.openSettings}
            />
          </View>
        )}

        {shouldRequestVehicles && (
          <View style={themedStyles.footerOrder} pointerEvents="box-none">
            <View style={themedStyles.floatedPointList}>
              {this.renderPointList({ prefix: IDs.preOrder })}
            </View>

            {this.renderPickUpTime({ style: themedStyles.pickUpTimeWrapper })}

            {!vehiclesData.loading && availableVehicles.length === 0 &&
              this.renderNoVehiclesMessage({ style: themedStyles.noVehiclesMessage })
            }

            {displayCarsCondition && (
              <Fragment>
                {this.renderAvailableCars()}

                {this.renderBookingBtn({
                  title: 'Next',
                  style: themedStyles.nextStepBtn,
                  onPress: this.goToEditOrderDetails,
                  disabled: isDisabledButton || vehiclesData.loading,
                  testID: IDs.nextBtn
                })}
              </Fragment>
            )}
          </View>
        )}
      </View>
    );
  };

  renderContent() {
    const { themedStyles } = this.props;

    return (
      <View style={themedStyles.wrapper} pointerEvents="box-none">
        {this.renderFooter()}

        <ServiceSuspendedPopup popupRef={this.setServiceSuspendedPopupRef} />
      </View>
    );
  }

  render() {
    return super.render(this.renderContent);
  }
}

const mapStateToProps = ({ session, booking, app, ui, passenger }) => ({
  activeBookingId: session.user?.activeBookingId,
  app,
  booking,
  canSeeBookers: session.user?.can?.seeBookers,
  closestFutureBookingId: session.user?.closestFutureBookingId,
  devSettings: app.devSettings,
  futureBookingsCount: session.user?.futureBookingsCount,
  memberId: session.user?.memberId,
  passenger,
  permissions: app.statuses.permissions,
  ui
});

const mapDispatchToProps = {
  asyncChangeFields,
  changeAddress,
  changeFields,
  changeRegionToAnimate,
  getCurrentWeather,
  getFormData,
  getFormDetails,
  getPassengerData,
  getVehicles,
  postEvent,
  saveAvailableCarsScroll,
  setActiveBooking,
  setAllowAutomationPickupChange,
  setDefaultMessageToDriver
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(withTheme(BookingEditor, styles));
