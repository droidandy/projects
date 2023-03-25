import React, { Component } from 'react';
import styled from 'styled-components';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';

const Container = styled.div`
  position: relative;
  z-index: 9;
`;

const Button = styled.button`
  padding: 0px 0px;
  border: none;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 15px;

  &:active,
  &:focus {
    outline: none;
  }
`;

const Options = styled.div`max-height: 40vh;`;

export default class SelectField extends Component {
  state = {
    open: false,
  };

  getDisplayValue() {
    const { value, children } = this.props;
    let displayValue = value;

    if (value) {
      React.Children.forEach(children, child => {
        if (child && value === child.props.value) {
          displayValue = child.props.label || child.props.primaryText;
        }
      });
    }

    return displayValue;
  }

  handleTouchTap = event => {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleChange = (event, value) => {
    const { onChange } = this.props;

    if (onChange) onChange(value);
    this.handleRequestClose();
  };

  render() {
    const {
      value,
      onChange, // eslint-disable-line no-unused-vars
      placeholder,
      children,
      className,
    } = this.props;

    return (
      <Container className={className}>
        <Button onClick={this.handleTouchTap}>
          {this.getDisplayValue() || placeholder}
          <ArrowDropDown />
        </Button>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Options>
            <Menu value={value} onChange={this.handleChange}>
              {children}
            </Menu>
          </Options>
        </Popover>
      </Container>
    );
  }
}
