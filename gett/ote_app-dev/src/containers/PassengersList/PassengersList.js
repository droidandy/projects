import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SearchList, Divider, ListItem } from 'components';

import { savePassenger } from 'actions/booking';

import { filterBySearchValue, prepareInitials, prepareName, formatPhoneNumber } from 'utils';

import { containers } from 'testIDs';

import styles from './styles';

const IDs = containers.SearchModal;

class PassengersList extends PureComponent {
  static propTypes = {
    booking: PropTypes.object,
    onClose: PropTypes.func,
    passengers: PropTypes.array,
    savePassenger: PropTypes.func
  };

  state = {
    searchValue: ''
  };

  handleSearchValueChange = (searchValue) => {
    this.setState({ searchValue });
  };

  preparePassengers = () => {
    const { passengers } = this.props;
    const { searchValue } = this.state;

    return passengers && searchValue
      ? filterBySearchValue(passengers, ['firstName', 'lastName'], searchValue)
      : passengers;
  };

  onPressItem = (id) => {
    const { savePassenger, onClose } = this.props;
    onClose();
    setTimeout(() => savePassenger(id), 350); // for smooth animation
  };

  renderItem = ({ item, index }) => {
    const { phone, id, avatarUrl } = item;
    const { booking: { passengerId } } = this.props;

    const isSelected = id === passengerId;

    return (
      <ListItem
        avatarTitle={prepareInitials(item)}
        isSelected={isSelected}
        onPress={() => this.onPressItem(id)}
        avatarUrl={avatarUrl}
        title={prepareName(item)}
        titleStyle={styles.titleName}
        subTitle={formatPhoneNumber(phone)}
        testID={`${IDs.list}[${index}]`}
      />
    );
  };

  keyExtractor = item => String(item.id);

  renderSeparator = () => <Divider left={64} />;

  render() {
    const { searchValue } = this.state;
    const passengers = this.preparePassengers();

    return (
      <SearchList
        type="inline"
        searchValue={searchValue}
        onSearchValueChange={this.handleSearchValueChange}
        placeholder="Search Name"
        keyboardShouldPersistTaps="handled"
        data={passengers || []}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        style={styles.list}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

const mapStateToProps = ({ booking }) => ({
  passengers: booking.formData.passengers
});

const mapDispatchToProps = ({
  savePassenger
});

export default connect(mapStateToProps, mapDispatchToProps)(PassengersList);
