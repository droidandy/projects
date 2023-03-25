import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimePicker as AntPicker } from 'antd';

export default class MomentPicker extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    error: PropTypes.string,
  };

  render() {
    const { className, inputClassName, error, ...rest } = this.props;

    return (
      <div className={ className }>
        <AntPicker className={ inputClassName } { ...rest } />
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
