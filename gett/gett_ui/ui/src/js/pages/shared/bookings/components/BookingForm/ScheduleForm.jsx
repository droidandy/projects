import React from 'react';
import PropTypes from 'prop-types';
import { Desktop } from 'components';
import Form, { Radio, Select, DatePicker, TimePicker } from 'components/form';
import RecurrenceForm from './RecurrenceForm';
import { times } from 'lodash';
import moment from 'moment';
import CN from 'classnames';

import css from 'pages/shared/bookings/style.css';

const { Option } = Select;

export default class ScheduleForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    disabled: PropTypes.bool,
    currentTz: PropTypes.string,
    scheduledType: PropTypes.string,
    earliestAvailableTime: PropTypes.object,
    unavailableScheduledAts: PropTypes.arrayOf(PropTypes.object),
    can: PropTypes.shape({
      changeVehicleCount: PropTypes.bool
    })
  };

  validations = {
    scheduledAt: function(value) {
      if (this.get('scheduledType') !== 'later' || !value) return null;

      if (value.isBefore(moment())) {
        return 'should be later than current time';
      }
    }
  };

  setReccurenceFormRef = form => this.recurrenceForm = form;

  validate(validator) {
    validator('scheduledAt');

    if (this.get('scheduledType') === 'recurring') {
      validator.nested('recurrenceForm');
    }

    return validator.errors;
  }

  componentDidUpdate(prevProps) {
    const scheduledTypePrev = prevProps.attrs.scheduledType;
    const { attrs: { scheduledType, id, scheduledAt }, earliestAvailableTime } = this.props;
    const scheduledInFuture = ['later', 'recurring'].includes(scheduledType);

    if (scheduledType !== scheduledTypePrev && !id) {
      this.changeScheduledType(scheduledType);
    }

    if (scheduledInFuture && (scheduledAt && scheduledAt.diff(earliestAvailableTime, 'minutes') < 0)) {
      this.set({
        scheduledAt: earliestAvailableTime
      });
    }
  }

  changeRecurrenceForm = (scheduleAttrs, meta) => {
    this.set({
      scheduledAt: scheduleAttrs.custom ? scheduleAttrs.scheduledAts[0] : scheduleAttrs.startingAt,
      schedule: scheduleAttrs
    }, meta);
  };

  changeScheduledType(scheduledType) {
    let scheduledAt;

    if (scheduledType === 'now') {
      scheduledAt = null;
    } else if (scheduledType === 'later') {
      scheduledAt = this.props.earliestAvailableTime;
    } else {
      scheduledAt = this.props.earliestAvailableTime.tz(moment.tz.guess());
    }

    this.set({
      scheduledAt,
      scheduledType,
      vehicleCount: scheduledType === 'now' ? null : '1',
      'schedule.startingAt': scheduledAt
    }, {
      requestVehicles: true
    });
  }

  changeScheduledAt(scheduledAt) {
    this.set('scheduledAt', scheduledAt, { requestVehicles: true });
  }

  disabledScheduledAt = (selectingDate) => {
    return selectingDate && selectingDate.isBefore(moment());
  };

  $render($) {
    const { disabled, currentTz, earliestAvailableTime, unavailableScheduledAts, can } = this.props;

    return (
      <div>
        <Radio.Group
          { ...$('scheduledType')(this.changeScheduledType) }
          className={ CN('layout horizontal', css.radio, css.scheduleRadioTabs) }
          disabled={ disabled }
        >
          <Radio.Button
            className="bold-text text-12 flex text-center"
            value="now"
            disabled={ !this.isNew }
            data-name="scheduleForNow"
          >
            On-Demand
          </Radio.Button>

          <Radio.Button
            className="bold-text text-12 flex text-center"
            value="later"
            disabled={ !this.isNew }
            data-name="scheduleForLater"
          >
            Pre-Book
          </Radio.Button>

          <Desktop>
            <Radio.Button
              className="bold-text text-12 flex text-center"
              value="recurring"
              disabled={ !this.isNew && this.get('scheduledType') !== 'now' }
              data-name="scheduleRecurring"
            >
              Recurring
            </Radio.Button>
          </Desktop>
        </Radio.Group>

        { currentTz !== moment.defaultZone.name &&
          <p className="text-center bold-text mb-10">Actual country time: { moment.tz(currentTz).format('H:mm') }</p>
        }

        { this.get('scheduledType') === 'later' &&
          <div className="relative layout horizontal start end-justified wrap">
            { can.changeVehicleCount &&
              <div className="layout horizontal center sm-full-width mb-20 mr-20 sm-mr-0">
                <div className="mr-10">Number of required taxi:</div>
                <Select { ...$('vehicleCount') } className={ `flex auto ${css.width60}` }>
                  { times(10, i => <Option key={ i + 1 }>{ i + 1 }</Option>)}
                </Select>
              </div>
            }
            <div className="layout horizontal center sm-full-width">
              <DatePicker
                { ...$('scheduledAt')(this.changeScheduledAt) }
                className="sm-flex mb-20"
                allowClear={ false }
                disabledDate={ this.disabledScheduledAt }
                error={ '' }
              />
              <TimePicker
                { ...$('scheduledAt')(this.changeScheduledAt) }
                className={ CN('ml-20 sm-ml-10 mb-20 wrap', css.scheduleTimePicker) }
                inputClassName={ css.width190 }
                laterThan={ earliestAvailableTime }
              />
            </div>
          </div>
        }

        <Desktop>
          { this.get('scheduledType') === 'recurring' &&
            <div className="mb-10">
              <RecurrenceForm
                ref={ this.setReccurenceFormRef }
                attrs={ this.get('schedule') }
                onChange={ this.changeRecurrenceForm }
                disabledDate={ this.disabledScheduledAt }
                unavailableScheduledAts={ unavailableScheduledAts }
              />
            </div>
          }
        </Desktop>
      </div>
    );
  }
}
