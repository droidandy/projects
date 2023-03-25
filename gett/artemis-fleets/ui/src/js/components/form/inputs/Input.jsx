import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input as AntInput } from 'antd';
import CN from 'classnames';

export default class Input extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string
  };

  handleChange = (e) => {
    return this.props.onChange(e.target.value, e);
  };

  render() {
    const { error, label, labelClassName, className, ...rest } = this.props;

    return (
      <div className={ CN('relative', className) }>
        { label &&
          <label className={ labelClassName }>{ label }</label>
        }
        <AntInput { ...rest } onChange={ this.handleChange } />
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
