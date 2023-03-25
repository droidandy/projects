/**
 *
 * ToggleButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

class ToggleButton extends React.PureComponent {
  static propTypes = {
    leftValue: PropTypes.string,
    rightValue: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    wide: PropTypes.bool,
    showCheck: PropTypes.bool,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const tabText = (props.checked) ? props.leftValue : props.rightValue;

    this.state = {
      speed: 200,
      tabText: tabText || '',
    };

    this.changeState = this.changeState.bind(this);
  }

  changeState() {
    const checked = !this.props.checked;
    const tabText = (checked) ? this.props.leftValue : this.props.rightValue;
    this.props.onChange(checked);

    setTimeout(() => {
      this.setState({ tabText: tabText || '' });
    }, this.state.speed / 2);
  }

  render() {
    const { leftValue, rightValue, checked, wide, showCheck } = this.props;
    const { speed, tabText } = this.state;

    return (
      <div className={`toggle-button ${wide ? 'wide' : ''}`} onClick={this.changeState}>
        <span className="toggle-button-left">{leftValue}</span>
        <span style={{ transition: `${speed}ms` }} className={`toggle-button-tap ${checked ? 'left' : 'right'}`}>{tabText}</span>
        <span className={`toggle-button-right ${showCheck ? 'check' : ''}`}>{rightValue}</span>
      </div>
    );
  }
}

export default ToggleButton;
