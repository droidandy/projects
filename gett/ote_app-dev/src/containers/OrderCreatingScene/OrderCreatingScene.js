import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, View } from 'react-native';
import { connect } from 'react-redux';
import { Answers } from 'react-native-fabric';

import { removeFields, resetBookingValues } from 'actions/booking';
import { postEvent } from 'actions/app/gett';

import { OrderCreatingHeader, Icon } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';

import {
  showConfirmationAlert,
  bookingFieldsToReset,
  setDefaultTimezone,
  getCurrentRoute,
  isEnoughOrderData,
  isGBAddress
} from 'utils';

import { containers } from 'testIDs';

import BookingEditor from './BookingEditor';
import { PromoBlackTaxi } from './components';

import styles from './style';

const IDs = containers.Orders;

const CURRENT_ROUTE = 'MapView';

class OrderCreatingScene extends PureComponent {
  static propTypes = {
    bookingForm: PropTypes.object,
    busyOrder: PropTypes.bool,
    getCurrentPosition: PropTypes.func,
    goToNotifications: PropTypes.func,
    goToOrders: PropTypes.func,
    handleBackBtnPress: PropTypes.func,
    navigation: PropTypes.object.isRequired,
    passengerData: PropTypes.object,
    postEvent: PropTypes.func,
    removeFields: PropTypes.func,
    resetBookingValues: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    unreadNotifications: PropTypes.number,
    vehiclesData: PropTypes.object
  };

  state = {
    isPromoAvailable: false,
    isPromoWasShown: false
  };

  setEditorViewRef = (el) => { this.editorView = el; };

  componentDidMount() {
    this.registerBackListener();
  }

  componentDidUpdate(prevProps) {
    const { bookingForm: { pickupAddress, vehicleName } } = this.props;
    const { bookingForm: { pickupAddress: pickupAddressProps } } = prevProps;

    if (pickupAddress && pickupAddress !== pickupAddressProps) {
      setDefaultTimezone(pickupAddress.timezone);
    }

    if (vehicleName === 'BlackTaxi') {
      this.closePromo();
    } else {
      this.showPromo();
    }
  }

  componentWillUnmount() {
    this.backListener.remove();

    BackHandler.removeEventListener('backPress');
  }

  registerBackListener = () => {
    this.backListener = BackHandler.addEventListener('backPress', () => {
      if (this.props.busyOrder) return true;

      const route = getCurrentRoute(this.props.navigation);

      if (route.routeName !== (CURRENT_ROUTE || 'TransitionLoading')) {
        this.goBack();

        if (route.routeName === 'OrdersView' && route.params.fromSettings) {
          this.goToSettings();
        }
        return true;
      } if (this.shouldRequestVehicles()) {
        this.cancelOrderCreation();
        return true;
      }

      return true;
    });
  };

  goBack = () => {
    this.props.navigation.dispatch({
      type: 'Navigation/BACK'
    });
  };

  goToSettings = () => {
    const { navigation, goToOrders, goToNotifications, postEvent } = this.props;

    navigation.navigate('Settings', {
      theme: navigation.state.params.theme,
      onGoToRides: goToOrders,
      onGoToNotifications: goToNotifications
    });

    Answers.logContentView('Settings was opened', 'screen view', 'settingsOpen');
    postEvent('main_screen|app_menu|button_clicked');
  };

  clearFields = () => {
    const { removeFields, resetBookingValues, getCurrentPosition } = this.props;
    removeFields(bookingFieldsToReset);
    resetBookingValues();

    getCurrentPosition();

    setTimeout(() => {
      this.closePromo();
      this.resetPromo();
    }, 500);
  };

  cancelOrderCreation = () => {
    showConfirmationAlert({
      theme: this.props.theme,
      title: strings('alert.title.cancelOrderCreation'),
      handler: this.clearFields
    });
  };

  shouldRequestVehicles = () => isEnoughOrderData(this.props.bookingForm);

  showPromo = () => {
    const { vehiclesData, bookingForm, passengerData } = this.props;
    const { isPromoAvailable, isPromoWasShown } = this.state;

    const defaultVehicle = passengerData.defaultVehicle;
    const blackCabAvailable = vehiclesData.vehicles.find(car => car.name === 'BlackTaxi')?.available;
    const isGBPath = isGBAddress(bookingForm.pickupAddress) && isGBAddress(bookingForm.destinationAddress);

    if ((vehiclesData.loaded && defaultVehicle !== 'BlackTaxi') &&
      bookingForm.scheduledType === 'now' && isGBPath && blackCabAvailable &&
      (!isPromoAvailable && !isPromoWasShown)) {
      this.setState({ isPromoAvailable: true });
    }
  };

  closePromo = () => {
    this.setState({ isPromoAvailable: false, isPromoWasShown: true });
  };

  resetPromo = () => {
    this.setState({ isPromoWasShown: false });
  };

  selectBlackCab = () => {
    this.editorView.updateScrollToCar('BlackTaxi');
    this.editorView.selectVehicle('BlackTaxi');
  };

  renderPickUpMarker = () => {
    const { themedStyles } = this.props;
    return (
      <View style={themedStyles.pickUpMarkerContainer} pointerEvents="box-none">
        <Icon name="pinLocationSet" width={32} height={52} />
      </View>
    );
  };

  goToOrders = () => {
    this.props.goToOrders();
    this.props.postEvent('main_screen|orders_menu|button_clicked');
  };

  render() {
    const { bookingForm, navigation, getCurrentPosition, unreadNotifications } = this.props;

    return (
      <Fragment>
        <OrderCreatingHeader
          type={!this.shouldRequestVehicles() ? 'dashboard' : 'orderCreating'}
          handlePressBurger={this.goToSettings}
          handlePressBack={this.cancelOrderCreation}
          handlePressOrder={this.goToOrders}
          unreadNotifications={unreadNotifications}
          backBtnTestID={IDs.creatingBack}
        />

        <BookingEditor
          innerRef={this.setEditorViewRef}
          navigation={navigation}
          getCurrentPosition={getCurrentPosition}
        />

        {this.state.isPromoAvailable &&
          <PromoBlackTaxi onClose={this.closePromo} onSelect={this.selectBlackCab} />
        }

        {!bookingForm.destinationAddress && this.renderPickUpMarker()}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ booking, passenger, notifications }) => ({
  bookingForm: booking.bookingForm,
  passengerData: passenger.data.passenger,
  unreadNotifications: notifications.unreadCounter,
  vehiclesData: booking.vehiclesData,
  busyOrder: booking.currentOrder.busy
});

const mapDispatchToProps = {
  postEvent,
  removeFields,
  resetBookingValues
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(OrderCreatingScene, styles));
