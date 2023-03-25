import React from 'react';
import PropTypes from 'prop-types';
import Form, { Radio, Input, Checkbox, CheckboxGroup, DatePicker, TimePicker, Calendar } from 'components/form';
import { weekdays } from 'pages/shared/bookings/data';
import { map, difference, sortBy, some, isEmpty } from 'lodash';
import moment from 'moment';
import CN from 'classnames';
import css from 'pages/shared/bookings/style.css';

export default class RecurrenceForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    disabledDates: PropTypes.func,
    unavailableScheduledAts: PropTypes.arrayOf(PropTypes.object)
  };

  validations = {
    endingAt: {
      presence: { if() { return !this.get('custom'); } }
    },
    scheduledAts: function(value) {
      if (isEmpty(value)) return 'At least one ride should be scheduled';

      if (this.get('custom')) {
        const { unavailableScheduledAts } = this.props;

        if (
          !isEmpty(value) &&
          some(value, at => some(unavailableScheduledAts, unavailable => unavailable.isSame(moment(at)), 'minute'))
        ) {
          return 'One or several dates aren`t allowed for the order by Travel Policy';
        }
      }
    },
    recurrenceFactor: {
      presence: { message: 'can`t be empty' },
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    }
  };

  getPresetTypeText() {
    switch (this.get('presetType')) {
      case 'daily'   : return 'day';
      case 'monthly' : return 'month';
      case 'weekly'  : return 'week';
      default        : return '';
    }
  }

  getCurrentTimeWithShift() {
    return moment().add(1, 'hour');
  }

  changeCustom(custom) {
    this.set({
      custom,
      scheduledAts: []
    }, {
      requestVehicles: true,
      requestScheduledAts: !custom,
      dropUnavailableScheduledAts: true
    });
  }

  changeRecurrencyValue(prop, value) {
    this.set(prop, value, { requestScheduledAts: true });
  }

  changeStartingAt(value) {
    const endingAt = this.get('endingAt');

    this.set({
      startingAt: value.tz(moment.tz.guess()),
      endingAt: endingAt && endingAt.clone().tz(moment.tz.guess()).set({ h: value.hour(), m: value.minute() })
    }, {
      requestVehicles: true,
      requestScheduledAts: true,
    });
  }

  changeEndingAt(value) {
    const startingAt = this.get('startingAt');

    this.set('endingAt', value.tz(moment.tz.guess()).set({ h: startingAt.hour(), m: startingAt.minute() }), {
      requestScheduledAts: true,
    });
  }

  changeScheduledAts(nextScheduledAts) {
    const { startingAt, scheduledAts } = this.get();
    const newValues = difference(nextScheduledAts, scheduledAts);

    newValues.forEach(moment => moment.set({ h: startingAt.hour(), m: startingAt.minute() }));
    nextScheduledAts = sortBy(nextScheduledAts, moment => +moment);

    this.set('scheduledAts', nextScheduledAts, {
      requestVehicles: scheduledAts[0] !== nextScheduledAts[0]
    });
  }

  disabledStartingAtDate = (selectingDate) => {
    return selectingDate && this.props.disabledDate(selectingDate) ||
      (this.get('endingAt') && selectingDate.isAfter(this.get('endingAt'), 'day'));
  };

  disabledEndingAtDate = (selectingDate) => {
    return selectingDate && selectingDate.isBefore(this.get('startingAt'), 'day');
  };

  disabledPresetDates() {
    const { startingAt, endingAt } = this.get();

    if (!startingAt || !endingAt) {
      return [0, 1, 2, 3, 4, 5, 6];
    } else {
      return [];
    }
  }

  $render($) {
    const { unavailableScheduledAts } = this.props;
    const { startingAt, endingAt } = this.get();
    const minDate = startingAt;
    if (minDate && minDate.isBefore(moment().startOf('day'))) {
      minDate.add(1, 'day');
    }

    return (
      <div className="mb-10" data-name="recurrenceForm">
        <div className="layout horizontal center-justified">
          <Radio.Group { ...$('custom')(this.changeCustom) } className={ CN('mb-20 layout horizontal w-500', css.radio) }>
            <Radio.Button className="flex text-center text-12 bold-text" value={ false }>Preset Dates/Times</Radio.Button>
            <Radio.Button className="flex text-center text-12 bold-text" value>Custom Dates/Times</Radio.Button>
          </Radio.Group>
        </div>

        { !this.get('custom') &&
          <div>
            <div className="layout horizontal">
              <div className="flex pr-10">
                <div className="flex pr-10 bold-text text-16 light-text mb-10">
                  Set your bookings schedule
                </div>
                <div className="layout horizontal">
                  <div className="flex black-text">
                    <Radio.Group { ...$('presetType')(this.changeRecurrencyValue, 'presetType') } className={ CN('mb-20 layout horizontal', css.radio) }>
                      <Radio.Button className="flex text-center bold-text" value="daily">Daily</Radio.Button>
                      <Radio.Button className="flex text-center bold-text" value="weekly">Weekly</Radio.Button>
                      <Radio.Button className="flex text-center bold-text" value="monthly">Monthly</Radio.Button>
                    </Radio.Group>

                    <div className="layout horizontal justified mb-20 text-12">
                      <div className="layout horizontal ml-15">
                        <span className="bold-text mt-10">Every</span>
                        <Input { ...$('recurrenceFactor')(this.changeRecurrencyValue, 'recurrenceFactor') } className="mr-10 ml-10 w-100" />
                        <span className="bold-text mt-10">{ this.getPresetTypeText() }(s), on</span>
                      </div>
                      { this.get('presetType') === 'daily' &&
                        <Checkbox { ...$('workdaysOnly')(this.changeRecurrencyValue, 'workdaysOnly') } className="bold-text mt-10">Workdays Only</Checkbox>
                      }
                    </div>
                    { this.get('presetType') === 'weekly' &&
                      <CheckboxGroup { ...$('weekdays')(this.changeRecurrencyValue, 'weekdays') } className={ CN('layout horizontal br-2 mb-20', css.weekdays) }>
                        { map(weekdays, ({ value, label }, i) => {
                            return <Checkbox key={ i } value={ value } className="mr-10">{ label }</Checkbox>;
                          })
                        }
                      </CheckboxGroup>
                    }
                    <div className="layout horizontal start mb-20">
                      <div className="bold-text mt-5 w-50 text-12">Starting</div>
                      <DatePicker
                        { ...$('startingAt')(this.changeStartingAt) }
                        allowClear={ false }
                        className={ CN('ml-5 w-130', css.datepicker) }
                        disabledDate={ this.disabledStartingAtDate }
                        error={ '' }
                      />
                      <TimePicker
                        { ...$('startingAt')(this.changeStartingAt) }
                        className="ml-20 wrap"
                        laterThan={ this.getCurrentTimeWithShift() }
                        error={ this.getError('scheduledAt') }
                      />
                    </div>

                    <div className="layout horizontal center mb-20">
                      <div className={ 'bold-text w-50 text-12' }>Ending</div>
                      <DatePicker
                        { ...$('endingAt')(this.changeEndingAt) }
                        allowClear={ false }
                        className={ CN('ml-5 w-130', css.datepicker) }
                        disabledDate={ this.disabledEndingAtDate }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={ css.calendarWrapper }>
                <div className="flex bold-text text-16 light-text mb-10">
                  Exclude following days from orders
                </div>
                <div className="layout horizontal">
                  <div className="flex">
                    <Calendar
                      { ...$('scheduledAts')(this.changeScheduledAts) }
                      height={ 300 }
                      width={ 310 }
                      minDate={ minDate && minDate.toDate() }
                      maxDate={ endingAt && endingAt.toDate() }
                      disabledDays={ this.disabledPresetDates() }
                      disabledDates={ unavailableScheduledAts.map(moment => moment.toDate()) }
                      displayOptions={ { showHeader: false } }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        { this.get('custom') &&
          <div>
            <div className="layout horizontal mb-20">
              <div className="flex pr-10  text-16 light-text">
                Select dates when car is required
              </div>
              <div className="flex pl-10  text-16 light-text">
                Select time when car is required
                { this.getError('scheduledAt') &&
                  <div className="text-12 red-text">{ this.getError('scheduledAt') }</div>
                }
              </div>
            </div>

            <div className="layout horizontal">
              <div className="flex">
                <div className="layout horizontal">
                  <div className="flex">
                    <Calendar
                      { ...$('scheduledAts')(this.changeScheduledAts) }
                      height={ 300 }
                      width={ 310 }
                      minDate={ moment().toDate() }
                      displayOptions={ { showHeader: false } }
                    />
                  </div>
                </div>
              </div>
              <div className="flex pl-10">
                { this.map('scheduledAts', (date, i) => (
                    <div key={ i } className="mb-20 relative">
                      <div className="layout horizontal">
                        <div className="mr-20 white-bg black-text border-block br-4 layout horizontal center-center w-200">
                          { moment(date).format('MMMM Do YYYY') }
                        </div>
                        <TimePicker { ...$(`scheduledAts.${i}`) } laterThan={ this.getCurrentTimeWithShift() } />
                      </div>
                      { some(unavailableScheduledAts, at => at.isSame(moment(date)), 'minute') &&
                        <div className="error">Isn't allowed by Travel Policy</div>
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
