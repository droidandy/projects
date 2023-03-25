import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Divider, SearchList, ListItem } from 'components';

import { countriesList, filterBySearchValue, deviceHeight } from 'utils';

import { ModalWithContent } from '../BookingController/components';

import styles from './style';

const ITEM_HEIGHT = 51;

export default class CountrySelector extends PureComponent {
  constructor(props) {
    super(props);
    this.handlers = {};
    countriesList.forEach((item) => {
      this.handlers[item.value] = () => this.handleItemSelect(item);
    });
  }

  static propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    selected: PropTypes.object
  };

  state = {
    searchValue: ''
  };

  isSearchInputTouched = false;

  setListRef = (el) => { this.list = el; };

  filterItems = () => filterBySearchValue(countriesList, ['label', 'value'], this.state.searchValue);

  handleItemSelect = (item) => {
    this.props.onSelect(item);
    this.handleClose();
  };

  handleSearchValueChange = (searchValue, touched = true) => {
    this.isSearchInputTouched = touched;
    this.setState({ searchValue });

    setTimeout(() => this.list && this.list.scrollToOffset({ offset: 0 }), 0);
  };

  handleLayoutChange = (e) => {
    if (this.isSearchInputTouched) return;
    const { selected } = this.props;

    const items = this.filterItems();
    const wrapperSize = e.nativeEvent.layout.height;
    const selectedIndex = items.findIndex(item => (selected.value === item.value));
    const contentSize = (items.length * ITEM_HEIGHT) + 30; // 30 - bottom space
    const offset = contentSize - wrapperSize;
    const scrollValue = selectedIndex * ITEM_HEIGHT;
    this.list.scrollToOffset({ offset: scrollValue > offset ? offset : scrollValue });
  };

  handleClose = () => {
    this.props.onClose();
    setTimeout(() => this.handleSearchValueChange('', false), 300);
  };

  keyExtractor = item => String(item.id || item.value);

  renderItem = ({ item }) => {
    const { selected } = this.props;

    const isSelected = selected.value === item.value;

    return (
      <ListItem
        style={{ height: ITEM_HEIGHT }}
        title={item.label}
        isSelected={isSelected}
        onPress={this.handlers[item.value]}
        titleNumberOfLines={1}
      />
    );
  };

  renderDivider = () => <Divider />;

  renderList = () => {
    const { searchValue } = this.state;
    const { selected } = this.props;

    const items = this.filterItems();

    const selectedIndex = items.findIndex(item => (selected.value === item.value));
    const wrapperSize = deviceHeight - 109; // 109 - modal header + search bar
    const visibleItemsCount = Math.ceil(wrapperSize / ITEM_HEIGHT);
    const maxScrollIndex = items.length - visibleItemsCount;

    return (
      <SearchList
        listViewRef={this.setListRef}
        changeableList={false}
        itemHeight={ITEM_HEIGHT}
        type="inline"
        keyboardShouldPersistTaps="handled"
        searchValue={searchValue}
        onSearchValueChange={this.handleSearchValueChange}
        data={items}
        ItemSeparatorComponent={this.renderDivider}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        initialNumToRender={visibleItemsCount + 1}
        initialScrollIndex={!this.isSearchInputTouched && Math.min(maxScrollIndex, selectedIndex)}
        contentContainerStyle={styles.countryList}
        onLayout={this.handleLayoutChange}
      />
    );
  };

  render() {
    return (
      <ModalWithContent
        contentComponent={this.renderList()}
        isVisible={this.props.isVisible}
        onClose={this.handleClose}
      />
    );
  }
}
