import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

class InputFieldTyped extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    textType: PropTypes.string,
    maxLength: PropTypes.string,
    pnnId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  constructor(props) {
    super(props);
    this.state = {
      changed: false,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount() {
    const { textType, value } = this.props;
    let valueToShow = value || '';
    if (!this.state.changed) {
      if (textType === 'DOLLAR' && !valueToShow.startsWith('$')) {
        valueToShow = `$${valueToShow}`;
        this.handleOnChange({ target: { value: null } }, { value: valueToShow });
      } else if (textType === 'PERCENT' && !valueToShow.endsWith('%')) {
        valueToShow = `${valueToShow}%`;
        this.handleOnChange({ target: { value: null } }, { value: valueToShow });
      }
    }
  }

  componentWillReceiveProps(props) {
    // when the selected plan is changed, re-type value
    if (props.pnnId !== this.props.pnnId || !this.state.changed) {
      let valueToShow = props.value || '';
      if (props.textType === 'DOLLAR' && !valueToShow.startsWith('$')) {
        valueToShow = `$${valueToShow}`;
      } else if (props.textType === 'PERCENT' && !valueToShow.endsWith('%')) {
        valueToShow = `${valueToShow}%`;
      }
      this.handleOnChange({ target: { value: null } }, { value: valueToShow });
    }
  }

  handleOnChange(e, inputState) {
    const { onChange } = this.props;
    this.setState({ changed: true });
    onChange(e, inputState);
  }

  render() {
    const {
      type,
      placeholder,
      value,
      maxLength,
    } = this.props;
    const valueToShow = value || '';
    return (
      <Input
        maxLength={maxLength}
        type={type}
        placeholder={placeholder}
        value={valueToShow}
        onChange={this.handleOnChange}
      />
    );
  }
}

export default InputFieldTyped;
