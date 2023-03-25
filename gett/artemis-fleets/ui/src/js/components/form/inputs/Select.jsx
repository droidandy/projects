import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select as AntSelect, Spin } from 'antd';
import castArray from 'lodash/castArray';
import noop from 'lodash/noop';

export default class Select extends PureComponent {
  static Option = AntSelect.Option;
  static caseInsensitiveFilter = (val, opt) => opt.props.children.toLowerCase().includes(val.toLowerCase());

  static propTypes = {
    error: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    mode: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array
    ]),
    onChange: PropTypes.func,
    loading: PropTypes.bool
  };

  onChange = (value) => {
    this.props.onChange(value === undefined ? '' : value);
  };

  render() {
    const { value, mode, error, className, label, labelClassName, loading, ...rest } = this.props;
    let inputValue = value;

    if (value && mode === 'multiple') {
      inputValue = castArray(value).map(val => val.toString());
    } else if (value !== undefined && value !== null) {
      inputValue = value.toString();
    }

    rest.onChange = this.onChange;
    if (mode === 'combobox') {
      rest.onSearch = rest.onChange;
      rest.onChange = noop;
    }

    const select = <AntSelect value={ inputValue } mode={ mode } className="block" { ...rest } />;

    return (
      <div className={ className }>
        { label &&
          <label className={ labelClassName }>{ label }</label>
        }
        { loading === undefined
          ? select
          : <Spin spinning={ loading }>{ select }</Spin>
        }
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
