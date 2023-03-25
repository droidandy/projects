import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, DatePickerAndroid,
  TouchableOpacity, DatePickerIOS
} from 'react-native';

import { Icon } from 'components';

import { withTheme } from 'theme';

import { momentDate, jsDate, timeFormat, isAndroid, isIOS } from 'utils';

import { strings } from 'locales';

import styles from './styles';

class PreBook extends PureComponent {
  static propTypes = {
    areVehiclesAvailable: PropTypes.bool,
    date: PropTypes.instanceOf(Date),
    futureOrderEditing: PropTypes.bool,
    isPreBookVehicle: PropTypes.bool,
    minDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    openTimePickerAndroid: PropTypes.func,
    postEvent: PropTypes.func,
    renderButtonsBlock: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    timezoneName: PropTypes.string,
    timezoneOffset: PropTypes.number
  };

  handleNowSubmit = () => {
    this.props.onSubmit('now');
  };

  handleDateSubmit = () => {
    const { onSubmit, postEvent } = this.props;
    onSubmit('later');
    postEvent('order_details_screen|pre_book|set|button_clicked');
  };

  openDatePickerAndroid = async () => {
    const { date, minDate, onChange, minimalFutureOrderTime } = this.props;
    const moment = momentDate(date);

    try {
      const { action, year, month, day } = await DatePickerAndroid.open({ date, minDate });
      if (action !== DatePickerAndroid.dismissedAction) {
        const selectedTime = moment.set({ year, month, date: day });
        const availableTime = minimalFutureOrderTime.isBefore(selectedTime) ? selectedTime : minimalFutureOrderTime;

        onChange(jsDate(availableTime));
      }
    } catch ({ code, message }) {
      // eslint-disable-next-line no-console
      console.warn('Cannot open date picker', message);
    }
  };

  renderSelectedValue = (value, handler, icon) => {
    const { themedStyles } = this.props;
    return (isAndroid
      ? (
        <TouchableOpacity activeOpacity={0.8} style={themedStyles.row} onPress={handler}>
          {value}
          {icon}
        </TouchableOpacity>
      )
      : value
    );
  };

  renderSelected = () => {
    const { theme: { color }, date, openTimePickerAndroid, themedStyles, timezoneName } = this.props;
    const moment = momentDate(date);

    const timeText = (
      <View style={themedStyles.timeWrapper}>
        <Text style={themedStyles.time}>{moment.format(timeFormat())}</Text>
        <View>
          <Text style={themedStyles.timezone}>{moment.format('z')}</Text>
          <Text style={themedStyles.timezoneTitle}>{timezoneName}</Text>
        </View>
      </View>
    );
    const dateText = <Text style={themedStyles.date}>{moment.format('dddd, MMMM D, YYYY')}</Text>;

    return (
      <View style={themedStyles.selectedWrapper}>
        {this.renderSelectedValue(
          timeText,
          openTimePickerAndroid,
          <Icon style={themedStyles.TDEditIcon} name="editAndroid" color={color.primaryText} />
        )}
        {this.renderSelectedValue(
          dateText,
          this.openDatePickerAndroid,
          <Icon size={20} name="editAndroid" color={color.primaryText} />
        )}
      </View>
    );
  };

  renderControlButtons = () => {
    const { futureOrderEditing, themedStyles, renderButtonsBlock, isPreBookVehicle, areVehiclesAvailable } = this.props;
    const isSingleBtn = futureOrderEditing || (isPreBookVehicle && areVehiclesAvailable);
    const buttons = [
      {
        title: strings('order.button.onDemand'),
        type: 'secondary',
        style: themedStyles.nowButton,
        onPress: this.handleNowSubmit
      },
      {
        title: strings('order.button.set'),
        style: { marginLeft: isSingleBtn ? 16 : 10 },
        onPress: this.handleDateSubmit
      }
    ];

    if (isSingleBtn) {
      buttons.shift();
    }

    return renderButtonsBlock(buttons);
  };

  renderDatePickeriOS = () => {
    const { date, minDate, timezoneOffset, themedStyles, onChange } = this.props;

    return isIOS &&
      <View style={themedStyles.TDPickerWrapper}>
        <DatePickerIOS
          date={date}
          onDateChange={onChange}
          minimumDate={minDate}
          timeZoneOffsetInMinutes={timezoneOffset}
        />
      </View>;
  };

  render() {
    return (
      <Fragment>
        {this.renderSelected()}
        {this.renderDatePickeriOS()}
        {this.renderControlButtons()}
      </Fragment>
    );
  }
}

export default withTheme(PreBook, styles);
