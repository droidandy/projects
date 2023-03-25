import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ListView, KeyboardAvoidingWrapper } from 'components';
import inline from 'components/SearchBar/InlineBar';
import rounded from 'components/SearchBar/RoundedBar';

import { withTheme } from 'theme';
import { strings } from 'locales';
import { containers } from 'testIDs';

import styles from './styles';

const IDs = containers.SearchModal;

class SearchList extends Component {
  static propTypes = {
    data: PropTypes.array,
    defaultType: PropTypes.string,
    onSearchValueChange: PropTypes.func,
    placeholder: PropTypes.string,
    searchValue: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    type: PropTypes.oneOf(['inline', 'rounded'])
  };

  static defaultProps = {
    defaultType: 'rounded'
  };

  renderSearchBar = () => {
    const { type, defaultType, searchValue, onSearchValueChange, placeholder } = this.props;
    const searchType = type || defaultType;
    const renderAs = { inline, rounded };
    const SearchBar = renderAs[searchType];

    return (
      <SearchBar
        onChangeText={onSearchValueChange}
        value={searchValue}
        placeholder={placeholder || strings('app.label.startTyping')}
        testID={IDs.input}
      />
    );
  };

  render() {
    const { data, style, ...rest } = this.props;

    return (
      <KeyboardAvoidingWrapper
        style={styles.flex}
        keyboardVerticalOffset={20}
      >
        {this.renderSearchBar()}
        <ListView
          style={[styles.listView, style]}
          disableAvoiding
          typeSections={false}
          items={data}
          testID={IDs.list}
          {...rest}
        />
      </KeyboardAvoidingWrapper>
    );
  }
}

export default withTheme(SearchList);
