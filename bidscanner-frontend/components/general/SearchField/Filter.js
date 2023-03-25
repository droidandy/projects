// @flow
import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import type { GeneralFilter } from 'context/types';

const filterTypes: GeneralFilter[] = ['Products', 'Requests', 'Suppliers'];

export default class extends Component {
  constructor(props) {
    super(props);

    const initialFilter = props && props.input && props.input.value;
    const index = filterTypes.findIndex(filter => filter === initialFilter);

    if (index === -1) {
      this.state = {
        value: 0,
      };
    } else {
      this.state = {
        value: index,
      };
    }
  }

  state: {
    value: number,
  };

  handleChange = (event, index, value) => {
    const { input: { onChange } } = this.props;
    onChange(filterTypes[value]);
    this.setState({ value });
  };

  render() {
    return (
      <DropDownMenu
        value={this.state.value}
        onChange={this.handleChange}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        selectedMenuItemStyle={{ color: '#FF2929' }}
      >
        {filterTypes.map((value, index) => <MenuItem key={value} value={index} primaryText={value} />)}
      </DropDownMenu>
    );
  }
}
