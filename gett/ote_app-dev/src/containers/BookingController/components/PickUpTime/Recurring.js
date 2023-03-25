import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View, ScrollView, Text, TouchableWithoutFeedback,
  TouchableOpacity, DatePickerIOS
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment-timezone';
import { compact, xor, sortBy } from 'lodash';

import { Icon, Input, Divider, Switch } from 'components';
import RecurringPeriod from 'containers/DateRange/BaseDateRange';

import { withTheme } from 'theme';

import { momentDate, timeFormat, jsDate, calendarDate, isAndroid } from 'utils';
import { strings } from 'locales';
import { getCalendarTheme } from 'containers/DateRange/utils';

import styles from './styles';

const formatLabelDate = date => moment(date).format('D MMM YYYY');

class Recurring extends PureComponent {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    isRecurringPeriodPickerOpened: PropTypes.bool,
    isRecurringTimePickerOpened: PropTypes.bool,
    minDate: PropTypes.instanceOf(Date),
    onDateChange: PropTypes.func,
    onFieldChange: PropTypes.func,
    onPeriodSubmit: PropTypes.func,
    onRangeChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onTimeSubmit: PropTypes.func,
    recurringPeriod: PropTypes.array,
    renderButtonsBlock: PropTypes.func,
    schedule: PropTypes.object,
    scheduledAt: PropTypes.instanceOf(Date),
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    timezoneOffset: PropTypes.number,
    toggleRecurringPeriodPicker: PropTypes.func,
    toggleRecurringTimePicker: PropTypes.func
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

  getMarkedScheduledAts() {
    return this.props.schedule.scheduledAts.reduce((res, d) => {
      res[calendarDate(d)] = { ...this.markedDatesTheme, startingDay: true, endingDay: true };
      return res;
    }, {});
  }

  getRecurringPeriodInitialValue = () => {
    const { schedule: { startingAt, endingAt } } = this.props;
    return compact([
      startingAt && calendarDate(startingAt),
      endingAt && calendarDate(endingAt)
    ]);
  };

  handleDayPress = (day) => {
    const { schedule: { scheduledAts }, onFieldChange, scheduledAt } = this.props;
    const date = momentDate(scheduledAt);
    const newScheduledAts = sortBy(xor(scheduledAts.map(calendarDate), [day.dateString])
      .map(d => jsDate(momentDate(d).set({ h: date.hour(), m: date.minute() }))));
    onFieldChange('scheduledAts', newScheduledAts, {});
  };

  handleRecurrenceFactorChange = v => this.props.onFieldChange('recurrenceFactor', v);

  handleWorkdaysOnlyChange = v => this.props.onFieldChange('workdaysOnly', v);

  renderPeriodAdjuster = () => {
    const { recurringPeriod, themedStyles } = this.props;
    const enablePeriod = recurringPeriod.length ? recurringPeriod : this.getRecurringPeriodInitialValue();
    return (
      <Fragment>
        <Text style={[themedStyles.content, themedStyles.recurringTitle]}>
          {strings('order.text.excludeDaysFromSchedule')}
        </Text>
        <CalendarList
          theme={this.calendarTheme}
          scrollEnabled
          pagingEnabled
          horizontal
          markingType="period"
          firstDay={1}
          pastScrollRange={0}
          markedDates={this.getMarkedScheduledAts()}
          minDate={enablePeriod[0]}
          maxDate={enablePeriod[1]}
          onDayPress={this.handleDayPress}
        />
      </Fragment>
    );
  };

  renderPeriodPicker = () => {
    const {
      isRecurringPeriodPickerOpened,
      recurringPeriod,
      onRangeChange,
      onPeriodSubmit,
      schedule: { startingAt },
      themedStyles
    } = this.props;
    if (!isRecurringPeriodPickerOpened) return null;
    const pastScrollRange = momentDate(startingAt).startOf('month').diff(momentDate().startOf('month'), 'months');

    return (
      <Fragment>
        <Divider left={0} />
        <RecurringPeriod
          withoutHeader
          withWrappers
          initialValue={this.getRecurringPeriodInitialValue()}
          value={recurringPeriod}
          onRangeChange={onRangeChange}
          onChange={onPeriodSubmit}
          pastScrollRange={pastScrollRange}
          futureScrollRange={12}
          calendarStyles={themedStyles.calendar}
          minDate={calendarDate()}
        />
      </Fragment>
    );
  };

  renderTimePickerIos = () => {
    const {
      timezoneOffset,
      date,
      minDate,
      isRecurringTimePickerOpened,
      onDateChange,
      onTimeSubmit,
      themedStyles,
      renderButtonsBlock
    } = this.props;
    if (isAndroid || !isRecurringTimePickerOpened) return null;

    const moment = momentDate(date);
    const btn = { title: strings('order.button.set'), onPress: onTimeSubmit };

    return (
      <Fragment>
        <View style={themedStyles.selectedWrapper}>
          <Text style={themedStyles.time}>{moment.format(timeFormat())}</Text>
        </View>
        <View style={themedStyles.TDPickerWrapper}>
          <DatePickerIOS
            mode="time"
            date={date}
            onDateChange={onDateChange}
            minimumDate={minDate}
            timeZoneOffsetInMinutes={timezoneOffset}
          />
        </View>
        {renderButtonsBlock(btn)}
      </Fragment>
    );
  };

  renderRecurringForm = () => {
    const {
      schedule,
      scheduledAt,
      theme: { color },
      isRecurringTimePickerOpened,
      isRecurringPeriodPickerOpened,
      toggleRecurringPeriodPicker,
      toggleRecurringTimePicker,
      onSubmit,
      themedStyles,
      renderButtonsBlock
    } = this.props;
    if (isRecurringTimePickerOpened || isRecurringPeriodPickerOpened) return null;

    const options = [
      {
        title: strings('order.label.time'),
        icon: 'clock',
        value: moment(scheduledAt).format(timeFormat()),
        onPress: toggleRecurringTimePicker
      },
      {
        title: strings('order.label.period'),
        icon: 'calendarRange',
        value: `${formatLabelDate(schedule.startingAt)} - ${formatLabelDate(schedule.endingAt)}`,
        onPress: toggleRecurringPeriodPicker
      }
    ];

    const saveBtn = {
      title: strings('order.button.save'),
      onPress: onSubmit,
      disabled: !(schedule.scheduledAts && schedule.scheduledAts.length)
    };

    return (
      <Fragment>
        <ScrollView style={[themedStyles.flex, { backgroundColor: 'transparent' }]}>
          <TouchableOpacity>
            <TouchableWithoutFeedback>
              <View style={themedStyles.flex}>
                <Text style={[themedStyles.content, themedStyles.recurringTitle]}>
                  {strings('order.text.setBookingSchedule')}
                </Text>
                <View style={[themedStyles.content, themedStyles.row]}>
                  <Input
                    value={schedule.recurrenceFactor.toString()}
                    onChangeText={this.handleRecurrenceFactorChange}
                    label={strings('order.label.every')}
                    keyboardType="numeric"
                    style={[themedStyles.flex, themedStyles.recurrenceFactorInput]}
                  />
                  <Text style={themedStyles.inputLabel}>{strings('order.label.everyDays')}</Text>
                </View>
                <View style={[themedStyles.content, themedStyles.row, themedStyles.workdays]}>
                  <Text style={[themedStyles.flex, themedStyles.inputLabel]}>
                    {strings('order.label.workdaysOnly')}
                  </Text>
                  <Switch value={schedule.workdaysOnly} onValueChange={this.handleWorkdaysOnlyChange} />
                </View>

                <Divider left={0} />
                {options.map(option => (
                  <Fragment key={option.title}>
                    <TouchableWithoutFeedback onPress={option.onPress}>
                      <View style={[themedStyles.content, themedStyles.row, themedStyles.recurringOptionContainer]}>
                        <Icon
                          name={option.icon}
                          color={color.primaryText}
                          size={26}
                          style={themedStyles.recurringOptionIcon}
                        />
                        <View style={themedStyles.flex}>
                          <Text style={themedStyles.recurringOptionTitle}>{option.title}</Text>
                          <Text style={themedStyles.recurringOptionValue} numberOfLines={1}>
                            {option.value}
                          </Text>
                        </View>
                        <Icon name="chevron" color={color.arrowRight} width={10} />
                      </View>
                    </TouchableWithoutFeedback>
                    <Divider left={0} />
                  </Fragment>
                ))}
                {this.renderPeriodAdjuster()}
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </ScrollView>
        {renderButtonsBlock(saveBtn, themedStyles.shadowWrapper)}
      </Fragment>
    );
  };

  render() {
    return (
      <Fragment>
        {this.renderRecurringForm()}
        {this.renderTimePickerIos()}
        {this.renderPeriodPicker()}
      </Fragment>
    );
  }
}

export default withTheme(Recurring, styles);
