import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import moment from 'moment';

import { saveFlight, changeFlight } from 'actions/booking';
import { postEvent } from 'actions/app/gett';

import { Input, Icon, Button, KeyboardAvoidingWrapper } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { timeFormat, throttledAction, getSeparatedDate } from 'utils';
import { containers } from 'testIDs';
import { flightstats } from 'api';

import styles from './styles';

const IDs = containers.FlightSettings;

class FlightSettings extends Component {
  static propTypes = {
    changeFlight: PropTypes.func,
    date: PropTypes.string,
    flight: PropTypes.string,
    onClose: PropTypes.func,
    postEvent: PropTypes.func,
    saveFlight: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  state = {
    selected: 0,
    flight: this.props.flight || '',
    verifiedSaved: undefined,
    verifiedFlight: undefined,
    verificationData: null,
    originalData: null,
    loading: false
  };

  componentDidMount() {
    this.checkFlightVerified();
    this.handleVerify();
  }

  getAirportAddress = ({ name, terminal }) => (
    `${name}${terminal ? ` - Terminal ${terminal}` : ''}`
  );

  setFlightDetails = (flightData) => {
    const { departure, arrival } = flightData;
    const dateFormat = `DD/MM/YYYY ${timeFormat()}`;

    this.setState({
      verificationData: [
        { title: strings('flight.label.flightNumber'), text: `${flightData.carrier} ${flightData.flight}` },
        { title: strings('booking.label.departing'), text: moment(departure.time).format(dateFormat) },
        { title: strings('booking.label.arriving'), text: moment(arrival.time).format(dateFormat) },
        { title: strings('flight.label.from'), text: this.getAirportAddress(departure) },
        { title: strings('flight.label.to'), text: this.getAirportAddress(arrival) }
      ],
      loading: false
    });
  };

  onCloseModal = () => {
    const { changeFlight, onClose } = this.props;
    changeFlight({ flight: '' }, false);
    onClose();
  };

  handleSave = throttledAction(async () => {
    const { saveFlight, changeFlight, postEvent } = this.props;
    const { verifiedSaved, flight } = this.state;

    if (verifiedSaved) {
      postEvent('order_details_screen|flight_number|save|button_clicked', { flight_number: flight });
      if (!flight) changeFlight({ flight: '' }, false);
      await saveFlight();
      this.onCloseModal();
    }
  });

  handleVerify = () => {
    const { flight } = this.state;

    if (!flight) return;

    const { year, month, day } = getSeparatedDate(this.props.date);

    this.setState({
      loading: true, verificationData: null, verifiedFlight: undefined, error: null, originalData: null
    });

    this.props.postEvent('order_details_screen|flight_number|verify|button_clicked', { flight_number: flight });

    flightstats.getFlights({ flight, year, month, day })
      .then(({ data }) => {
        this.props.changeFlight({ flight }, true);

        const flightData = data[0];

        this.setState({ originalData: data, verifiedFlight: flight, selected: 0 }, () => {
          this.setFlightDetails(flightData);
          this.checkFlightVerified();
        });
      })
      .catch(() => {
        this.props.changeFlight({ flight: '' }, false);

        this.setState({
          error: strings('flight.text.notFoundFlightNumber'),
          loading: false
        });
      });
  };

  checkFlightVerified = () => {
    const { flight, verifiedFlight } = this.state;
    const wantToDelete = this.props.flight && this.props.flight !== '' && flight === '';
    const verifiedSaved = verifiedFlight === flight;
    this.setState({ verifiedSaved: verifiedSaved || wantToDelete });
  };

  handleChangeNumber = (flight) => {
    this.setState({ flight, error: null }, this.checkFlightVerified);
  };

  handleChangeSelectedData = (index) => {
    this.setState({ selected: index }, () => {
      this.setFlightDetails(this.state.originalData[index]);
    });
  };

  renderFlightData = (item) => {
    const { themedStyles } = this.props;
    return (
      <View key={item.title} style={themedStyles.results}>
        <Text style={themedStyles.resultTitle}>{item.title}</Text>
        <Text style={themedStyles.resultLabel}>{item.text}</Text>
      </View>
    );
  };

  renderButton = ({ onPress, label }) => {
    const { themedStyles } = this.props;
    return (
      <Button
        onPress={onPress}
        size="sm"
        style={themedStyles.verifyButton}
        title={label}
        testID={`flightSettings/${label}Btn`}
      />
    );
  };

  renderVerifyButton = () => {
    const { verifiedSaved } = this.state;
    const save = { onPress: this.handleSave, label: strings('flight.button.save') };
    const verify = { onPress: this.handleVerify, label: strings('flight.button.verify') };

    return this.renderButton(verifiedSaved ? save : verify);
  };

  renderTabs = () => {
    const { themedStyles, theme } = this.props;
    const { originalData, selected } = this.state;

    return (
      <View style={themedStyles.tabsContainer}>
        {originalData.map((item, index) => {
          const isSelected = index === selected;
          const iconColor = theme.color[isSelected ? 'primaryText' : 'secondaryText'];

          return (
            <TouchableWithoutFeedback
              onPress={() => this.handleChangeSelectedData(index)}
              key={`${item.arrival.code} ${item.departure.code}`}
            >
              <View style={[themedStyles.tab, isSelected && themedStyles.activeTab]}>
                <View style={themedStyles.tabLabelContainer}>
                  <Text style={[themedStyles.tabLabel, isSelected && themedStyles.activeTabLabel]}>
                    {item.arrival.code}
                  </Text>
                  <Icon name="airplane" size={12} color={iconColor} style={themedStyles.tabIcon} />
                  <Text style={[themedStyles.tabLabel, isSelected && themedStyles.activeTabLabel]}>
                    {item.departure.code}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    );
  };

  renderFlightInput = () => {
    const { themedStyles } = this.props;
    const { flight, error } = this.state;

    return (
      <Input
        label={strings('flight.label.flightNumber')}
        value={flight}
        autoFocus
        onChangeText={this.handleChangeNumber}
        inputStyle={themedStyles.input}
        errorStyle={themedStyles.error}
        style={themedStyles.flex}
        error={error && [error]}
        testID={IDs.input}
      />
    );
  };

  render() {
    const { themedStyles, theme } = this.props;
    const { originalData, verificationData, loading } = this.state;

    return (
      <KeyboardAvoidingWrapper
        keyboardVerticalOffset={20}
        style={themedStyles.flex}
      >
        <View style={themedStyles.inputWrapper}>
          {this.renderFlightInput()}
          {this.renderVerifyButton()}
        </View>
        <ScrollView keyboardShouldPersistTaps="handled">
          {loading && <ActivityIndicator color={theme.color.secondaryText} />}

          {originalData?.length > 1 && this.renderTabs()}

          {verificationData &&
            <View style={themedStyles.resultsWrapper}>
              {verificationData.map(this.renderFlightData)}
            </View>
          }
        </ScrollView>
      </KeyboardAvoidingWrapper>
    );
  }
}

const mapStateToProps = ({ booking }) => ({
  date: booking.bookingForm.scheduledAt,
  flight: booking.bookingForm.flight
});

export default connect(mapStateToProps, { changeFlight, saveFlight, postEvent })(withTheme(FlightSettings, styles));
