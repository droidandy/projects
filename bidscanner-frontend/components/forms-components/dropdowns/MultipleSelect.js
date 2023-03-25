import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Popover from 'material-ui/Popover';

import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import Close from 'material-ui/svg-icons/navigation/close';

const Button = styled.button`
  padding: 0px 0px 6px 0px;
  border: none;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  margin-bottom: -6px;
  &:active,
  &:focus {
    outline: none;
  }
`;

const Clear = styled.span`cursor: pointer;`;

const Option = styled.div`
  padding: 5px 15px;
  cursor: pointer;
  font-size: 15px;
  background-color: ${props => props.chosen && '#8C8A8A'};
  &:hover {
    background-color: ${props => (props.chosen ? '#8C8A8A' : '#e5e5e5')};
  }
`;

const Options = styled.div`
  padding: 5px 0px;
  max-height: 40vh;
`;

const Chosen = styled(Box)`
  background-color: #e5e5e5;
  border-radius: 20px;
  padding: 0px 10px;
  margin-left: 5px;
`;

export default class MultipleSelect extends Component {
  constructor(props) {
    super(props);

    const { options } = props;

    this.state = {
      open: false,
      options: options.map((option, index) => ({ value: option, id: index })),
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const { input: { onChange } } = this.props;

    onChange(nextState.options.filter(v => v.chosen).map(v => v.value));
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

  addOption = opt => {
    const { options } = this.state;
    const newOptions = options.map(option => {
      if (option.value === opt.value) {
        return {
          ...option,
          chosen: true,
        };
      }
      return option;
    });
    this.setState({ options: newOptions });
  };

  removeOption = opt => {
    const { options } = this.state;
    const newOptions = options.map(option => {
      if (option.value === opt.value) {
        return {
          id: option.id,
          value: option.value,
        };
      }
      return option;
    });
    this.setState({ options: newOptions });
  };

  render() {
    const { title } = this.props;
    const { options } = this.state;
    const chosen = options.filter(v => v.chosen);
    return (
      <Flex wrap align="center">
        <Button onClick={this.handleTouchTap}>
          {title}
          <ArrowDropDown />
        </Button>
        <Flex>
          {chosen.length !== 0 &&
            chosen.map(v => (
              <Chosen key={v.value}>
                {v.value}
                <Clear onClick={() => this.removeOption(v)}>
                  <Close
                    style={{
                      color: 'grey',
                      width: '14px',
                      height: '16px',
                      marginLeft: '5px',
                      marginBottom: '-3px',
                    }}
                  />
                </Clear>
              </Chosen>
            ))}
        </Flex>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Options>
            {options.map((option, index) => (
              <Option
                key={index}
                primaryText={option}
                chosen={option.chosen}
                onClick={option.chosen ? () => this.removeOption(option) : () => this.addOption(option)}
              >
                {option.value}
              </Option>
            ))}
          </Options>
        </Popover>
      </Flex>
    );
  }
}
