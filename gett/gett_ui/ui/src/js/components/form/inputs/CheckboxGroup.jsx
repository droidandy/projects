import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class CheckboxGroup extends PureComponent {
  static propTypes = {
    value: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    onChange: PropTypes.func,
    error: PropTypes.string,
    className: PropTypes.string,
    checkboxClassName: PropTypes.string,
    children: PropTypes.node,
    name: PropTypes.string
  };

  handleChange = (checked, e) => {
    const { value = [], onChange } = this.props;
    const inputValue = e.target.name;

    return onChange(checked ? [...value, inputValue] : value.filter(v => v !== inputValue), e);
  };

  render() {
    const {
      value = [],
      onChange, // eslint-disable-line no-unused-vars
      error,
      className,
      checkboxClassName,
      children,
      ...rest
    } = this.props;

    // NOTE: due to https://github.com/gaearon/react-hot-loader/issues/304 `CheckboxGroup` works
    // properly only if Checkbox and VehicleCheckbox components were used as children.
    return (
      <div className={ className } data-name={ rest.name }>
        { Children.map(children, element => (
            React.cloneElement(element, {
              ...rest,
              className: element.props.className || checkboxClassName,
              value: value.includes(element.props.value),
              name: element.props.value,
              onChange: this.handleChange
            })
          ))
        }
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}
