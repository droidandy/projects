import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import { isEqual } from 'lodash';

import { CarItem } from 'components';
import { isAndroid } from 'utils';
import { vehiclesInfo } from 'containers/shared/bookings/data';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 5
  }
});

const loadingVehicles = [{}, {}, {}, {}];

export default class AvailableCars extends PureComponent {
  static propTypes = {
    availableVehicles: PropTypes.array,
    booking: PropTypes.object,
    loading: PropTypes.bool,
    onCarSelect: PropTypes.func,
    onScroll: PropTypes.func,
    scrollRef: PropTypes.func
  };

  state = {
    display: true
  };

  componentDidUpdate(prevProps) {
    const { availableVehicles: availableVehiclesProps } = prevProps;
    const { availableVehicles } = this.props;
    if (isAndroid) {
      this.setState({ display: isEqual(availableVehicles, availableVehiclesProps) });
    }
  }

  renderAvailableVehicles = () => {
    const { availableVehicles, onCarSelect, booking, loading } = this.props;
    const renderVehicles = loading ? loadingVehicles : availableVehicles;

    return renderVehicles.map((vehicle, key) => (
      <CarItem
        key={loading ? key : vehicle.name}
        onChange={onCarSelect}
        vehicle={vehicle}
        label={vehiclesInfo[vehicle.name]?.label || 'Unknown'}
        active={vehicle.name && vehicle.name === (booking.vehicleName || booking.vehicleType)}
        isETADisabled={booking.id ? !booking.asap : booking.scheduledType !== 'now'}
        loading={loading}
      />
    ));
  };

  render() {
    const { onScroll, scrollRef } = this.props;
    return (this.state.display &&
      <ScrollView
        horizontal
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={200}
        ref={scrollRef}
      >
        {this.renderAvailableVehicles()}
      </ScrollView>
    );
  }
}
