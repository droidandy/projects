import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, DatePickerAndroid, TimePickerAndroid,
  TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { castArray } from 'lodash';

import { changeFields, asyncChangeFields, changeScheduleFields, changeRecurringPeriod } from 'actions/booking';
import { postEvent } from 'actions/app/gett';
import { bookings } from 'api';
import { Modal, BackBtn, Header, Button } from 'components';

import { withTheme } from 'theme';
import { strings } from 'locales';

import {
  minutesForward,
  momentDate,
  jsDate,
  convertToZone,
  isAndroid,
  isIOS,
  is24HourFormat,
  getMinimalFutureOrderDelay,
  touchableArea
} from 'utils';

import PickUpLabel from './PickUpLabel';

import styles from './styles';
import PreBook from './PreBook';
import Recurring from './Recurring';

let cancelRequest;

class PickUpTime extends PureComponent {
  static propTypes = {
    areVehiclesAvailable: PropTypes.bool,
    asyncChangeFields: PropTypes.func,
    booking: PropTypes.object,
    changeFields: PropTypes.func,
    editingDisable: PropTypes.bool,
    futureOrderEditing: PropTypes.bool,
    postEvent: PropTypes.func,
    requestVehicles: PropTypes.func,
    revertVehicle: PropTypes.func,
    themedStyles: PropTypes.object,
    title: PropTypes.string,
    vehicleName: PropTypes.string,
    vehiclesData: PropTypes.object,
    wrapperStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  };

  static defaultProps = {
    futureOrderEditing: false
  };

  state = {
    date: jsDate(minutesForward(30)),
    minDate: jsDate(minutesForward(30)),
    scheduledAt: jsDate(minutesForward(30)),
    scheduledType: 'later',
    schedule: {
      presetType: 'daily',
      custom: false,
      recurrenceFactor: '1',
      scheduledAts: []
    },
    isModalOpened: false,
    isRecurringTimePickerOpened: false,
    isRecurringPeriodPickerOpened: false,
    recurringPeriod: [],
    modalHeight: '95%'
  };

  componentDidUpdate({ vehicleName: vehicleNameProps }) {
    this.setFutureTimeLimitForVehicleType({ vehicleNameProps });
  }

  get isRecurring() {
    return this.state.scheduledType === 'recurring';
  }

  setFutureTimeLimitForVehicleType = ({ vehicleNameProps }) => {
    const { vehicleName, booking: { scheduledAt } } = this.props;

    if (vehicleName && vehicleName !== vehicleNameProps) {
      const timeWithDelay = jsDate(this.getMinimalFutureOrderTime());

      this.setState({ date: scheduledAt ? jsDate(moment(scheduledAt)) : timeWithDelay, minDate: timeWithDelay });
    }
  };

  openPickerModal = () => {
    const { booking: { scheduledAt, schedule, scheduledType }, postEvent } = this.props;
    const minDate = this.getMinimalFutureOrderTime();

    postEvent('order_details_screen|pickup_time|button_clicked');
    this.setState({
      isModalOpened: true,
      date: jsDate(scheduledAt ? moment(scheduledAt) : minDate),
      minDate: jsDate(minDate),
      scheduledAt: jsDate(scheduledAt ? moment(scheduledAt) : minDate),
      scheduledType: scheduledType && scheduledType !== 'now' ? scheduledType : 'later',
      schedule: { ...this.state.schedule, ...schedule }
    });
  };

  getMinimalFutureOrderTime = () => {
    const { vehicleName, vehiclesData } = this.props;
    return minutesForward(getMinimalFutureOrderDelay(vehicleName, vehiclesData.vehicles));
  };

  getTimezoneOffset = () => {
    const { date } = this.state;
    const { booking: { pickupAddress, timezone } } = this.props;
    const moment = momentDate(date);
    let timezoneDate = moment;

    if ((pickupAddress?.timezone) || timezone) {
      timezoneDate = convertToZone(moment, pickupAddress?.timezone || timezone);
    }
    return timezoneDate.utcOffset();
  };

  cancelPickerModal = () => {
    this.closePickerModal();
    this.props.revertVehicle();
  };

  closePickerModal = () => {
    this.setState({ isModalOpened: false, recurringPeriod: [] });
  };

  handleDateChange = (date) => {
    const minDate = jsDate(this.getMinimalFutureOrderTime());

    this.setState({ date: date || minDate, minDate });
  };

  setTimePickerTime = (time) => {
    const { date } = this.state;
    const moment = momentDate(date);
    const toTime = time ? moment.set({ ...time }) : moment;
    const minDate = this.getMinimalFutureOrderTime();

    if (minDate.isBefore(toTime)) {
      this.handleDateChange(jsDate(toTime));
    } else {
      this.handleDateChange(jsDate(minDate));
    }
  };

  getMinScheduledAt = (type, date) => {
    const minDate = this.getMinimalFutureOrderTime();
    return jsDate(minDate.isBefore(momentDate(date)) ? momentDate(date) : minDate);
  };

  handleDateTimeSubmit = async (type = 'now') => {
    const { date } = this.state;
    const { requestVehicles, asyncChangeFields } = this.props;

    const scheduledAt = type !== 'now' ? this.getMinScheduledAt(type, date) : null;

    await asyncChangeFields({ scheduledType: type, scheduledAt, schedule: null });
    this.closePickerModal();
    requestVehicles();
  };

  handleTabChange = (type = 'later') => {
    const { booking: { schedule, scheduledAt, scheduledType }, postEvent } = this.props;
    const minScheduledAt = this.getMinScheduledAt(type, type === scheduledType ? scheduledAt : moment());

    postEvent('order_details_screen|pickup_time|tab_clicked', {
      tab: type === 'later' ? 'pre-book' : 'recurring order'
    });

    this.setState({
      scheduledType: type,
      date: minScheduledAt,
      scheduledAt: minScheduledAt,
      schedule: { ...this.state.schedule, startingAt: minScheduledAt, endingAt: minScheduledAt, ...schedule }
    }, () => { if (type === 'recurring') this.getFormDetails(); });
  };

  handleLaterTabPress = () => this.handleTabChange('later');

  handleRecurringTabPress = () => this.handleTabChange('recurring');

  toggleRecurringTimePicker = () => {
    const { isRecurringTimePickerOpened, scheduledAt } = this.state;
    if (isAndroid) {
      this.openTimePickerAndroid(this.handleRecurringTimeSubmit)();
    } else {
      this.setState({ isRecurringTimePickerOpened: !isRecurringTimePickerOpened, date: scheduledAt });
    }
  };

  toggleRecurringPeriodPicker = () => {
    const { isRecurringPeriodPickerOpened } = this.state;
    this.setState({ isRecurringPeriodPickerOpened: !isRecurringPeriodPickerOpened });
    this.clearRecurringPeriod();
  };

  handleRecurringTimeSubmit = (time) => {
    const { date, schedule, scheduledAt } = this.state;
    let newDate = momentDate(isIOS ? date : scheduledAt);
    const minDate = this.getMinimalFutureOrderTime();
    if (isAndroid) {
      newDate.set({ ...time });
    }

    if (newDate.isBefore(minDate)) {
      newDate = minDate;
    }
    const startingAt = jsDate(momentDate(schedule.startingAt).set({ h: newDate.hour(), m: newDate.minute() }));
    const endingAt = jsDate(momentDate(schedule.endingAt).set({ h: newDate.hour(), m: newDate.minute() }));

    this.setState({
      date: jsDate(newDate),
      scheduledAt: jsDate(newDate),
      schedule: { ...schedule, startingAt, endingAt }
    }, () => {
      if (isIOS) this.toggleRecurringTimePicker();
      this.getFormDetails();
    });
  };

  handleRecurringFormSubmit = async () => {
    const { asyncChangeFields, requestVehicles, postEvent } = this.props;
    const { scheduledAt, schedule, scheduledType } = this.state;
    this.closePickerModal();
    await asyncChangeFields({ scheduledAt, schedule, scheduledType });
    postEvent('order_details_screen|recurring_order|save|button_clicked');
    requestVehicles();
  };

  handleCancelToken = (c) => { cancelRequest = c; };

  getFormDetails = (requestParams = { requestScheduledAts: true }) => {
    const { booking } = this.props;
    const { scheduledAt, schedule, scheduledType } = this.state;
    const params = {
      ...booking,
      scheduledAt,
      schedule: { ...schedule, recurrenceFactor: +schedule.recurrenceFactor || 1 },
      scheduledType
    };
    if (cancelRequest) cancelRequest();
    return bookings.getFormDetails(params, requestParams, this.handleCancelToken)
      .then(data => this.setState({ schedule: { ...schedule, scheduledAts: data.attrs.scheduledAts } }));
  };

  handleRecurringFieldChange = (field, value, requestParams) => {
    const { schedule } = this.state;

    this.setState({ schedule: { ...schedule, [field]: value } }, () => this.getFormDetails(requestParams));
  };

  handleRecurringPeriodSubmit = ({ from, to }) => {
    const { scheduledAt, schedule } = this.state;

    const momentScheduledAt = momentDate(scheduledAt);
    const startingAt = jsDate(momentDate(from).set({ h: momentScheduledAt.hour(), m: momentScheduledAt.minute() }));
    const endingAt = jsDate(momentDate(to).set({ h: momentScheduledAt.hour(), m: momentScheduledAt.minute() }));

    this.setState(
      {
        schedule: { ...schedule, startingAt, endingAt },
        scheduledAt: startingAt,
        isRecurringPeriodPickerOpened: false
      },
      this.getFormDetails
    );
  };

  handleRecurringPeriodChange = value => this.setState({ recurringPeriod: value });

  openTimePickerAndroid = onChange => async () => {
    const { date } = this.state;
    const moment = momentDate(date);

    try {
      onChange();
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: moment.get('hour'),
        minute: moment.get('minute'),
        is24Hour: is24HourFormat()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        onChange({ hour, minute });
      }
    } catch ({ code, message }) {
      // eslint-disable-next-line no-console
      console.warn('Cannot open time picker', message);
    }
  };

  renderTabBar = () => {
    const { themedStyles } = this.props;
    const { scheduledType } = this.state;
    const tabs = [
      { title: strings('order.type.preBook'), key: 'later', onPress: this.handleLaterTabPress },
      { title: strings('order.type.recurring'), key: 'recurring', onPress: this.handleRecurringTabPress }
    ];

    return (
      <View style={themedStyles.tabBarContainer}>
        {tabs.map(({ key, title, onPress }) => (
          <TouchableWithoutFeedback key={key} onPress={onPress}>
            <View
              style={[
                themedStyles.flex,
                themedStyles.tabContainer,
                key === scheduledType && themedStyles.activeTab
              ]}
            >
              <Text style={[themedStyles.tabLabel, key === scheduledType && themedStyles.activeTabLabel]}>
                {title.toUpperCase()}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  };

  renderButton = ({ style, styleText, ...rest }) => {
    const { themedStyles } = this.props;

    return (
      <Button
        {...rest}
        key={rest.title}
        stretched
        disabledStyle={themedStyles.disabledButton}
        style={themedStyles.flex}
        styleContent={[themedStyles.primaryBtn, style]}
      />
    );
  };

  renderButtonsBlock = (buttons, style = {}) => {
    const { themedStyles } = this.props;
    const buttonsArray = castArray(buttons);

    return (
      <View style={[themedStyles.row, themedStyles.controlsWrapper, style]}>
        {buttonsArray.map(this.renderButton)}
      </View>
    );
  }

  renderRecurringContent = () => {
    const {
      schedule,
      scheduledAt,
      date,
      minDate,
      isRecurringTimePickerOpened,
      isRecurringPeriodPickerOpened,
      recurringPeriod
    } = this.state;

    return (
      <Recurring
        date={date}
        schedule={schedule}
        scheduledAt={scheduledAt}
        recurringPeriod={recurringPeriod}
        onFieldChange={this.handleRecurringFieldChange}
        onDateChange={this.handleDateChange}
        onTimeSubmit={this.handleRecurringTimeSubmit}
        onSubmit={this.handleRecurringFormSubmit}
        minDate={minDate}
        timezoneOffset={this.getTimezoneOffset()}
        toggleRecurringTimePicker={this.toggleRecurringTimePicker}
        isRecurringTimePickerOpened={isRecurringTimePickerOpened}
        isRecurringPeriodPickerOpened={isRecurringPeriodPickerOpened}
        toggleRecurringPeriodPicker={this.toggleRecurringPeriodPicker}
        onRangeChange={this.handleRecurringPeriodChange}
        onPeriodSubmit={this.handleRecurringPeriodSubmit}
        renderButtonsBlock={this.renderButtonsBlock}
      />
    );
  };

  renderPreBookContent = () => {
    const { date, minDate } = this.state;
    const {
      futureOrderEditing, booking: { pickupAddress, isPreBookVehicle }, postEvent, areVehiclesAvailable
    } = this.props;

    return (
      <PreBook
        onChange={this.handleDateChange}
        date={date}
        minDate={minDate}
        timezoneOffset={this.getTimezoneOffset()}
        timezoneName={pickupAddress?.timezone}
        futureOrderEditing={futureOrderEditing}
        onSubmit={this.handleDateTimeSubmit}
        openTimePickerAndroid={this.openTimePickerAndroid(this.setTimePickerTime)}
        renderButtonsBlock={this.renderButtonsBlock}
        isPreBookVehicle={isPreBookVehicle}
        minimalFutureOrderTime={this.getMinimalFutureOrderTime()}
        postEvent={postEvent}
        areVehiclesAvailable={areVehiclesAvailable}
      />
    );
  };

  clearRecurringPeriod = () => this.handleRecurringPeriodChange([]);

  renderClearPeriodBtn = () => {
    const { themedStyles } = this.props;
    return (
      <TouchableOpacity onPress={this.clearRecurringPeriod} hitSlop={touchableArea}>
        <Text style={themedStyles.periodModalClear}>{strings('header.button.clear')}</Text>
      </TouchableOpacity>
    );
  };

  renderBackPeriodBtn() {
    const { themedStyles } = this.props;
    return (
      <BackBtn handlePress={this.toggleRecurringPeriodPicker} containerStyle={themedStyles.backPeriodBtn} />
    );
  }

  renderPeriodModalHeader = () => {
    const { themedStyles } = this.props;
    return (
      <Header
        titleCenter
        title={strings('order.label.period')}
        customStylesTitle={themedStyles.periodModalHeaderTitle}
        customStyles={themedStyles.periodModalHeader}
        leftButton={this.renderBackPeriodBtn()}
        rightButton={this.renderClearPeriodBtn()}
      />
    );
  };

  renderModal() {
    const { themedStyles, futureOrderEditing } = this.props;
    const { isModalOpened, isRecurringTimePickerOpened, isRecurringPeriodPickerOpened } = this.state;
    const areTabsHidden = isRecurringTimePickerOpened || isRecurringPeriodPickerOpened || futureOrderEditing;

    return (
      <Modal
        isVisible={isModalOpened}
        onClose={isRecurringTimePickerOpened ? this.toggleRecurringTimePicker : this.cancelPickerModal}
        contentStyles={themedStyles.modal}
        headerContent={isRecurringPeriodPickerOpened && this.renderPeriodModalHeader}
        testID="pickupTimeModal"
        type={this.isRecurring && !isRecurringTimePickerOpened ? 'fullScreen' : 'dynamicHeight'}
      >
        {!areTabsHidden && this.renderTabBar()}
        {this.isRecurring
          ? this.renderRecurringContent()
          : this.renderPreBookContent()
        }
      </Modal>
    );
  }

  render() {
    const { booking, wrapperStyle, editingDisable } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.openPickerModal} testID="pickupTime">
        <View>
          <PickUpLabel
            editingDisable={editingDisable}
            booking={booking}
            wrapperStyle={wrapperStyle}
          />

          {this.renderModal()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = ({ booking }) => ({
  vehicleName: booking.bookingForm.vehicleName,
  vehiclesData: booking.vehiclesData
});

const mapDispatchToProps = {
  asyncChangeFields,
  changeFields,
  changeRecurringPeriod,
  changeScheduleFields,
  postEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PickUpTime, styles));
