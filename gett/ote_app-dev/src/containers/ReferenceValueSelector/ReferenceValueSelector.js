import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SearchList, Divider, ListItem } from 'components';
import { debounce } from 'lodash';
import { bookings } from 'api';

export default class ReferenceValueSelector extends PureComponent {
  static propTypes = {
    changeReference: PropTypes.func,
    onClose: PropTypes.func,
    reference: PropTypes.object
  };

  state = {
    loading: false,
    searchValue: '',
    items: []
  };

  componentDidMount() {
    this.getReferenceEntries();
  }

  getReferenceEntries = debounce(() => {
    const id = this.props.reference.id;
    this.setState({ loading: true });

    return bookings.searchBookingReferences(id, this.state.searchValue)
      .then(({ data }) => { this.setState({ items: data.items, loading: false }); })
      .catch(() => { this.setState({ loading: false }); });
  }, 300);

  handleSearchValueChange = (searchValue) => {
    this.setState({ searchValue }, this.getReferenceEntries);
  };

  getListData() {
    const { items, searchValue } = this.state;
    return searchValue.length ? [{ value: searchValue }, ...items] : items;
  }

  keyExtractor = item => String(item.id || item.value);

  renderItem = ({ item }) => {
    const { reference, changeReference, onClose } = this.props;

    const isSelected = reference.value === item.value;
    const handlerValueSelect = () => {
      onClose();
      setTimeout(() => {
        changeReference({ ...reference, value: item.value });
      }, 350); // for smooth animation
    };
    return (<ListItem title={item.value} isSelected={isSelected} onPress={handlerValueSelect} />);
  };

  renderSeparator = () => <Divider />;

  render() {
    const { searchValue, loading } = this.state;
    return (
      <SearchList
        type="inline"
        loading={loading}
        keyboardShouldPersistTaps="handled"
        searchValue={searchValue}
        onSearchValueChange={this.handleSearchValueChange}
        data={this.getListData()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}
