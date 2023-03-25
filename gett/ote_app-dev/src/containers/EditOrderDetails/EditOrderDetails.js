import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';

import {
  changeFields,
  changeAddress,
  asyncChangeFields,
  getVehicles,
  createBooking,
  saveFlight,
  validateReferences,
  saveAvailableCarsScroll,
  updateBooking,
  changeMessageToDriver,
  getFormDetails
} from 'actions/booking';
import { getPassengerData } from 'actions/passenger';
import { postEvent } from 'actions/app/gett';

import BookingController from 'containers/BookingController';
import { Divider } from 'components';
import { strings } from 'locales';

import { withTheme } from 'theme';

import { setDefaultTimezone } from 'utils';

import { containers } from 'testIDs';

import styles from './styles';

const IDs = containers.Orders;

class EditOrderDetails extends BookingController {
  static propTypes = {
    ...BookingController.propTypes,
    onCloseEditor: PropTypes.func,
    themedStyles: PropTypes.any,
    updateBooking: PropTypes.func
  };

  static defaultProps = {
    passenger: {}
  };

  componentDidMount() {
    super.componentDidMount();

    const { navigation, onCloseEditor, postEvent, booking: { bookingForm } } = this.props;
    const { params = {} } = navigation.state;

    postEvent('ordering_screen|screen_appears');

    if (onCloseEditor) {
      navigation.setParams({ restoreFutureOrder: onCloseEditor });
    }

    if (params.futureOrderEditing) {
      this.requestVehicles();
    }

    if (params.futureFlightOrder || params.futureOrderEditing || params.additionalOrder) {
      setDefaultTimezone(bookingForm.pickupAddress.timezone);
    }
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    const { bookingForm } = prevProps.booking;
    const { booking: { bookingForm: { destinationAddress } }, navigation } = this.props;
    const { params = {} } = navigation.state;

    if ((params.futureFlightOrder || params.futureOrderEditing || params.additionalOrder) && destinationAddress) {
      this.requestFormDetailsOnOrderChange(bookingForm, { preservePaymentType: true });
    }
  }

  handleUpdateOrder = () => {
    this.props.updateBooking()
      .then(() => {
        this.props.navigation.goBack(null);
      })
      .catch(this.showAlert);
  };

  renderOrderOptions = () => {
    const { themedStyles, booking: { bookingForm, formData }, navigation: { state: { params = {} } } } = this.props;

    const futureOrder = params.futureFlightOrder || params.futureOrderEditing;
    const customRecurring = bookingForm.schedule && bookingForm.schedule.custom;

    return (
      <ScrollView style={[themedStyles.flex, themedStyles.scrollView]} testID={IDs.scrollViewEditOrderDetails}>
        {this.renderPickUpTime({
          style: themedStyles.pickUpTimeWrapper,
          futureOrderEditing: futureOrder,
          editingDisable: customRecurring
        })}

        <View style={[themedStyles.contentBlock, themedStyles.mainInfoContainer]}>
          {this.renderPointList({ prefix: IDs.editOrderDetails })}
          {this.renderCars()}
        </View>
        {this.renderAdditionalDetails({
          style: [themedStyles.contentBlock, themedStyles.detailsContainer],
          items: this.getAdditionalDetailsItems({ isOrderEditing: futureOrder })
        })}
        {formData.bookingReferences.length > 0 && (
          this.renderAdditionalDetails({
            style: [themedStyles.contentBlock, themedStyles.detailsContainer],
            items: this.getReferencesItems(),
            label: strings('order.text.bookingReferences'),
            labelStyle: themedStyles.labelStyle
          })
        )}
        <View style={themedStyles.spacer} />
      </ScrollView>
    );
  };

  renderContent() {
    const { navigation, booking: { formData, vehiclesData, currentOrder: { busy } }, themedStyles } = this.props;
    const { params: { futureOrderEditing } = {} } = navigation.state;

    const isOrderBtnDisabled = formData.serviceSuspended || busy || vehiclesData.loading || !this.shouldOrderRide();

    return (
      <Fragment>
        {this.renderOrderOptions()}
        <View style={themedStyles.orderRideBtnWrapper}>
          {this.renderBookingBtn({
            title: futureOrderEditing ? strings('order.button.update') : strings('order.button.orderRide'),
            style: themedStyles.orderRideBtn,
            disabled: isOrderBtnDisabled,
            loading: busy,
            onPress: futureOrderEditing ? this.handleUpdateOrder : this.handleBookingCreation,
            testID: futureOrderEditing ? IDs.updateBtn : IDs.orderRideBtn
          })}
        </View>

      </Fragment>
    );
  }

  render() {
    return super.render(this.renderContent);
  }
}

const mapStateToProps = ({ booking, passenger, session }) => ({
  booking,
  canSeeBookers: session.user.can?.seeBookers,
  memberId: session.user?.memberId,
  passenger
});

const mapDispatchToProps = {
  asyncChangeFields,
  changeAddress,
  changeFields,
  changeMessageToDriver,
  createBooking,
  getFormDetails,
  getPassengerData,
  getVehicles,
  postEvent,
  saveAvailableCarsScroll,
  saveFlight,
  updateBooking,
  validateReferences
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(EditOrderDetails, styles));
