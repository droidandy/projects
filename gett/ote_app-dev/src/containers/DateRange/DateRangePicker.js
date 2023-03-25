import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment-timezone';

import { withTheme } from 'theme';
import { calendarDate } from 'utils';
import { getCalendarTheme } from './utils';
import styles from './styles';

class DateRangePicker extends PureComponent {
  static propTypes = {
    initialValue: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    value: PropTypes.array
  };

  onDayPress = (day) => {
    const { onChange, value } = this.props;
    const range = moment(day.dateString).diff(moment(value[0]), 'days');
    if (!value[0] || this.endDateSelected || range <= 0 || !this.startDateSelected) {
      this.endDateSelected = false;
      this.startDateSelected = true;
      onChange([day.dateString, day.dateString]);
    } else {
      onChange([value[0], day.dateString]);
      this.endDateSelected = true;
    }
  };

  get calendarTheme() {
    const { theme } = this.props;
    return getCalendarTheme(theme);
  }

  get markedDatesTheme() {
    const { theme } = this.props;

    return {
      color: theme.isNightMode ? theme.color.bgSecondary : theme.color.pixelLine,
      textColor: theme.color.primaryText
    };
  }

  getMarkedDates = () => {
    const { value } = this.props;
    const markedDates = {};

    if (!value.length) return markedDates;

    const fromDate = moment(value[0]);
    const toDate = moment(value[1]);
    const range = moment(toDate).diff(fromDate, 'days');
    markedDates[calendarDate(fromDate)] = { startingDay: true, ...this.markedDatesTheme };
    markedDates[calendarDate(toDate)] = {
      ...markedDates[calendarDate(toDate)],
      endingDay: true,
      ...this.markedDatesTheme
    };

    if (range > 0) {
      for (let i = 1; i < range; i += 1) {
        markedDates[calendarDate(fromDate.add(1, 'days'))] = this.markedDatesTheme;
      }
    }

    return markedDates;
  };

  render() {
    const { initialValue, themedStyles, ...rest } = this.props;

    return (
      <CalendarList
        style={themedStyles.calendarList}
        markingType="period"
        firstDay={1}
        current={initialValue[0]}
        markedDates={this.getMarkedDates()}
        onDayPress={this.onDayPress}
        futureScrollRange={240}
        scrollEnabled
        {...rest}
        theme={this.calendarTheme}
      />
    );
  }
}

export default withTheme(DateRangePicker, styles);
