import React, { Component } from 'react';
import styled from 'styled-components';

import Popover from 'material-ui/Popover';

import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';

const Button = styled.button`
  padding: 0px 0px;
  border: none;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 3px;
  &:active,
  &:focus {
    outline: none;
  }
`;

const Option = styled.div`
  padding: 5px 15px;
  cursor: pointer;
  font-size: 15px;
  &:hover {
    background-color: #e5e5e5;
  }
`;

const Options = styled.div`padding: 5px 0px;`;

export default class StandartFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
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

  handleOptionClick = option => {
    const { input: { onChange } } = this.props;
    onChange(option);
    this.handleRequestClose();
  };

  handleClearClick = e => {
    e.stopPropagation();
    const { input: { onChange } } = this.props;
    onChange('');
    this.setState({
      open: false,
    });
  };

  render() {
    const { input: { value }, options = [] } = this.props;
    return (
      <div>
        <Button onClick={this.handleTouchTap}>
          {value}
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
            {options.map(option =>
              <Option key={option} primaryText={option} onClick={() => this.handleOptionClick(option)}>
                {option}
              </Option>
            )}
          </Options>
        </Popover>
      </div>
    );
  }
}
