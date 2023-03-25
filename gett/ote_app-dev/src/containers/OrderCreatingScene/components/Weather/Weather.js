import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { startCase } from 'lodash';
import moment from 'moment';

import { getForecast } from 'actions/ui/weather';
import { postEvent } from 'actions/app/gett';

import { Icon, Button, Divider, GradientWrapper } from 'components';
import { withTheme } from 'theme';

import { deviceHeight, deviceWidth } from 'utils';

import styles from './styles';
import { getWeatherIcon, convertDegToCompass, getGradientColors, getTemp } from './utils';

class Weather extends PureComponent {
  static propTypes = {
    getForecast: PropTypes.func,
    postEvent: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    weather: PropTypes.object
  };

  state = {
    isModalOpened: false
  };

  openModal = () => {
    const { postEvent, getForecast } = this.props;
    this.setState({ isModalOpened: true });
    getForecast();
    postEvent('main_screen|weather|button_clicked');
  };

  closeModal = () => this.setState({ isModalOpened: false });

  renderWeatherDetails = () => {
    const { weather: { current, forecast }, themedStyles } = this.props;
    const forecastTemp = forecast.list.length > 0 && forecast.list[0].temp;

    return (
      <GradientWrapper
        colors={getGradientColors(current.weather[0].icon)}
        style={themedStyles.dayWeatherContainer}
      >
        <Icon
          name="weather.dayBackground"
          height={(deviceWidth - 30) / 3.8}
          width={deviceWidth - 30}
          style={themedStyles.dayBackground}
        />
        <View style={themedStyles.dayWeatherContent}>
          <View>
            <Text style={themedStyles.city}>{current.name}</Text>
            <Text style={themedStyles.temperatureHuge}>{getTemp(current.main.temp)}</Text>
            <Text style={themedStyles.description}>{startCase(current.weather[0].description)}</Text>
            <Text style={themedStyles.description}>
              {moment().format('dddd')} {forecastTemp && `${getTemp(forecastTemp.max)}/${getTemp(forecastTemp.min)}`}
            </Text>
          </View>
          <View style={themedStyles.dayWeatherRight}>
            <Icon name={`weather.${getWeatherIcon(current.weather[0].icon)}`} color="#fff" size={88} />
            <View style={themedStyles.valueRow}>
              <Icon name="weather.humidity" size={12} style={themedStyles.valueIcon} />
              <Text style={themedStyles.description}>Humidity</Text>
              <Text style={[themedStyles.description, themedStyles.value]}>{current.main.humidity}%</Text>
            </View>
            <View style={themedStyles.valueRow}>
              <Icon name="weather.wind" size={12} style={themedStyles.valueIcon} />
              <Text style={themedStyles.description}>Wind</Text>
              <Text style={[themedStyles.description, themedStyles.value]}>
                {convertDegToCompass(current.wind.deg)} {current.wind.speed}m/s
              </Text>
            </View>
          </View>
        </View>
      </GradientWrapper>
    );
  };

  renderWeatherForecast = () => {
    const { weather: { forecast }, theme, themedStyles } = this.props;
    return (
      <View style={themedStyles.forecast}>
        {forecast.list.map(day => (
          <View key={day.dt} style={themedStyles.forecastDay}>
            <Text style={themedStyles.dayTitle}>
              {moment.unix(day.dt).format('ddd').toUpperCase()}
            </Text>
            <Icon style={themedStyles.forecastIcon} name={`weather.${getWeatherIcon(day.weather[0].icon)}`} size={33} />
            <Text style={themedStyles.forecastDayTemp}>
              {getTemp(day.temp.max)}
            </Text>
            <Text style={themedStyles.forecastNightTemp}>
              {getTemp(day.temp.min)}
            </Text>
            <View style={themedStyles.row}>
              <Icon
                style={themedStyles.forecastHumidityIcon}
                name="weather.humidity"
                size={10}
                color={theme.color.secondaryText}
              />
              <Text style={themedStyles.forecastHumidity}>{day.humidity}%</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  renderSpinner = () => (
    <View style={this.props.themedStyles.spinnerWrapper}>
      <ActivityIndicator color={this.props.theme.color.secondaryText} />
    </View>
  );

  renderWeatherModal = () => {
    const { theme, weather: { forecast }, themedStyles } = this.props;
    return (
      <Modal
        isVisible={this.state.isModalOpened}
        style={[themedStyles.container]}
        backdropColor={theme.color.backdrop}
        onBackButtonPress={this.closeModal}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
      >
        <View style={themedStyles.modalContent}>
          {this.renderWeatherDetails()}
          <View style={themedStyles.forecastContent}>
            {forecast.busy ? this.renderSpinner() : this.renderWeatherForecast()}
            <Divider left={0} style={themedStyles.modalDivider} />
            <Button
              style={themedStyles.closeBtnWrapper}
              styleContent={themedStyles.closeBtn}
              onPress={this.closeModal}
              size="mid"
              title="Close"
            />
          </View>
        </View>
      </Modal>
    );
  };

  renderWeatherBtn = () => {
    const { weather: { current }, themedStyles } = this.props;

    return (
      <Button
        styleContent={themedStyles.weatherBtn}
        onPress={this.openModal}
      >
        <Text style={themedStyles.temperature}>
          {getTemp(current.main.temp)}
        </Text>
        <Divider left={0} style={themedStyles.divider} />
        <Icon name={`weather.${getWeatherIcon(current.weather[0].icon)}`} size={33}/>
      </Button>
    );
  };

  render() {
    const { weather: { current } } = this.props;

    if (!current.main) return null;

    return (
      <Fragment>
        {this.renderWeatherBtn()}
        {this.renderWeatherModal()}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ ui }) => ({
  weather: ui.weather
});

const mapDispatchToProps = {
  getForecast,
  postEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Weather, styles));
