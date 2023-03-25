import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Config from 'react-native-config';
import { keys } from 'lodash';
import moment from 'moment-timezone';
import LinearGradient from 'react-native-linear-gradient';

import { Icon } from 'components';

import { flightstats } from 'api';

import { strings } from 'locales';

import { color, withTheme, formattedColor } from 'theme';

import { calendarDate, timeFormat, deviceWidth } from 'utils';

import darkMapStyles from './mapStyles';
import styles from './styles';

const today = calendarDate();

const width = Math.round(deviceWidth);

class FlightTrackingSchedule extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  state = {
    availableDates: [],
    loaded: false
  };

  componentDidMount() {
    const { schedule } = this.props.navigation.state.params;

    const availableDates = keys(schedule);
    const selectedDay = availableDates.includes(today) ? today : this.findNextAvailableDay();

    this.setState({
      availableDates,
      loaded: true,
      selectedDay
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedDay } = this.state;
    if (prevState.selectedDay !== selectedDay) {
      const { schedule, direction } = this.props.navigation.state.params;
      const { flightId } = schedule[selectedDay] && schedule[selectedDay][direction];

      if (flightId) {
        flightstats.getFlightTrack({ flightId })
          .then(({ data }) => {
            this.setState({ airplanePosition: data });
          })
          .catch(() => {
            this.setState({ airplanePosition: null });
          });
      }
    }
  }

  findNextAvailableDay = () => {
    const { schedule } = this.props.navigation.state.params;
    const availableDates = keys(schedule);

    return availableDates.find(date => moment(date).isAfter());
  };

  onPress = (date) => {
    this.setState(({ selectedDay }) => ({ selectedDay: selectedDay !== date ? date : selectedDay }));
  };

  renderScheduleTabs = (date) => {
    const { themedStyles } = this.props;
    const { selectedDay } = this.state;
    const isActiveTab = date === selectedDay;
    return (
      <TouchableWithoutFeedback key={date} onPress={() => { this.onPress(date); }}>
        <View style={themedStyles.flex}>
          <View style={themedStyles.tabContainer}>
            <Text style={[themedStyles.tabLabel, isActiveTab && themedStyles.activeTabLabel]}>
              {moment(date).format('DD MMM').toUpperCase()}
            </Text>
          </View>
          <View style={[themedStyles.tab, isActiveTab && themedStyles.activeTab]}/>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderMap = () => {
    const { themedStyles } = this.props;
    const { airplanePosition, selectedDay, loaded } = this.state;

    if (!loaded) {
      return null;
    }

    const { schedule, direction } = this.props.navigation.state.params;
    const { arrival, departure } = schedule[selectedDay] && schedule[selectedDay][direction];

    // eslint-disable-next-line max-len
    let staticMap = `https://maps.googleapis.com/maps/api/staticmap?maptype=roadmap&markers=anchor:center%7Cicon:https://dev.gettaxi.me/images/mobile_flight_destination_marker.png%7C${departure.lat},${departure.lng}&markers=anchor:center%7Cicon:https://dev.gettaxi.me/images/mobile_flight_destination_marker.png%7C${arrival.lat},${arrival.lng}&path=weight:2%7Ccolor:white%7Cgeodesic:false%7C${departure.lat},${departure.lng}%7C${arrival.lat},${arrival.lng}&scale=2&sensor=false&size=${width}x300`;

    if (airplanePosition) {
      // eslint-disable-next-line max-len
      staticMap += `&markers=anchor:center%7Cicon:https://dev.gettaxi.me/images/mobile_aircraft_marker.png%7C${airplanePosition.lat},${airplanePosition.lon}`;
    }

    return (
      <Image
        source={{ uri: `${staticMap}&${darkMapStyles}&key=${Config.GOOGLE_API_KEY}` }}
        style={[{ width, height: 255 }, themedStyles.orderMap]}
      />
    );
  };

  renderGradient = () => {
    const { themedStyles } = this.props;

    return (
      <View style={[themedStyles.gradientContainer, themedStyles.gradientSize]}>
        <LinearGradient
          colors={[formattedColor.primaryText.opacity(0), color.primaryText]}
          style={themedStyles.gradientSize}
        />
      </View>
    );
  };

  renderSchedule = () => {
    const { selectedDay } = this.state;

    if (!selectedDay) {
      return null;
    }
    const { navigation, themedStyles } = this.props;
    const { direction, schedule } = navigation.state.params;

    const flightData = schedule[selectedDay][direction];
    const { departure, arrival } = flightData;

    return (
      <View style={themedStyles.flex}>
        <View style={themedStyles.gap} />
        {this.renderBlock(departure)}
        {this.renderBlock(arrival, true)}
      </View>
    );
  };

  formattedTime = (time, timezone) => {
    if (!time) {
      return '--';
    }
    return `${moment(time).format(timeFormat())} ${moment().tz(timezone).zoneAbbr()}`;
  };

  checkExist = value => value || 'N/A';

  renderBlock = (flight, isArrival) => {
    const { themedStyles } = this.props;

    const flightIcon = isArrival ? themedStyles.arrivalIcon : themedStyles.departureIcon;
    const scheduledTime = this.formattedTime(flight.scheduledTime, flight.timezone);
    const actualTime = this.formattedTime(flight.actualTime || flight.estimatedTime, flight.timezone);
    const label = strings(`flight.label.${isArrival ? 'arrival' : 'departure'}`);

    return (
      <View style={themedStyles.roundedContainer}>
        <View style={themedStyles.header}>
          <Text style={themedStyles.headerText}>{label}</Text>
          <Text style={themedStyles.headerText}>
            {moment(flight.scheduledTime).format('DD-MMM-YYYY').toUpperCase()}
          </Text>
        </View>
        <View style={[themedStyles.flex, themedStyles.row, themedStyles.main]}>
          <View style={themedStyles.flex}>
            <Text style={themedStyles.text}>{flight.city}</Text>
            <Text style={themedStyles.primaryTextSchedule}>{flight.airport}</Text>
            <Text style={themedStyles.text}>{flight.name}</Text>
          </View>
          <View style={themedStyles.flex}>
            <Text style={themedStyles.text}>{strings('flight.label.gate')}</Text>
            <Text style={themedStyles.primaryTextSchedule}>{this.checkExist(flight.gate)}</Text>
            <View style={themedStyles.row}>
              <Text style={themedStyles.text}>{strings('flight.label.terminal')}</Text>
              <Text style={themedStyles.textValue}>{this.checkExist(flight.terminal)}</Text>
            </View>
            {isArrival &&
              <View style={themedStyles.row}>
                <Text style={themedStyles.text}>{strings('flight.label.baggage')}</Text>
                <Text style={themedStyles.textValue}>{this.checkExist(flight.baggage)}</Text>
              </View>
            }
          </View>
        </View>
        <View style={[themedStyles.flex, themedStyles.secondary]}>
          <View style={[themedStyles.flex, themedStyles.row]}>
            <Icon style={flightIcon} name="airplane" size={12} color={color.arrowRight} />
            <View style={themedStyles.flex}>
              <Text style={themedStyles.text}>{strings('flight.label.scheduled')}</Text>
              <Text style={themedStyles.secondaryTime}>
                {scheduledTime}
              </Text>
            </View>
          </View>
          <View style={[themedStyles.flex, themedStyles.row]}>
            <Icon style={flightIcon} name="airplane" size={12} color={color.arrowRight} />
            <View style={themedStyles.flex}>
              <Text style={themedStyles.text}>
                {flight.actualTime ? strings('flight.label.actual') : strings('flight.label.estimated')}
              </Text>
              <Text style={themedStyles.secondaryTime}>
                {actualTime}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { themedStyles } = this.props;
    const { availableDates } = this.state;

    return (
      <View style={[themedStyles.flex, themedStyles.flightTrackingSchedule]}>
        <StatusBar barStyle="light-content" />
        <View style={themedStyles.flex}>
          <ScrollView horizontal style={themedStyles.scrollView} contentContainerStyle={themedStyles.flex}>
            <View style={[themedStyles.flex, themedStyles.row]}>
              {availableDates.map(this.renderScheduleTabs)}
            </View>
          </ScrollView>
          {this.renderMap()}
          {this.renderGradient()}
          <View style={themedStyles.absoluteScroll}>
            <ScrollView style={themedStyles.flex}>
              <View style={[themedStyles.primaryContainer]}>
                {this.renderSchedule()}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

export default withTheme(FlightTrackingSchedule, styles);
