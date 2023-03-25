import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker as AntPicker } from 'antd';

export default class DatePicker extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    error: PropTypes.string,
  };

  render() {
    const { className, error, ...rest } = this.props;

    return (
      <div className={ className }>
        <AntPicker format="DD/MM/YYYY" { ...rest } />
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
