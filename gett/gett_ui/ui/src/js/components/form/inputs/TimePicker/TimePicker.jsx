import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { range, padStart } from 'lodash';
import moment from 'moment';
import CN from 'classnames';

import css from './TimePicker.css';

const hours = range(24);
const minutes = range(0, 60, 1);

const { Option } = Select;

export default class TimePicker extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    error: PropTypes.string,
    onChange: PropTypes.func,
    mode: PropTypes.oneOf(['string', 'moment']),
    className: PropTypes.string,
    hourClassName: PropTypes.string,
    minuteClassName: PropTypes.string,
    disabled: PropTypes.bool,
    laterThan: PropTypes.object,
    containerId: PropTypes.string,
    name: PropTypes.string
  };

  static defaultProps = {
    className: '',
    mode: 'moment',
    containerId: 'timePickerContainer'
  };

  changeHour = (hour) => {
    const { laterThan, onChange } = this.props;

    if (this.isStringMode) {
      return onChange(`${padStart(hour, 2, '0')}:${this.getMinute() || '00'}`);
    }

    let nextVal = this.getValue().hour(hour);

    if (laterThan && nextVal.isBefore(laterThan)) {
      nextVal = laterThan.clone().tz(nextVal.tz());
    }

    onChange(nextVal);
  };

  changeMinute = (minute) => {
    const { onChange } = this.props;

    if (this.isStringMode) {
      return onChange(`${this.getHour() || '00'}:${padStart(minute, 2, '0')}`);
    }

    onChange(this.getValue().startOf('minute').minute(minute));
  };

  get isStringMode() {
    return this.props.mode === 'string';
  }

  getValue() {
    if (this.isStringMode) {
      return this.props.value || '';
    }

    return moment(this.props.value);
  }

  getHour() {
    if (this.isStringMode) {
      return this.getValue().split(':')[0];
    }

    return this.getValue().hour().toString();
  }

  getMinute() {
    if (this.isStringMode) {
      return this.getValue().split(':')[1];
    }

    return this.getValue().minute().toString();
  }

  isHourDisabled(hour) {
    const { laterThan } = this.props;

    if (!laterThan) return false;

    const value = this.getValue();
    const tz = value.tz();

    return value.isBefore(laterThan, 'day') ||
      (value.isSame(laterThan, 'day') && hour < laterThan.clone().tz(tz).hour());
  }

  isMinuteDisabled(minute) {
    const { laterThan } = this.props;
    if (!laterThan) return false;

    const value = this.getValue();

    return value.isBefore(laterThan, 'hour') || (value.isSame(laterThan, 'hour') && minute < laterThan.minute());
  }

  getPopupContainer = () => document.querySelector(`#${this.props.containerId}`);

  render() {
    const { error, className, hourClassName, minuteClassName, disabled, containerId, name } = this.props;

    return (
      <div className={ `${className} layout horizontal center` } data-name={ name } id={ containerId }>
        <Select className={ CN(css.timePicker, hourClassName) } onChange={ this.changeHour } value={ this.getHour() } disabled={ disabled } getPopupContainer={ this.getPopupContainer }>
          { hours.map(hour => <Option key={ hour } disabled={ this.isHourDisabled(hour) }>{ padStart(hour, 2, '0') }</Option>) }
        </Select>
        <span className="mr-5 ml-5">:</span>
        <Select className={ CN(css.timePicker, minuteClassName) } onChange={ this.changeMinute } value={ this.getMinute() } disabled={ disabled } getPopupContainer={ this.getPopupContainer }>
          { minutes.map(min => <Option key={ min } disabled={ this.isMinuteDisabled(min) }>{ padStart(min, 2, '0') }</Option>) }
        </Select>
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
