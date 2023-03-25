import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, BackHandler } from 'react-native';

import { postEvent } from 'actions/app/gett';

import { Divider, Button, OrderCreatingHeader, Icon } from 'components';

import { strings } from 'locales';

import { color as colors, withTheme } from 'theme';

import { geocode, processLocation } from 'utils';
import { containers } from 'testIDs';

import MapView from '../Map/MapController/MapView';

import styles from './styles';

const IDs = containers.PickupAddressScene;

class PickupAddressScene extends Component {
  static propTypes = {
    booking: PropTypes.object,
    currentPosition: PropTypes.object,
    defaultPickupAddress: PropTypes.object,
    navigation: PropTypes.object,
    postEvent: PropTypes.func,
    themedStyles: PropTypes.object
  };

  state = {
    address: (this.params.predefinedAddress?.line && this.params.predefinedAddress) ||
      this.props.currentPosition || this.props.defaultPickupAddress || { line: undefined },
    dragEnable: false,
    isLoadingPickup: false
  };

  setMapViewRef = (el) => { this.mapView = el; };

  componentDidMount() {
    this.props.postEvent('search_address|map|button_clicked');
    if (!this.state.address.line) {
      const { lat, lng, latitude, longitude } = this.state.address;

      this.startLoadingPickup();

      geocode({ lat: lat || latitude, lng: lng || longitude })
        .then(processLocation)
        .then(this.onEndLoadingPickup)
        .catch(this.onEndLoadingPickup);
    }

    this.backListener = BackHandler.addEventListener('backPress', () => {
      this.onBack();
      return true;
    });
  }

  componentWillUnmount() {
    this.backListener.remove();
  }

  get order() {
    const { booking } = this.props;
    return booking.currentOrder.id ? booking.currentOrder : booking.bookingForm;
  }

  get params() {
    return this.props.navigation.state.params;
  }

  onExit = (action) => {
    action();
    this.props.navigation.goBack();
  };

  onBack = () => {
    this.onExit(this.params.handleBackPress);
  };

  onPickup = () => {
    const { meta, handlePickUp } = this.params;
    const { address } = this.state;
    this.onExit(() => {
      handlePickUp({ address, meta });
      this.props.postEvent('search_address|map|done|button_clicked');
    });
  };

  onEndLoadingPickup = (address) => {
    this.setState({
      address: typeof address?.line === 'string' ? address : { line: 'Not supported address', invalid: true },
      isLoadingPickup: false
    });
    this.mapView.animateToRegion(address);
  };

  getMarkerParams = () => {
    const { meta } = this.params;
    const type = meta.type ? meta.type : meta.predefinedType;
    let color = colors.success;
    const name = 'point';

    if (type === 'destinationAddress') {
      color = colors.danger;
    } else if (type === 'stops') {
      color = colors.secondaryText;
    }

    return { color, name };
  };

  disableDrag = () => {
    this.setState({ dragEnable: false });
  };

  enableDrag = () => {
    this.setState({ dragEnable: true });
  };

  startLoadingPickup = () => {
    this.setState({ isLoadingPickup: true });
  };

  renderAddress() {
    const { themedStyles } = this.props;
    const line = (this.state.address && this.state.address.line) || undefined;

    return (
      <View style={themedStyles.row}>
        <Icon
          style={themedStyles.pointerIcon}
          size={18}
          {...this.getMarkerParams()}
        />
        <View style={[themedStyles.flex, themedStyles.textContainer]}>
          <Text numberOfLines={1} style={themedStyles.inputStyle} testID={IDs.address}>
            {this.state.isLoadingPickup ? 'Loading...' : line}
          </Text>
        </View>
      </View>
    );
  }

  renderButton = (disabled = false) => {
    const { themedStyles } = this.props;
    const disabledBtn = this.state.isLoadingPickup || disabled;
    return (
      <Button
        disabled={disabledBtn}
        onPress={this.onPickup}
        stretched
        title={strings('order.button.done')}
        style={themedStyles.buttonContainer}
        testID={`${IDs.submit}${disabledBtn ? 'Disabled' : ''}`}
      />
    );
  };

  renderFooter = (disabled = false) => {
    const { themedStyles } = this.props;
    return (
      <View style={themedStyles.footerContainer}>
        {this.renderAddress()}
        <Divider style={themedStyles.dividerStyle} />
        {this.renderButton(disabled)}
      </View>
    );
  };

  render() {
    const { themedStyles } = this.props;
    const { isLoadingPickup, dragEnable, address } = this.state;

    return (
      <View style={themedStyles.container} testID={IDs.container}>
        <OrderCreatingHeader
          type="orderCreating"
          handlePressBack={this.onBack}
          backBtnTestID={IDs.back}
        />

        <View style={themedStyles.pinContainer} pointerEvents="box-none" testID={IDs.cover}>
          <Icon {...this.getMarkerParams()} name="pinLocationSet" width={32} height={52} />
        </View>

        {this.renderFooter((address && (!address.line || address.invalid)))}

        <MapView
          innerRef={this.setMapViewRef}
          initialRegion={{
            latitude: address.lat,
            longitude: address.lng,
            ...address
          }}
          dragEnable={!isLoadingPickup && dragEnable}
          enableDrag={this.enableDrag}
          disableDrag={this.disableDrag}
          forceScroll
          isOrderCreating={false}
          onStartLoadingPickup={this.startLoadingPickup}
          onEndLoadingPickup={this.onEndLoadingPickup}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ ui, booking }) => ({
  currentPosition: ui.map.currentPosition,
  defaultPickupAddress: booking.formData.defaultPickupAddress
});

export default connect(mapStateToProps, { postEvent })(withTheme(PickupAddressScene, styles));
