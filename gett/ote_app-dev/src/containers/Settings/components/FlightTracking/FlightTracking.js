import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import { debounce, flatten, uniqBy } from 'lodash';
import moment from 'moment-timezone';

import { Icon } from 'components';
import InlineBar from 'components/SearchBar/InlineBar';

import { flightstats } from 'api';

import { strings } from 'locales';

import { color, withTheme } from 'theme';

import { calendarDate, getSeparatedDate, timeFormat } from 'utils';

import styles from './styles';

class FlightTracking extends PureComponent {
  static propTypes = {
    date: PropTypes.string,
    navigation: PropTypes.object,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  state = {
    directions: [],
    flight: '',
    loading: false
  };

  goToFlightDetails = ({ direction, airline }) => {
    const { navigation } = this.props;
    const { flight, schedule } = this.state;

    navigation.navigate('FlightTrackingSchedule', {
      flight: flight.toUpperCase(),
      airline,
      direction,
      schedule
    });
  };

  searchFlight = debounce(() => {
    const { flight } = this.state;

    if (!flight) return;

    this.setState({ loading: true });
    const { year, month, day } = getSeparatedDate(this.props.date);
    const schedule = {};

    flightstats.getFlightSchedule({ flight, year, month, day })
      .then(({ data }) => {
        const availableDates = data.map(i => i.date);

        const directions = uniqBy(flatten(data.map(i => i.flights.map((flight) => {
          if (!schedule[i.date]) {
            schedule[i.date] = {};
          }

          const direction = `${flight.departure.code}-${flight.arrival.code}`;

          schedule[i.date][direction] = flight;

          return {
            ...flight,
            direction
          };
        }))), 'direction');

        this.setState({
          availableDates,
          directions,
          schedule,
          error: null,
          loading: false,
          selectedDate: calendarDate()
        });
      })
      .catch(() => {
        this.setState({
          error: strings('flight.text.notFoundFlightNumber'),
          loading: false
        });
      });
  }, 700, { leading: true });

  handleChange = (flight) => {
    this.setState({ flight, directions: [], error: null }, this.searchFlight);
  };

  renderError = () => {
    const { error } = this.state;
    const { themedStyles } = this.props;

    return <Text style={themedStyles.errorMessage}>{error}</Text>;
  };

  renderFlightInput = () => {
    const { themedStyles } = this.props;
    const { flight } = this.state;

    return (
      <View style={themedStyles.row}>
        <View style={themedStyles.flex}>
          <InlineBar
            containerStyle={themedStyles.inputContainerStyle}
            onChangeText={this.handleChange}
            placeholder={'Start entering Flight No.'}
            value={flight}
          />
          {this.renderError()}
        </View>
      </View>
    );
  };

  formattedTime = (time, timezone) => `${moment(time).format(timeFormat())} ${moment().tz(timezone).zoneAbbr()}`;

  renderFlightData = (flightData) => {
    const { themedStyles } = this.props;
    const { departure, arrival, airline, direction } = flightData;

    return (
      <TouchableOpacity key={flightData.direction} onPress={() => this.goToFlightDetails({ airline, direction })}>
        <View style={[themedStyles.flex, themedStyles.container]}>
          <View>
            <Text style={themedStyles.label}>{`${flightData.airline} ${flightData.flight}`}</Text>
            <Text style={themedStyles.primaryText}>{departure.airport}</Text>
            <View style={themedStyles.row}>
              <Icon style={themedStyles.departureIcon} name="airplane" size={12} color={color.arrowRight} />
              <Text style={themedStyles.time}>
                {this.formattedTime(departure.scheduledTime, departure.timezone)}
              </Text>
            </View>
          </View>
          <View style={themedStyles.dotsContainer}>
            <Icon style={themedStyles.dotsIcon} name="flightInProgress" size={78} />
          </View>
          <View style={themedStyles.flex}>
            <Text style={themedStyles.label} />
            <Text style={themedStyles.primaryText}>{arrival.airport}</Text>
            <View style={themedStyles.row}>
              <Icon style={themedStyles.arrivalIcon} name="airplane" size={12} color={color.arrowRight} />
              <Text style={themedStyles.time}>
                {this.formattedTime(arrival.scheduledTime, arrival.timezone)}
              </Text>
            </View>
          </View>
          <View style={themedStyles.iconContainer}>
            <Icon style={themedStyles.chevronIcon} name="chevron" size={16} color={color.arrowRight} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderSpinner = () => {
    const { theme, themedStyles } = this.props;

    return (
      <View style={[themedStyles.flex, themedStyles.centered]}>
        <Spinner type="Circle" color={theme.color.secondaryText} />
      </View>
    );
  };

  render() {
    const { themedStyles, theme } = this.props;
    const { error, loading, directions } = this.state;

    const { isNightMode } = theme;

    return (
      <View style={[themedStyles.flex, themedStyles.flightTracking]}>
        <StatusBar barStyle={isNightMode ? 'light-content' : 'default'} />
        {this.renderFlightInput()}
        <ScrollView keyboardShouldPersistTaps="handled">
          {loading && this.renderSpinner()}
          {!loading && !error &&
            <View style={themedStyles.flex}>
              {directions.map(this.renderFlightData)}
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ booking }) => ({
  date: booking.bookingForm.scheduledAt
});

export default connect(mapStateToProps)(withTheme(FlightTracking, styles));
