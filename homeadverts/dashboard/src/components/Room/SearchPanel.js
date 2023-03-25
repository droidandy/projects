import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from 'components';

export default class SearchPanel extends Component {
  static propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    onChangeSearch: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { value, isDesktop, onChangeSearch, onClearSearch } = this.props;

    return (
      <header className={`searchBar ${!isDesktop && 'tablet'}`}>
        <SearchBar
          value={value}
          onChange={onChangeSearch}
          onClear={onClearSearch}
        />
      </header>
    );
  }
}
