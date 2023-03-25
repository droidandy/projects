import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Search, Close, PersonAdd } from '@material-ui/icons';

export default class SearchBar extends Component {
  static propTypes = {
    value: PropTypes.string,
    onClear: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: '',
    onClear: () => {},
    onChange: () => {},
  };

  handleClear = () => {
    const { onClear } = this.props;
    onClear();
  };

  handleChange = (event) => {
    const { onChange } = this.props;
    const value = event?.target?.value;
    onChange(value);
  };

  handleKeyUp = (event) => {
    if (event?.key === 'Escape') {
      this.handleClear();
    }
  };

  handleAddContact = () => {};

  render() {
    const { value } = this.props;

    return (
      <div className="search">
        <input
          className="searchInput"
          type="text"
          value={value}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          placeholder="Search"
        />
        {value?.length > 0
          ? <Close className="icon clear" onClick={this.handleClear} />
          : <Search className="icon loupe" />}
        <PersonAdd className="icon addContact inactive" onClick={this.handleAddContact} />
      </div>
    );
  }
}
