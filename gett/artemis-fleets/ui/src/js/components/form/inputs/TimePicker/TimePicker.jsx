import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import range from 'lodash/range';
import padStart from 'lodash/padStart';
import moment from 'moment';
import CN from 'classnames';

import css from './TimePicker.css';

const hours = range(24);
const minutes = range(60);
const { Option } = Select;

export default class TimePicker extends PureComponent {
  static propTypes = {
    value: PropTypes.object,
    error: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    hourClassName: PropTypes.string,
    minuteClassName: PropTypes.string,
    disabled: PropTypes.bool
  };

  changeHour = (hour) => {
    this.props.onChange(this.getValue().hour(hour));
  };

  changeMinute = (minute) => {
    this.props.onChange(this.getValue().minute(minute));
  };

  getValue() {
    return moment(this.props.value);
  }

  render() {
    const { error, className, hourClassName, minuteClassName, disabled } = this.props;
    const value = this.getValue();

    return (
      <div className={ className }>
        <Select className={ CN(css.w60, hourClassName) } onChange={ this.changeHour } value={ value.hour().toString() } disabled={ disabled }>
          { hours.map(hour => <Option key={ hour }>{ padStart(hour, 2, '0') }</Option>) }
        </Select>
        <span className="mr-5 ml-5">:</span>
        <Select className={ CN(css.w60, minuteClassName) } onChange={ this.changeMinute } value={ value.minute().toString() } disabled={ disabled }>
          { minutes.map(min => <Option key={ min }>{ padStart(min, 2, '0') }</Option>) }
        </Select>
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
