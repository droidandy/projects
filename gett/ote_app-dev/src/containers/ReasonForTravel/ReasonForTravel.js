import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, SearchList, ListItem } from 'components';
import { filterBySearchValue } from 'utils';
import { changeFields } from 'actions/booking';
import { containers } from 'testIDs';
import styles from './styles';

const IDs = containers.SearchModal;

class ReasonForTravel extends PureComponent {
  static propTypes = {
    booking: PropTypes.object,
    changeFields: PropTypes.func,
    onClose: PropTypes.func,
    travelReasons: PropTypes.array
  };

  state = {
    searchValue: ''
  };

  keyExtractor = item => String(item.id);

  onChangeTravelReason = (travelReasonId) => {
    const { onClose, changeFields } = this.props;
    onClose();
    setTimeout(() => changeFields({ travelReasonId }), 350); // for smooth animation
  };

  renderItem = ({ item, index }) => {
    const { booking: { travelReasonId: travelReason } } = this.props;
    const travelReasonId = item.id.toString();
    const isSelected = travelReason === travelReasonId;

    return (
      <ListItem
        titleStyle={styles.reasonName}
        title={item.name}
        isSelected={isSelected}
        onPress={() => this.onChangeTravelReason(travelReasonId)}
        testID={`${IDs.list}[${index}]`}
      />
    );
  };

  renderSeparator = () => <Divider />;

  filterItems = () => filterBySearchValue(this.props.travelReasons, ['name', 'id'], this.state.searchValue);

  handleSearchValueChange = (searchValue) => {
    this.setState({ searchValue });
  };

  render() {
    const { searchValue } = this.state;
    return (
      <SearchList
        type="inline"
        searchValue={searchValue}
        onSearchValueChange={this.handleSearchValueChange}
        placeholder="Search Reason"
        keyboardShouldPersistTaps="handled"
        data={this.filterItems()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

const mapStateToProps = ({ booking }) => ({
  travelReasons: booking.formData.travelReasons
});

const mapDispatchToProps = ({
  changeFields
});

export default connect(mapStateToProps, mapDispatchToProps)(ReasonForTravel);
