import React from 'react';
import classNames from 'classnames';
import { Button } from 'reactstrap';

// defaultValue, disabled, name, options, value, onChange
class MultipleButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    let value;
    if ('value' in props) {
      value = props.value;
    } else if ('defaultValue' in props) {
      value = props.defaultValue;
    }
    this.state = {
      value,
    };
  }

  onBtnClick = value => {
    const values = this.getValues(value);
    if (!('value' in this.props)) {
      this.setState({
        value: values,
      });
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(values);
    }
  };

  getValues = value => {
    const values = Array.from(
      'value' in this.props ? this.props.value || [] : this.state.value || []
    );
    const checked = values.includes(value);
    if (checked) {
      return values.filter(v => v !== value);
    }
    return values.concat(value);
  };

  render() {
    let { children, options, disabled, className, classNameItem, style } = this.props;
    let value = 'value' in this.props ? this.props.value : this.state.value;
    value = Array.from(value || []);

    if (options && options.length > 0) {
      children = options.map((option, i) => {
        const checked =
          typeof option === 'string'
            ? (value || []).includes(option)
            : (value || []).includes(option.value);

        return (
          <div
            className={classNames('button-group-item', classNameItem, {
              checked,
            })}
            key={i}
          >
            {typeof option === 'string' ? (
              <Button
                className="shadow-none mr-1"
                disabled={disabled}
                onClick={() => this.onBtnClick(option)}
                color="primary"
                outline
                active={checked}
              >
                {option}
              </Button>
            ) : (
              <Button
                className="shadow-none mr-1"
                disabled={option.disabled || disabled}
                onClick={() => this.onBtnClick(option.value)}
                color="primary"
                outline
                active={checked}
              >
                {option.label}
              </Button>
            )}
          </div>
        );
      });
    }

    return (
      <div className={classNames('prism-button-group flex-wrap d-flex', className)} style={style}>
        {children}
      </div>
    );
  }
}

export default MultipleButtonGroup;
