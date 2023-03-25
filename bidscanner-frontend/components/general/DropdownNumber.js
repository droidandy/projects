// @flow
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'components/styled/Dropdown';

type DropdownValue = number;

// TODO: try generic
type DropdownProps = {
  values: DropdownValue[],
  currentValue: DropdownValue,
  toggle: DropdownValue => void
};

export default class extends Component {
  constructor(props: DropdownProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  state: {
    isOpen: boolean
  };
  props: DropdownProps;
  render() {
    const { values, currentValue, toggle } = this.props;
    return (
      <Dropdown isOpen={this.state.isOpen} toggle={() => this.setState({ isOpen: !this.state.isOpen })}>
        <DropdownToggle caret>
          {currentValue}
        </DropdownToggle>
        <DropdownMenu>
          {values.map(value => (
            <DropdownItem
              key={value}
              onClick={() => {
                toggle(value);
              }}
            >
              {value}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}
