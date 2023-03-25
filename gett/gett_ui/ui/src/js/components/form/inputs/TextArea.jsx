import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import CN from 'classnames';

const { TextArea: AntTextArea } = Input;

export default class TextArea extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    label: PropTypes.node,
    labelClassName: PropTypes.string,
    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  onChange = (e) => {
    const maxLength = +this.props.maxLength;
    const value = e.target.value;

    return this.props.onChange(maxLength ? value.substring(0, maxLength) : value, e);
  };

  render() {
    const { error, label, labelClassName, maxLength, className, inputClassName, value, ...rest } = this.props;
    const inputValue = value === null ? '' : value;

    return (
      <div className={ CN('relative', className) }>
        { (label || maxLength) &&
          <label className={ CN('dark-grey-text layout horizontal start', labelClassName) }>
            <p className="flex mb-0">
              { label }
            </p>
            <p className="mb-0">
              { maxLength ? `${value && value.length || 0}/${maxLength}` : '' }
            </p>
          </label>
        }
        <div className="relative">
          <AntTextArea
            className={ CN(inputClassName) }
            { ...rest }
            value={ inputValue }
            onChange={ this.onChange }
            data-name={ rest.name }
          />
          { error &&
            <div className="error">{ error }</div>
          }
        </div>
      </div>
    );
  }
}
