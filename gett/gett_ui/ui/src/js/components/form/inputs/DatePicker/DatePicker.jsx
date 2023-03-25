import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker as AntPicker } from 'antd';
import { Icon } from 'components';
import CN from 'classnames';

export default class DatePicker extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    error: PropTypes.string,
    containerId: PropTypes.string,
    disabled: PropTypes.bool,
    dataName: PropTypes.string
  };

  static defaultProps = {
    dataName: 'datePicker',
    containerId: 'datePickerContainer'
  };

  getCalendarContainer = () => {
    return document.querySelector(`#${this.props.containerId}`);
  };

  renderSuffixIcon = () => <Icon className="datepicker-icon" icon="Calendar" />;

  render() {
    const { className, error, containerId, disabled, dataName, ...rest } = this.props;

    return (
      <div className={ CN(className, 'relative', { 'not-allowed': disabled }) } id={ containerId } data-name={ dataName }>
        <AntPicker
          format="DD/MM/YYYY"
          getCalendarContainer={ this.getCalendarContainer }
          disabled={ disabled }
          suffixIcon={ this.renderSuffixIcon() }
          { ...rest }
        />
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
