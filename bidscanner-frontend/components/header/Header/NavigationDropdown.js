import React, { Component } from 'react';
import styled from 'styled-components';

import Popover from 'material-ui/Popover';

import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';

import { Link } from 'next-url-prettifier';
import StyledLink from 'components/styled/StyledLink';

const Button = styled.button`
  border: none;
  border-radius: 2px;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  &:active,
  &:focus {
    outline: none;
  }

  margin-right: 5px;
  height: 26px;
`;

const Option = styled.div`
  padding: 5px 15px;
  cursor: pointer;
  font-size: 15px;
  &:hover {
    background-color: #e5e5e5;
  }
  display: ${props => (props.showServices ? 'flex' : 'block')};
  align-items: center;
`;

const Options = styled.div`
  padding: 10px 0px;
  line-height: 90%;
`;

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
    const { title, links = [], showServices } = this.props;
    return (
      <div>
        <Button onClick={this.handleTouchTap}>
          {title}
          <ArrowDropDown style={{ color: 'white', width: '17px', height: '17px' }} />
        </Button>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
          style={{ borderRadius: '15px', marginTop: '8px' }}
        >
          <Options>
            {links.map(({ name, imgSrc, path, as }) => {
              const Icon = imgSrc;
              return (
                <Option key={path} showServices={showServices}>
                  {showServices && <Icon />}
                  <StyledLink>
                    <Link href={path} as={as}>
                      <a>{name}</a>
                    </Link>
                  </StyledLink>
                </Option>
              );
            })}
          </Options>
        </Popover>
      </div>
    );
  }
}
